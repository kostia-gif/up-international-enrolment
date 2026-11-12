// "Add application for existing student": group an agency's past applications
// into students, then copy one of them into a new application for a
// different course. Everything — identity, academic history, contact
// details, documents — comes across pre-filled but fully editable.
import type { Application, Document, Field } from './types'
import type { EnglishResult } from './entry-rules'
import { newIdSync } from './id'

function normaliseName(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function fieldValue(fields: Field[], key: string): string {
  return fields.find((f) => f.key === key)?.value.trim() ?? ''
}

// The identity an application is grouped under: the passport number when
// known, else the normalised full name. Two applications sharing a key are
// treated as the same student.
export function studentKey(app: Pick<Application, 'fields' | 'studentName'>): string {
  const passport = fieldValue(app.fields, 'passport_number')
  return passport ? `passport:${passport.toUpperCase()}` : `name:${normaliseName(app.studentName)}`
}

export interface ExistingStudent {
  key: string
  name: string
  nationality: string
  passportNumber?: string
  // Every application on file for this student, most recent first.
  applications: Application[]
}

// Groups the applications the current agent can already see into students.
// Callers pass in applications already scoped to the agency/agent.
export function groupExistingStudents(applications: Application[]): ExistingStudent[] {
  const groups = new Map<string, Application[]>()
  for (const app of applications) {
    const key = studentKey(app)
    groups.set(key, [...(groups.get(key) ?? []), app])
  }
  return Array.from(groups.values())
    .map((apps) => {
      const sorted = [...apps].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      const latest = sorted[0]
      return {
        key: studentKey(latest),
        name: latest.studentName,
        nationality: fieldValue(latest.fields, 'nationality'),
        passportNumber: fieldValue(latest.fields, 'passport_number') || undefined,
        applications: sorted,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

export interface CarriedSeed {
  student: { given: string; family: string }
  agentRef?: string
  fields: Field[]
  documents: Document[]
  readEvidence: { category: string; docId: string; labelMatch?: string }[]
  englishResult: EnglishResult | null
}

// Builds the pre-filled starting point for a new application by copying the
// student's most recent application on file. Nothing is locked — the agent
// can change anything, same as they could on the original application.
export function buildCarriedSeed(source: Application): CarriedSeed {
  // Old document ids still referenced by field.sourceDoc and
  // requirement.evidence need to point at the freshly cloned documents.
  const idMap = new Map<string, string>()
  const documents: Document[] = source.documents
    .filter((d) => d.type !== 'RPL' && d.type !== 'BankStatement')
    .map((d) => {
      const id = newIdSync('doc')
      idMap.set(d.id, id)
      return { ...d, id }
    })

  // The new course's own fields (brand, programme, intake, price…) are set
  // fresh once it's chosen; nothing from the Course section carries over.
  const fields: Field[] = source.fields
    .filter((f) => f.section !== 'Course')
    .map((f) => ({
      ...f,
      sourceDoc: f.sourceDoc ? (idMap.get(f.sourceDoc) ?? f.sourceDoc) : f.sourceDoc,
    }))

  const readEvidence = source.requirements
    .filter(
      (r) =>
        r.category !== 'course' &&
        (r.status === 'met' || r.status === 'expiring') &&
        r.evidence &&
        idMap.has(r.evidence),
    )
    .map((r) => ({ category: r.category, docId: idMap.get(r.evidence!)! }))

  const englishType = fieldValue(fields, 'english_test_type')
  const englishScore = fieldValue(fields, 'english_test_score')
  // Only the overall score survives on the field, not the per-skill bands, so
  // the carried result can still check the new course's minimum overall score.
  const englishResult: EnglishResult | null =
    englishType && englishScore ? { testType: englishType, overall: englishScore, bands: [] } : null

  return {
    student: {
      given: fieldValue(fields, 'given_name') || source.studentName.split(' ')[0] || '',
      family: fieldValue(fields, 'family_name') || source.studentName.split(' ').slice(1).join(' '),
    },
    agentRef: source.agentRef,
    fields,
    documents,
    readEvidence,
    englishResult,
  }
}

// Replaces each template field with the carried value where one exists,
// keeping the template's label/section/kind in case they've since changed.
export function applyCarriedFields(templateFields: Field[], carried: Field[]): Field[] {
  const byKey = new Map(carried.map((f) => [f.key, f]))
  return templateFields.map((f) => {
    const c = byKey.get(f.key)
    if (!c) return f
    return {
      ...f,
      value: c.value,
      source: c.source,
      status: c.status,
      sourceDoc: c.sourceDoc,
      sourcePage: c.sourcePage,
      confidence: c.confidence,
    }
  })
}
