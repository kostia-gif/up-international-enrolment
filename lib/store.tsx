'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  AGENCY,
  SEED_APPLICATIONS,
  SEED_EMAILS,
} from './fixtures'
import type {
  Application,
  AppEvent,
  Condition,
  Document,
  InboundEmail,
  Request,
  Stage,
} from './types'
import { computeReadiness, computeRoute } from './readiness'

export function newId(prefix = 'id'): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${rand}`
}

// The active user drives visibility: the owner sees the whole agency, a
// counsellor sees only their own applications.
export type ActiveUser = string // counsellor id

interface StoreValue {
  applications: Application[]
  emails: InboundEmail[]
  activeUserId: ActiveUser
  setActiveUserId: (id: ActiveUser) => void
  isOwner: boolean
  visibleApplications: Application[]
  getApplication: (id: string) => Application | undefined
  updateApplication: (id: string, updater: (a: Application) => Application) => void
  addApplication: (a: Application) => void
  addEvent: (appId: string, event: AppEvent) => void
  confirmField: (appId: string, key: string) => void
  confirmAllAiFields: (appId: string) => void
  setFieldValue: (appId: string, key: string, value: string) => void
  addDocument: (appId: string, doc: Document) => void
  attachRequirementDoc: (appId: string, requirementId: string, fileName: string) => boolean
  updateDocument: (appId: string, docId: string, patch: Partial<Document>) => void
  updateCondition: (appId: string, condId: string, patch: Partial<Condition>) => void
  addRequest: (appId: string, req: Request) => void
  removeRequest: (appId: string, type: Request['type']) => void
  setNotes: (appId: string, notes: string) => void
  recomputeRoute: (appId: string) => void
  simulateEmailCapture: () => { summary: string; applicationId?: string }
  // Admissions: fill a field with an AI suggestion that still needs approval.
  aiSuggestField: (appId: string, key: string, value: string) => void
  // Admissions: complete the review and push the file into Dynamics CRM,
  // issuing a conditional or unconditional Letter of Offer.
  submitToCrm: (appId: string, level: 'conditional' | 'unconditional') => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(SEED_APPLICATIONS)
  const [emails, setEmails] = useState<InboundEmail[]>(SEED_EMAILS)
  const [activeUserId, setActiveUserId] = useState<ActiveUser>('c-grace')

  const isOwner = useMemo(
    () => AGENCY.counsellors.find((c) => c.id === activeUserId)?.role === 'owner',
    [activeUserId],
  )

  const visibleApplications = useMemo(
    () => (isOwner ? applications : applications.filter((a) => a.agentId === activeUserId)),
    [applications, isOwner, activeUserId],
  )

  const getApplication = useCallback(
    (id: string) => applications.find((a) => a.id === id),
    [applications],
  )

  const updateApplication = useCallback(
    (id: string, updater: (a: Application) => Application) => {
      setApplications((prev) => prev.map((a) => (a.id === id ? updater(a) : a)))
    },
    [],
  )

  const addApplication = useCallback((a: Application) => {
    setApplications((prev) => [a, ...prev])
  }, [])

  const addEvent = useCallback(
    (appId: string, event: AppEvent) => {
      updateApplication(appId, (a) => ({ ...a, events: [...a.events, event] }))
    },
    [updateApplication],
  )

  const confirmField = useCallback(
    (appId: string, key: string) => {
      updateApplication(appId, (a) => ({
        ...a,
        fields: a.fields.map((f) =>
          f.key === key && f.status !== 'missing' ? { ...f, status: 'confirmed' } : f,
        ),
      }))
    },
    [updateApplication],
  )

  const confirmAllAiFields = useCallback(
    (appId: string) => {
      updateApplication(appId, (a) => ({
        ...a,
        fields: a.fields.map((f) =>
          f.source === 'ai' && (f.status === 'ai' || f.status === 'verified')
            ? { ...f, status: 'confirmed' }
            : f,
        ),
      }))
    },
    [updateApplication],
  )

  const setFieldValue = useCallback(
    (appId: string, key: string, value: string) => {
      updateApplication(appId, (a) => ({
        ...a,
        fields: a.fields.map((f) => {
          if (f.key !== key) return f
          const status =
            value.trim() === ''
              ? 'missing'
              : f.source === 'ai'
                ? 'confirmed'
                : 'confirmed'
          return { ...f, value, status }
        }),
      }))
    },
    [updateApplication],
  )

  const addDocument = useCallback(
    (appId: string, doc: Document) => {
      updateApplication(appId, (a) => ({ ...a, documents: [...a.documents, doc] }))
    },
    [updateApplication],
  )

  // Attach a document straight onto an outstanding requirement: files the doc,
  // marks the requirement met, clears any matching open English condition, logs
  // the trail, and — if that was the last gap — moves the file to admissions.
  // Returns true when the application transitions to admissions review.
  const attachRequirementDoc = useCallback(
    (appId: string, requirementId: string, fileName: string): boolean => {
      let movedToReview = false
      const ts = new Date().toISOString()
      const docId = newId('doc')
      updateApplication(appId, (a) => {
        const req = a.requirements.find((r) => r.id === requirementId)
        const doc: Document = {
          id: docId,
          type: 'Supporting',
          fileName: `Evidence_${a.preId}.pdf`,
          originalName: fileName || 'evidence.pdf',
          language: 'English',
          status: 'checked',
          pages: 1,
        }
        const requirements = a.requirements.map((r) =>
          r.id === requirementId ? { ...r, status: 'met' as const, evidence: docId } : r,
        )
        const englishReq = req?.category === 'english'
        const conditions = a.conditions.map((c) =>
          englishReq && c.status !== 'cleared' && /english|ielts|pte|toefl/i.test(c.label)
            ? { ...c, status: 'cleared' as const, evidence: docId }
            : c,
        )
        const next = { ...a, documents: [...a.documents, doc], requirements, conditions }
        const evidenceMet = computeReadiness(next).evidenceMet
        const stillOpen = conditions.some((c) => c.status === 'open')
        movedToReview = evidenceMet && !stillOpen && a.route !== 'review'
        const events: AppEvent[] = [
          ...a.events,
          {
            ts,
            actor: 'agent',
            label: `Document added: ${req?.label ?? 'evidence'}`,
            detail: `${fileName || 'Document'} captured to the applicant file`,
            channel: 'agent-tool',
            attachments: [{ name: fileName || 'evidence.pdf', addedTo: 'Applicant file' }],
          },
        ]
        if (movedToReview) {
          events.push({
            ts,
            actor: 'up',
            label: 'All evidence received — now with admissions to review',
            detail:
              'The final gap was closed. The application has moved to UP admissions for the unconditional decision.',
          })
        }
        return { ...next, route: movedToReview ? 'review' : a.route, events }
      })
      return movedToReview
    },
    [updateApplication],
  )

  const updateDocument = useCallback(
    (appId: string, docId: string, patch: Partial<Document>) => {
      updateApplication(appId, (a) => ({
        ...a,
        documents: a.documents.map((d) => (d.id === docId ? { ...d, ...patch } : d)),
      }))
    },
    [updateApplication],
  )

  const updateCondition = useCallback(
    (appId: string, condId: string, patch: Partial<Condition>) => {
      updateApplication(appId, (a) => ({
        ...a,
        conditions: a.conditions.map((c) => (c.id === condId ? { ...c, ...patch } : c)),
      }))
    },
    [updateApplication],
  )

  const addRequest = useCallback(
    (appId: string, req: Request) => {
      updateApplication(appId, (a) => ({
        ...a,
        requests: [...a.requests.filter((r) => r.type !== req.type), req],
      }))
    },
    [updateApplication],
  )

  const removeRequest = useCallback(
    (appId: string, type: Request['type']) => {
      updateApplication(appId, (a) => ({
        ...a,
        requests: a.requests.filter((r) => r.type !== type),
      }))
    },
    [updateApplication],
  )

  const setNotes = useCallback(
    (appId: string, notes: string) => {
      updateApplication(appId, (a) => ({ ...a, notesToAdmissions: notes }))
    },
    [updateApplication],
  )

  const recomputeRoute = useCallback(
    (appId: string) => {
      updateApplication(appId, (a) => ({ ...a, route: computeRoute(a) }))
    },
    [updateApplication],
  )

  const aiSuggestField = useCallback(
    (appId: string, key: string, value: string) => {
      updateApplication(appId, (a) => ({
        ...a,
        fields: a.fields.map((f) =>
          f.key === key ? { ...f, value, source: 'ai', status: 'ai' } : f,
        ),
      }))
    },
    [updateApplication],
  )

  const submitToCrm = useCallback(
    (appId: string, level: 'conditional' | 'unconditional') => {
      const ts = new Date().toISOString()
      updateApplication(appId, (a) => {
        const stage: Stage = level === 'unconditional' ? 'Unconditional' : 'Conditional offer'
        // Any pending discount / special-admission request is signed off as the
        // officer completes the review.
        const requests = a.requests.map((r) =>
          r.status === 'pending' ? { ...r, status: 'approved' as const } : r,
        )
        // An unconditional decision clears every outstanding condition.
        const conditions =
          level === 'unconditional'
            ? a.conditions.map((c) => ({ ...c, status: 'cleared' as const }))
            : a.conditions
        const events: AppEvent[] = [
          ...a.events,
          {
            ts,
            actor: 'up',
            label: 'Reviewed by UP admissions',
            detail:
              'Mel completed the step-by-step review and pushed the verified record into Dynamics CRM.',
            channel: 'system',
          },
          {
            ts,
            actor: 'up',
            label:
              level === 'unconditional'
                ? 'Unconditional offer issued'
                : 'Conditional offer issued',
            detail:
              level === 'unconditional'
                ? 'All evidence verified and data confirmed — unconditional Letter of Offer generated.'
                : 'Conditional Letter of Offer generated — outstanding conditions tracked to completion.',
          },
        ]
        return { ...a, stage, requests, conditions, crmPushedAt: ts, events }
      })
    },
    [updateApplication],
  )

  const simulateEmailCapture = useCallback((): { summary: string; applicationId?: string } => {
    // Attach to the first visible application that has an open condition.
    const target = applications.find((a) =>
      a.conditions.some((c) => c.status === 'open'),
    )
    const ts = new Date().toISOString()
    if (!target) {
      const email: InboundEmail = {
        id: newId('em'),
        ts,
        sender: 'new.enquiry@example.com',
        subject: 'New documents for enrolment',
        matchedApplicationId: undefined,
        documents: ['passport.pdf'],
      }
      setEmails((prev) => [email, ...prev])
      return { summary: 'Email received — needs matching to an application' }
    }
    const openCond = target.conditions.find((c) => c.status === 'open')!
    const docId = newId('doc')
    const doc: Document = {
      id: docId,
      type: 'Supporting',
      fileName: `Supporting_${target.preId}.pdf`,
      originalName: 'attachment_from_email.pdf',
      language: 'English',
      status: 'checked',
      pages: 1,
    }
    const summary = `1 document added, condition "${openCond.label}" cleared`
    updateApplication(target.id, (a) => ({
      ...a,
      documents: [...a.documents, doc],
      conditions: a.conditions.map((c) =>
        c.id === openCond.id ? { ...c, status: 'cleared', evidence: docId } : c,
      ),
      events: [
        ...a.events,
        {
          ts,
          actor: 'email',
          label: 'Captured from email',
          detail: summary,
          channel: 'email',
          attachments: [{ name: 'attachment_from_email.pdf', addedTo: 'Applicant file' }],
        },
      ],
    }))
    const email: InboundEmail = {
      id: newId('em'),
      ts,
      sender: 'student.family@example.com',
      subject: `Documents for ${target.studentName}`,
      matchedApplicationId: target.id,
      extractedSummary: summary,
      documents: ['attachment_from_email.pdf'],
    }
    setEmails((prev) => [email, ...prev])
    return { summary, applicationId: target.id }
  }, [applications, updateApplication])

  const value: StoreValue = {
    applications,
    emails,
    activeUserId,
    setActiveUserId,
    isOwner,
    visibleApplications,
    getApplication,
    updateApplication,
    addApplication,
    addEvent,
    confirmField,
    confirmAllAiFields,
    setFieldValue,
    addDocument,
    attachRequirementDoc,
    updateDocument,
    updateCondition,
    addRequest,
    removeRequest,
    setNotes,
    recomputeRoute,
    simulateEmailCapture,
    aiSuggestField,
    submitToCrm,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export { AGENCY, computeReadiness }
