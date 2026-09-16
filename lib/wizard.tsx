'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  Application,
  Course,
  Document,
  Field,
  FieldSection,
  Requirement,
  Request,
} from './types'
import { FIELD_TOTAL } from './fixtures'
import { newIdSync } from './id'
import { deriveRequirements } from './derive'
import { CATALOG, programmeToCourse, type CatalogProgramme } from './catalog'
import { computeReadiness } from './readiness'
import { type DropFile } from './simulate'
import { buildBlankFields } from './blank-fields'

export const WIZARD_STEPS = [
  { key: 1, label: 'Create application' },
  { key: 2, label: 'Documents' },
  { key: 3, label: 'Review and complete' },
  { key: 4, label: 'Requests and notes' },
] as const

export type StepKey = 1 | 2 | 3 | 4

interface Student {
  given: string
  family: string
  dob: string
  passport: string
  nationality: string
  agentRef: string
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
  courses: Course[]
  addCourse: (p: CatalogProgramme, intake: string) => void
  removeCourse: (index: number) => void
  hasBundle: boolean
  requirements: Requirement[]
  documents: Document[]
  fields: Field[]
  requests: Request[]
  notes: string
  setNotes: (v: string) => void
  // step 2
  addDocumentRow: (doc: Document) => void
  updateDocumentRow: (id: string, patch: Partial<Document>) => void
  applyExtraction: (
    reqCategory: string | undefined,
    extracted: DropFile['fields'],
    docId: string,
  ) => void
  fieldsExtracted: number
  // step 3
  setRequirementStatus: (id: string, status: Requirement['status'], evidence?: string) => void
  // step 4
  setFieldValue: (key: string, value: string) => void
  confirmField: (key: string) => void
  confirmAllAi: () => void
  confirmSectionAi: (section: FieldSection) => void
  // step 5
  upsertRequest: (req: Request) => void
  removeRequest: (type: Request['type']) => void
  // draft assembly
  buildApplication: (agentId: string, agencyId: string) => Application
  readiness: ReturnType<typeof computeReadiness>
}

const WizardContext = createContext<WizardValue | null>(null)

const PRE_ID = `UP${Math.floor(248900 + Math.random() * 90)}`

