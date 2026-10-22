'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Application, Course, Document, Field, Requirement } from './types'
import { newIdSync } from './id'
import { deriveRequirements } from './derive'
import { programmeToCourse, type CatalogProgramme } from './catalog'
import { computeReadiness } from './readiness'
import type { DocumentReadResult } from './ai-contract'
import { buildBlankFields, FIELD_TOTAL } from './blank-fields'
import { ADMISSIONS_REVIEW_CONDITION } from './fixtures'

export const WIZARD_STEPS = [
  { key: 1, label: 'Student and course' },
  { key: 2, label: 'Documents' },
  { key: 3, label: 'Check and submit' },
] as const

export type StepKey = 1 | 2 | 3

interface Student {
  given: string
  family: string
  passport: string
}

export interface DuplicateStatus {
  state: 'idle' | 'checking' | 'clear' | 'hold'
  message?: string
}

interface WizardValue {
  step: StepKey
  goToStep: (s: StepKey) => void
  maxStepReached: StepKey
  student: Student
  setStudent: (patch: Partial<Student>) => void
  duplicate: DuplicateStatus
  setDuplicate: (d: DuplicateStatus) => void
  course: Course | null
  setCourse: (p: CatalogProgramme, intake: string) => void
  clearCourse: () => void
  requirements: Requirement[]
  documents: Document[]
  fields: Field[]
  notes: string
  setNotes: (v: string) => void
  addDocumentRow: (doc: Document) => void
  removeDocument: (id: string) => void
  updateDocumentRow: (id: string, patch: Partial<Document>) => void
  applyExtraction: (
    reqCategory: string | undefined,
    extracted: DocumentReadResult['fields'],
    docId: string,
  ) => void
  fieldsExtracted: number
  setRequirementStatus: (id: string, status: Requirement['status'], evidence?: string) => void
  setFieldValue: (key: string, value: string) => void
  confirmField: (key: string) => void
  confirmAllAi: () => void
  buildApplication: (agentId: string, agencyId: string) => Application
  draft: Application
  readiness: ReturnType<typeof computeReadiness>
}

const WizardContext = createContext<WizardValue | null>(null)

const NAME_KEYS = new Set(['given_name', 'family_name'])

