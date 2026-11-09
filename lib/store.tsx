'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { ADMISSIONS_REVIEW_CONDITION, AGENCY, SEED_APPLICATIONS } from './fixtures'
import type { Application, AppEvent, Condition, CrmHold, Document, Stage } from './types'
import { computeReadiness, computeRoute } from './readiness'
import { HOLD_REASON_LABEL } from './holds'
import { withCrmPush } from './crm'
import { NEW_UP_OFFER_UPDATE } from './documents'

export function newId(prefix = 'id'): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${rand}`
}

// The active user drives visibility: the owner sees the whole agency, a
// counsellor sees only their own applications.
export type ActiveUser = string

export interface StudentSession {
  email: string
  appId: string
}

interface StoreValue {
  applications: Application[]
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
  attachRequirementDoc: (
    appId: string,
    requirementId: string,
    fileName: string,
    actor?: 'agent' | 'student',
  ) => boolean
  // Student portal: the signed-in student and the application they can see.
  studentSession: StudentSession | null
  signInStudent: (session: StudentSession) => void
  signOutStudent: () => void
  // Student uploads evidence for an outstanding requirement or offer condition.
  studentUpload: (appId: string, itemId: string, label: string) => void
  // Student accepts the unconditional offer online.
  acceptOffer: (appId: string) => void
  updateDocument: (appId: string, docId: string, patch: Partial<Document>) => void
  updateCondition: (appId: string, condId: string, patch: Partial<Condition>) => void
  setNotes: (appId: string, notes: string) => void
  recomputeRoute: (appId: string) => void
  // Admissions: approve the review and push the verified record to Dynamics 365.
  approve: (appId: string, officer: string) => void
  // Admissions: put the review on hold with one reason and a note.
  hold: (appId: string, hold: Omit<CrmHold, 'savedAt'>) => void
  // Agent has opened the application, so clear its unseen-update marker.
  markSeen: (appId: string) => void
  // Agent has opened Activity or Documents, so later UP items count as new.
  markActivitySeen: (appId: string) => void
  // Agent uploads the student's visa approval letter.
  uploadVisaApproval: (appId: string, fileName: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(SEED_APPLICATIONS)
  const [activeUserId, setActiveUserId] = useState<ActiveUser>('c-grace')

  const isOwner = useMemo(
    () => AGENCY.counsellors.find((c) => c.id === activeUserId)?.role === 'owner',
    [activeUserId],
  )

  // Direct applications belong to UP, not the agency, so agents never see them.
  const visibleApplications = useMemo(() => {
    const agency = applications.filter((a) => a.channel !== 'direct')
    return isOwner ? agency : agency.filter((a) => a.agentId === activeUserId)
  }, [applications, isOwner, activeUserId])

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
        fields: a.fields.map((f) =>
          f.key === key
            ? { ...f, value, status: value.trim() === '' ? 'missing' : 'confirmed' }
            : f,
        ),
      }))
    },
    [updateApplication],
  )

  const addDocument = useCallback(
    (appId: string, doc: Document) => {
      updateApplication(appId, (a) => ({
        ...a,
        documents: [...a.documents, { addedAt: new Date().toISOString(), ...doc }],
      }))
    },
    [updateApplication],
  )

  // Attach a document straight onto an outstanding requirement: files the doc,
  // marks the requirement met, clears any matching open English condition and
  // logs it. Returns true when that closed the last gap and the file moves to
  // admissions for the unconditional decision.
  const attachRequirementDoc = useCallback(
    (
      appId: string,
      requirementId: string,
      fileName: string,
      actor: 'agent' | 'student' = 'agent',
    ): boolean => {
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
        movedToReview = a.stage === 'Conditional offer' && evidenceMet && !stillOpen
        const events: AppEvent[] = [
          ...a.events,
          {
            ts,
            actor,
            label: `Document added: ${req?.label ?? 'evidence'}`,
            detail: fileName || 'Document',
            channel: actor === 'student' ? 'student-portal' : 'agent-tool',
            attachments: [{ name: fileName || 'evidence.pdf', addedTo: 'Applicant file' }],
          },
        ]
        if (movedToReview) {
          events.push({
            ts,
            actor: 'up',
            label: 'Conditions met — with admissions',
            detail: 'Waiting on UP admissions for the unconditional decision.',
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

  const approve = useCallback(
    (appId: string, officer: string) => {
      const ts = new Date().toISOString()
      updateApplication(appId, (a) => {
        // Approval clears the standing admissions sign-off condition; anything
        // else still open keeps the offer conditional.
        const conditions = a.conditions.map((c) =>
          c.label === ADMISSIONS_REVIEW_CONDITION ? { ...c, status: 'cleared' as const } : c,
        )
        const open = conditions.some((c) => c.status !== 'cleared')
        const stage: Stage = open ? 'Conditional offer' : 'Unconditional'
        const events: AppEvent[] = [
          ...a.events,
          {
            ts,
            actor: 'up',
            label: 'Approved by admissions',
            detail: `${officer} signed off the review. Record pushed to Dynamics 365.`,
            channel: 'system',
          },
        ]
        const offerLabel =
          stage === 'Unconditional' ? 'Unconditional offer issued' : 'Conditional offer issued'
        if (stage !== a.stage) events.push({ ts, actor: 'up', label: offerLabel })
        return withCrmPush(
          {
            ...a,
            conditions,
            stage,
            daysInStage: stage !== a.stage ? 0 : a.daysInStage,
            crmHold: undefined,
            looIssuedBy: a.looIssuedBy ?? 'up',
            unseenUpdate:
              stage !== a.stage
                ? stage === 'Conditional offer' && (a.looIssuedBy ?? 'up') === 'up'
                  ? NEW_UP_OFFER_UPDATE
                  : offerLabel
                : 'Approved by admissions',
            events,
          },
          ts,
        )
      })
    },
    [updateApplication],
  )

  const hold = useCallback(
    (appId: string, h: Omit<CrmHold, 'savedAt'>) => {
      const ts = new Date().toISOString()
      updateApplication(appId, (a) => ({
        ...a,
        crmHold: { ...h, savedAt: ts },
        events: [
          ...a.events,
          {
            ts,
            actor: 'up',
            label: `On hold — ${HOLD_REASON_LABEL[h.reason]}`,
            detail: h.note ? `${h.savedBy}: ${h.note}` : h.savedBy,
            channel: 'system',
          },
        ],
      }))
    },
    [updateApplication],
  )

  const markSeen = useCallback((appId: string) => {
    setApplications((prev) =>
      prev.some((a) => a.id === appId && a.unseenUpdate)
        ? prev.map((a) => (a.id === appId ? { ...a, unseenUpdate: undefined } : a))
        : prev,
    )
  }, [])

  const uploadVisaApproval = useCallback(
    (appId: string, fileName: string) => {
      const ts = new Date().toISOString()
      const docId = newId('doc')
      updateApplication(appId, (a) => ({
        ...a,
        documents: [
          ...a.documents,
          {
            id: docId,
            type: 'Visa',
            fileName: `VisaApproval_${a.preId}.pdf`,
            originalName: fileName || 'visa_approval.pdf',
            language: 'English',
            status: 'checked',
            pages: 1,
          },
        ],
        visa: { state: 'approved', updatedAt: ts, approvalDoc: docId },
        events: [
          ...a.events,
          {
            ts,
            actor: 'agent',
            label: 'Visa approval uploaded',
            detail: fileName || 'Visa approval',
            channel: 'agent-tool',
            attachments: [{ name: fileName || 'visa_approval.pdf', addedTo: 'Applicant file' }],
          },
        ],
      }))
    },
    [updateApplication],
  )

  const [studentSession, setStudentSession] = useState<StudentSession | null>(null)
  const signOutStudent = useCallback(() => setStudentSession(null), [])

  const studentUpload = useCallback(
    (appId: string, itemId: string, label: string) => {
      const app = applications.find((a) => a.id === appId)
      if (!app) return
      const fileName = `${label.replace(/[^a-z0-9]+/gi, '_')}.pdf`
      if (app.requirements.some((r) => r.id === itemId)) {
        attachRequirementDoc(appId, itemId, fileName, 'student')
        return
      }
      // An offer condition: file the document and hand it to UP to verify.
      const ts = new Date().toISOString()
      const docId = newId('doc')
      updateApplication(appId, (a) => ({
        ...a,
        documents: [
          ...a.documents,
          {
            id: docId,
            type: 'Supporting',
            fileName: `Evidence_${a.preId}.pdf`,
            originalName: fileName,
            language: 'English',
            status: 'checked',
            pages: 1,
            addedAt: ts,
          },
        ],
        conditions: a.conditions.map((c) =>
          c.id === itemId ? { ...c, status: 'submitted' as const, evidence: docId } : c,
        ),
        unseenUpdate: `Student uploaded: ${label}`,
        events: [
          ...a.events,
          {
            ts,
            actor: 'student',
            label: `Document added: ${label}`,
            detail: 'Uploaded by the student · with UP admissions to check',
            channel: 'student-portal',
            kind: 'document',
            attachments: [{ name: fileName, addedTo: 'Applicant file' }],
          },
        ],
      }))
    },
    [applications, attachRequirementDoc, updateApplication],
  )

  const acceptOffer = useCallback(
    (appId: string) => {
      const ts = new Date().toISOString()
      updateApplication(appId, (a) => ({
        ...a,
        offerAcceptedAt: ts,
        unseenUpdate: 'Student accepted the offer',
        events: [
          ...a.events,
          {
            ts,
            actor: 'student',
            label: 'Offer accepted online',
            detail: `${a.studentName} accepted the unconditional Letter of Offer.`,
            channel: 'student-portal',
          },
        ],
      }))
    },
    [updateApplication],
  )

  const markActivitySeen = useCallback(
    (appId: string) => {
      updateApplication(appId, (a) => ({ ...a, activityViewedAt: new Date().toISOString() }))
    },
    [updateApplication],
  )

  const value: StoreValue = {
    studentSession,
    signInStudent: setStudentSession,
    signOutStudent,
    studentUpload,
    acceptOffer,
    markSeen,
    markActivitySeen,
    uploadVisaApproval,
    applications,
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
    setNotes,
    recomputeRoute,
    approve,
    hold,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export { AGENCY, computeReadiness }
