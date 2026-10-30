'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Application, Course, DeclarationKey, Document, Field, Requirement } from './types'
import { answerConditions, resolveFields } from './field-specs'
import { buildDeclarations } from './declarations'
import { newIdSync } from './id'
import { deriveRequirements } from './derive'
import { programmeToCourse, type CatalogProgramme } from './catalog'
import { computeReadiness } from './readiness'
import type { DocumentReadResult } from './ai-contract'
import { buildBlankFields, FIELD_TOTAL } from './blank-fields'
import { ADMISSIONS_REVIEW_CONDITION } from './fixtures'
import type { RiskEvidenceInput } from './eligibility'
import {
  applyEntryRules,
  assessEntry,
  describeEnglishRule,
  englishRuleFor,
  suggestAlternatives,
  type CourseSuggestion,
  type EnglishResult,
  type EntryIssues,
} from './entry-rules'

export const WIZARD_STEPS = [
  { key: 1, label: 'Course and intake' },
  { key: 2, label: 'Documents' },
  { key: 3, label: 'Answers' },
  { key: 4, label: 'Review and offer' },
] as const

export type StepKey = 1 | 2 | 3 | 4

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
  // Field key the Answers step should expand and scroll to on next render.
  focusFieldKey: string | null
  focusField: (key: string | null) => void
  maxStepReached: StepKey
  student: Student
  setStudent: (patch: Partial<Student>) => void
  duplicate: DuplicateStatus
  setDuplicate: (d: DuplicateStatus) => void
  course: Course | null
  setCourse: (p: CatalogProgramme, intake: string) => void
  clearCourse: () => void
  requirements: Requirement[]
  entryIssues: EntryIssues
  suggestions: CourseSuggestion[]
  englishResult: EnglishResult | null
  setEnglishResult: (r: EnglishResult | null) => void
  documents: Document[]
  fields: Field[]
  notes: string
  setNotes: (v: string) => void
  fastTrack: boolean
  setFastTrack: (v: boolean) => void
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
  declarations: Record<DeclarationKey, boolean>
  setDeclaration: (key: DeclarationKey, accepted: boolean) => void
  buildApplication: (agentId: string, agencyId: string, acceptedBy: string) => Application
  draft: Application
  readiness: ReturnType<typeof computeReadiness>
  riskEvidence: RiskEvidenceInput
  setRiskEvidence: (patch: Partial<RiskEvidenceInput>) => void
  addFundsProof: () => void
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
  const [rawRequirements, setRequirements] = useState<Requirement[]>([])
  const [englishResult, setEnglishResult] = useState<EnglishResult | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [rawFields, setFields] = useState<Field[]>(() => buildBlankFields())
  const [notes, setNotes] = useState('')
  const [fastTrack, setFastTrack] = useState(false)
  const [declarations, setDeclarations] = useState<Record<DeclarationKey, boolean>>({
    terms: false,
    consultant: false,
  })
  const setDeclaration = useCallback((key: DeclarationKey, accepted: boolean) => {
    setDeclarations((d) => ({ ...d, [key]: accepted }))
  }, [])
  const fields = useMemo(
    () => resolveFields(rawFields, course?.intakeDate ?? ''),
    [rawFields, course],
  )

  const [focusFieldKey, focusField] = useState<string | null>(null)

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
      // Evidence already read keeps its categories met when the course changes.
      setRequirements((prev) =>
        deriveRequirements(next, nationality).map((r) => {
          if (r.category === 'course') return { ...r, status: 'met' as const }
          const carried = prev.find((p) => p.category === r.category && p.status === 'met')
          return carried ? { ...r, status: 'met' as const, evidence: carried.evidence } : r
        }),
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
              ? `The passport reads "${hit.value}" but "${typed}" was entered.`
              : undefined,
            conflictAlt: disagrees ? typed : undefined,
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
              conflictAlt: undefined,
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

  const entryIssues = useMemo(
    () => assessEntry(course, fields, englishResult),
    [course, fields, englishResult],
  )
  const requirements = useMemo(
    () => applyEntryRules(rawRequirements, entryIssues),
    [rawRequirements, entryIssues],
  )
  const suggestions = useMemo(
    () => suggestAlternatives(course, entryIssues),
    [course, entryIssues],
  )

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
      conditions: deriveConditions(requirements, fields, documents, course, (i) => `draft-cond-${i}`),
      events: [],
      notesToAdmissions: notes,
      fastTrack,
      daysInStage: 0,
      createdAt: new Date().toISOString(),
    }),
    [course, documents, fields, requirements, notes, fastTrack],
  )

  const readiness = useMemo(() => computeReadiness(draft), [draft])

  const [riskEvidence, setRiskEvidenceState] = useState<RiskEvidenceInput>({
    purpose: '',
    refusalsAddressed: false,
    fundsConfirmed: false,
  })
  const setRiskEvidence = useCallback((patch: Partial<RiskEvidenceInput>) => {
    setRiskEvidenceState((e) => ({ ...e, ...patch }))
  }, [])

  // POC stand-in for a real upload: adds a checked bank statement and marks
  // any financial requirement as met.
  const addFundsProof = useCallback(() => {
    const id = newIdSync('doc')
    setDocuments((prev) => [
      ...prev,
      {
        id,
        type: 'BankStatement',
        fileName: `BankStatement_${PRE_ID}.pdf`,
        originalName: 'bank_statement_6_months.pdf',
        language: 'English',
        status: 'checked',
        pages: 6,
      },
    ])
    setRequirements((prev) =>
      prev.map((r) =>
        /financ|bank|fund/i.test(r.label) && r.status !== 'met'
          ? { ...r, status: 'met', evidence: id }
          : r,
      ),
    )
    setRiskEvidenceState((e) => ({ ...e, fundsDocId: id }))
  }, [])

  const buildApplication = useCallback(
    (agentId: string, agencyId: string, acceptedBy: string): Application => ({
      ...draft,
      id: newIdSync('app'),
      agentId,
      agencyId,
      conditions: deriveConditions(requirements, fields, documents, course, () => newIdSync('cond')),
      declarations: buildDeclarations(acceptedBy, new Date().toISOString()),
    }),
    [draft, requirements, fields, documents, course],
  )

  const value: WizardValue = {
    step,
    goToStep,
    focusFieldKey,
    focusField,
    maxStepReached,
    student,
    setStudent,
    duplicate,
    setDuplicate,
    course,
    setCourse,
    clearCourse,
    requirements,
    entryIssues,
    suggestions,
    englishResult,
    setEnglishResult,
    documents,
    fields,
    notes,
    setNotes,
    fastTrack,
    setFastTrack,
    addDocumentRow,
    removeDocument,
    updateDocumentRow,
    applyExtraction,
    fieldsExtracted,
    setRequirementStatus,
    setFieldValue,
    confirmField,
    confirmAllAi,
    declarations,
    setDeclaration,
    buildApplication,
    draft,
    readiness,
    riskEvidence,
    setRiskEvidence,
    addFundsProof,
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
// plus any expiring or still-missing English requirement, plus conditions
// that follow from the student's answers (under 18, visa history, own cover).
function deriveConditions(
  requirements: Requirement[],
  fields: Field[],
  documents: Document[],
  course: Course | null,
  genId: (i: number) => string,
): Application['conditions'] {
  const englishShort = requirements.find((r) => r.category === 'english' && r.status === 'problem')
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
    ...(englishShort
      ? [
          {
            id: genId(700),
            label: `Meet English requirement: ${describeEnglishRule(englishRuleFor(course))}`,
            owner: 'student' as const,
            status: 'open' as const,
            createdFrom: 'system' as const,
          },
        ]
      : []),
    ...answerConditions(fields, documents).map((c, i) => ({
      ...c,
      id: genId(900 + i),
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