function normaliseName(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function fieldValue(fields: Field[], key: string): string {
  return fields.find((f) => f.key === key)?.value.trim() ?? ''
}

const PRE_ID = `UP${Math.floor(248900 + Math.random() * 90)}`

const EMPTY_COURSE: Course = {
  brand: 'NZMA',
  programmeName: '',
  level: '',
  levelGroup: 'Vocational',
  campus: '',
  intakeDate: '',
  priceBundle: '',
  durationMonths: 0,
}

export function WizardProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<StepKey>(1)
  const [maxStepReached, setMax] = useState<StepKey>(1)
  const [student, setStudentState] = useState<Student>({ given: '', family: '', passport: '' })
  const [duplicate, setDuplicate] = useState<DuplicateStatus>({ state: 'idle' })
  const [course, setCourseState] = useState<Course | null>(null)
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [fields, setFields] = useState<Field[]>(() => buildBlankFields())
  const [notes, setNotes] = useState('')

  const goToStep = useCallback((s: StepKey) => {
    setStep(s)
    setMax((m) => (s > m ? s : m))
  }, [])

  const setStudent = useCallback((patch: Partial<Student>) => {
    setStudentState((prev) => ({ ...prev, ...patch }))
    setFields((prev) =>
      prev.map((f) => {
        const v =
          f.key === 'given_name' ? patch.given : f.key === 'family_name' ? patch.family : undefined
        if (v === undefined || f.source === 'ai' && f.status !== 'missing') return f
        return { ...f, value: v, source: 'agent', status: v.trim() ? 'confirmed' : 'missing' }
      }),
    )
  }, [])

  const nationality = fields.find((f) => f.key === 'nationality')?.value ?? ''

  const setCourse = useCallback(
    (p: CatalogProgramme, intake: string) => {
      const next = programmeToCourse(p, intake)
      setCourseState(next)
      // Selecting the course + intake satisfies the course requirement itself.
      setRequirements(
        deriveRequirements(next, nationality).map((r) =>
          r.category === 'course' ? { ...r, status: 'met' as const } : r,
        ),
      )
      setFields((f) => applyCourseFields(f, next))
    },
    [nationality],
  )

  const clearCourse = useCallback(() => {
    setCourseState(null)
    setRequirements([])
  }, [])

  const addDocumentRow = useCallback((doc: Document) => {
    setDocuments((prev) => [...prev, doc])
  }, [])

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const updateDocumentRow = useCallback((id: string, patch: Partial<Document>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }, [])

  const applyExtraction = useCallback(
    (reqCategory: string | undefined, extracted: DocumentReadResult['fields'], docId: string) => {
      setFields((prev) =>
        prev.map((f) => {
          const hit = extracted.find((e) => e.key === f.key)
          if (!hit) return f
          const typed = f.source === 'agent' ? f.value.trim() : ''
          const disagrees =
            NAME_KEYS.has(f.key) && typed !== '' && normaliseName(typed) !== normaliseName(hit.value)
          return {
            ...f,
            value: hit.value,
            source: 'ai',
            status: disagrees ? 'conflict' : 'ai',
            conflictNote: disagrees
              ? `You entered "${typed}" in step 1. Check which is correct.`
              : undefined,
            confidence: hit.confidence,
            sourceDoc: docId,
            sourcePage: hit.page,
          }
        }),
      )
      if (reqCategory) {
        // A document flips every still-missing requirement in its category to
        // met (e.g. a passport satisfies both identity items).
        setRequirements((prev) =>
          prev.map((r) =>
            r.category === reqCategory && r.status === 'missing'
              ? { ...r, status: 'met', evidence: r.evidence ?? docId }
              : r,
          ),
        )
      }
    },
    [],
  )

  const setRequirementStatus = useCallback(
    (id: string, status: Requirement['status'], evidence?: string) => {
      setRequirements((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status, evidence: evidence ?? r.evidence } : r)),
      )
    },
    [],
  )

  const setFieldValue = useCallback((key: string, value: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.key === key
          ? {
              ...f,
              value,
              status: value.trim() === '' ? 'missing' : 'confirmed',
              conflictNote: undefined,
            }
          : f,
      ),
    )
  }, [])

  const confirmField = useCallback((key: string) => {
    setFields((prev) =>
      prev.map((f) => (f.key === key && f.status !== 'missing' ? { ...f, status: 'confirmed' } : f)),
    )
  }, [])

  const confirmAllAi = useCallback(() => {
    setFields((prev) =>
      prev.map((f) =>
        f.source === 'ai' && f.status === 'ai'
          ? { ...f, status: 'confirmed' }
          : f,
      ),
    )
  }, [])

  const fieldsExtracted = useMemo(
    () => fields.filter((f) => f.source === 'ai' && f.value.trim() !== '').length,
    [fields],
  )

  const draft: Application = useMemo(
    () => ({
      id: 'draft',
      preId: PRE_ID,
      studentName:
        [fieldValue(fields, 'given_name'), fieldValue(fields, 'family_name')]
          .filter(Boolean)
          .join(' ') || 'New student',
      agentId: 'draft',
      agencyId: 'psl',
      course: course ?? EMPTY_COURSE,
      stage: 'Draft',
      route: 'auto',
      documents,
      fields,
      requirements,
      conditions: deriveConditions(requirements, (i) => `draft-cond-${i}`),
      events: [],
      notesToAdmissions: notes,
      daysInStage: 0,
      createdAt: new Date().toISOString(),
    }),
    [course, documents, fields, requirements, notes],
  )

  const readiness = useMemo(() => computeReadiness(draft), [draft])

  const buildApplication = useCallback(
    (agentId: string, agencyId: string): Application => ({
      ...draft,
      id: newIdSync('app'),
      agentId,
      agencyId,
      conditions: deriveConditions(requirements, () => newIdSync('cond')),
    }),
    [draft, requirements],
  )

  const value: WizardValue = {
    step,
    goToStep,
    maxStepReached,
    student,
    setStudent,
    duplicate,
    setDuplicate,
    course,
    setCourse,
    clearCourse,
    requirements,
    documents,
    fields,
    notes,
    setNotes,
    addDocumentRow,
    removeDocument,
    updateDocumentRow,
    applyExtraction,
    fieldsExtracted,
    setRequirementStatus,
    setFieldValue,
    confirmField,
    confirmAllAi,
    buildApplication,
    draft,
    readiness,
  }

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
}

export function useWizard(): WizardValue {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used within WizardProvider')
  return ctx
}

export { ADMISSIONS_REVIEW_CONDITION }

// Conditions on a conditional offer: the standing admissions-review condition
// plus any expiring or still-missing English requirement.
function deriveConditions(
  requirements: Requirement[],
  genId: (i: number) => string,
): Application['conditions'] {
  return [
    {
      id: genId(800),
      label: ADMISSIONS_REVIEW_CONDITION,
      owner: 'up',
      status: 'open',
      createdFrom: 'system',
    },
    ...requirements
      .filter((r) => r.status === 'expiring' || (r.category === 'english' && r.status === 'missing'))
      .map((r, i) => ({
        id: genId(i),
        label: r.label,
        owner: 'student' as const,
        status: 'open' as const,
        createdFrom: 'system' as const,
      })),
  ]
}

function applyCourseFields(fields: Field[], course: Course): Field[] {
  const map: Record<string, string> = {
    brand: course.brand,
    programme_name: course.programmeName,
    nzqa_level: course.level,
    campus: course.campus,
    intake_date: course.intakeDate,
    price_bundle: course.priceBundle,
    study_mode: 'Full-time, on campus',
  }
  return fields.map((f) =>
    map[f.key] !== undefined ? { ...f, value: map[f.key], source: 'up', status: 'verified' } : f,
  )
}

export { FIELD_TOTAL }