export function WizardProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<StepKey>(1)
  const [maxStepReached, setMax] = useState<StepKey>(1)
  const [student, setStudentState] = useState<Student>({
    given: '',
    family: '',
    dob: '',
    passport: '',
    nationality: '',
    agentRef: '',
  })
  const [duplicate, setDuplicate] = useState<DuplicateStatus>({ state: 'idle' })
  const [courses, setCourses] = useState<Course[]>([])
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [fields, setFields] = useState<Field[]>(() => buildBlankFields())
  const [requests, setRequests] = useState<Request[]>([])
  const [notes, setNotes] = useState('')

  const goToStep = useCallback((s: StepKey) => {
    setStep(s)
    setMax((m) => (s > m ? s : m))
  }, [])

  const setStudent = useCallback((patch: Partial<Student>) => {
    setStudentState((prev) => ({ ...prev, ...patch }))
  }, [])

  const rederive = useCallback((next: Course[], nationality: string) => {
    const derived = deriveRequirements(next, nationality)
    // Selecting the course(s) + intake satisfies the course requirement itself;
    // documents satisfy the rest.
    const withCourse =
      next.length > 0
        ? derived.map((r) => (r.category === 'course' ? { ...r, status: 'met' as const } : r))
        : derived
    setRequirements(withCourse)
  }, [])

  const addCourse = useCallback(
    (p: CatalogProgramme, intake: string) => {
      setCourses((prev) => {
        const next = [...prev, programmeToCourse(p, intake)]
        rederive(next, student.nationality)
        // seed course "up" fields from the first course
        setFields((f) => applyCourseFields(f, next[0]))
        return next
      })
    },
    [rederive, student.nationality],
  )

  const removeCourse = useCallback(
    (index: number) => {
      setCourses((prev) => {
        const next = prev.filter((_, i) => i !== index)
        rederive(next, student.nationality)
        return next
      })
    },
    [rederive, student.nationality],
  )

  const addDocumentRow = useCallback((doc: Document) => {
    setDocuments((prev) => [...prev, doc])
  }, [])

  const updateDocumentRow = useCallback((id: string, patch: Partial<Document>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }, [])

  const applyExtraction = useCallback(
    (reqCategory: string | undefined, extracted: DropFile['fields'], docId: string) => {
      setFields((prev) =>
        prev.map((f) => {
          const hit = extracted.find((e) => e.key === f.key)
          if (!hit) return f
          return {
            ...f,
            value: hit.value,
            source: 'ai',
            status: 'ai',
            confidence: hit.confidence,
            sourceDoc: docId,
            sourcePage: 1,
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
      prev.map((f) => {
        if (f.key !== key) return f
        const status = value.trim() === '' ? 'missing' : 'confirmed'
        return { ...f, value, status }
      }),
    )
  }, [])

  const confirmField = useCallback((key: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.key === key && f.status !== 'missing' ? { ...f, status: 'confirmed' } : f,
      ),
    )
  }, [])

  const confirmAllAi = useCallback(() => {
    setFields((prev) =>
      prev.map((f) =>
        f.source === 'ai' && (f.status === 'ai' || f.status === 'verified')
          ? { ...f, status: 'confirmed' }
          : f,
      ),
    )
  }, [])

  // Confirm every AI-populated field within one CRM section in a single action —
  // the "Confirm AI is correct" control in that section's header.
  const confirmSectionAi = useCallback((section: FieldSection) => {
    setFields((prev) =>
      prev.map((f) =>
        f.section === section &&
        f.source === 'ai' &&
        (f.status === 'ai' || f.status === 'verified' || f.status === 'conflict')
          ? { ...f, status: 'confirmed' }
          : f,
      ),
    )
  }, [])

  const upsertRequest = useCallback((req: Request) => {
    setRequests((prev) => [...prev.filter((r) => r.type !== req.type), req])
  }, [])

  const removeRequest = useCallback((type: Request['type']) => {
    setRequests((prev) => prev.filter((r) => r.type !== type))
  }, [])

  const fieldsExtracted = useMemo(
    () => fields.filter((f) => f.source === 'ai' && f.value.trim() !== '').length,
    [fields],
  )

  const draft: Application = useMemo(
    () => ({
      id: 'draft',
      preId: PRE_ID,
      studentName: `${student.given} ${student.family}`.trim() || 'New student',
      agentRef: student.agentRef,
      agentId: 'draft',
      agencyId: 'psl',
      course:
        courses[0] ??
        ({
          brand: 'NZMA',
          programmeName: '',
          level: '',
          levelGroup: 'Vocational',
          campus: '',
          intakeDate: '',
          priceBundle: '',
          durationMonths: 0,
        } as Course),
      bundle: courses.length > 1 ? courses : undefined,
      stage: 'Draft',
      route: 'auto',
      documents,
      fields,
      requirements,
      conditions: deriveConditions(requirements, requests, (i) => `draft-cond-${i}`),
      requests,
      events: [],
      notesToAdmissions: notes,
      daysInStage: 0,
      createdAt: new Date().toISOString(),
    }),
    [student, courses, documents, fields, requirements, requests, notes],
  )

  const readiness = useMemo(() => computeReadiness(draft), [draft])

  const buildApplication = useCallback(
    (agentId: string, agencyId: string): Application => {
      const conditions = deriveConditions(requirements, requests, () => newIdSync('cond'))
      return {
        ...draft,
        id: newIdSync('app'),
        agentId,
        agencyId,
        conditions,
      }
    },
    [draft, requirements, requests],
  )

  const value: WizardValue = {
    step,
    goToStep,
    maxStepReached,
    student,
    setStudent,
    duplicate,
    setDuplicate,
    courses,
    addCourse,
    removeCourse,
    hasBundle: courses.length > 1,
    requirements,
    documents,
    fields,
    requests,
    notes,
    setNotes,
    addDocumentRow,
    updateDocumentRow,
    applyExtraction,
    fieldsExtracted,
    setRequirementStatus,
    setFieldValue,
    confirmField,
    confirmAllAi,
    confirmSectionAi,
    upsertRequest,
    removeRequest,
    buildApplication,
    readiness,
  }

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
}

export function useWizard(): WizardValue {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used within WizardProvider')
  return ctx
}

// Standing condition on every offer: admissions must review before it goes
// unconditional. AI-generated for the pilot, so no offer is ever unconditional
// at submission.
export const ADMISSIONS_REVIEW_CONDITION = 'Application to be reviewed by UP admissions team'

// Conditions that attach to a conditional offer: the standing admissions-review
// condition, an expiring or still-missing English requirement, plus an own-cover
// insurance choice. Shared by the live draft (so readiness treats a missing
// English test as a condition, not a blocker) and the finally-built application.
function deriveConditions(
  requirements: Requirement[],
  requests: Request[],
  genId: (i: number) => string,
): Application['conditions'] {
  const conditions: Application['conditions'] = [
    {
      id: genId(800),
      label: ADMISSIONS_REVIEW_CONDITION,
      owner: 'up' as const,
      status: 'open' as const,
      createdFrom: 'system' as const,
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
  const insurance = requests.find((r) => r.type === 'insurance')
  if (insurance && /own cover/i.test(insurance.detail)) {
    conditions.push({
      id: genId(900),
      label: 'Own-cover insurance policy valid for full stay',
      owner: 'agent',
      status: 'open',
      createdFrom: 'system',
    })
  }
  return conditions
}

// Populate the course-section "up" fields when a course is chosen.
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
    map[f.key] !== undefined
      ? { ...f, value: map[f.key], source: 'up', status: 'verified' }
      : f,
  )
}

export { FIELD_TOTAL, CATALOG }
