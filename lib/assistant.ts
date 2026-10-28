import type { Application } from './types'
import { outstandingDocs, waitingOn, WAITING_LABEL } from './dashboard'
import {
  checkEligibility,
  summariseTopTasks,
  worstSeverity,
  type EligibilityCheck,
  type RiskLevel,
  type TopTask,
} from './eligibility'

export interface AssistantApp {
  id: string
  student: string
  stage: string
  programme: string
  nationality: string
  courseType: string
  waitingOn: string
  risk: { level: RiskLevel; approvalRate: number } | null
  worst: 'danger' | 'warning' | 'ok'
  checks: EligibilityCheck[]
  outstandingDocs: string[]
  openConditions: string[]
}

export interface AssistantContext {
  focusAppId?: string
  applications: AssistantApp[]
  topTasks: TopTask[]
}

export function buildAssistantContext(apps: Application[], focusAppId?: string): AssistantContext {
  return {
    focusAppId,
    topTasks: summariseTopTasks(apps, 8),
    applications: apps.map((a) => {
      const result = checkEligibility(a)
      return {
        id: a.id,
        student: a.studentName,
        stage: a.stage,
        programme: a.course.programmeName,
        nationality: result.risk?.nationality ?? '',
        courseType: a.course.levelGroup,
        waitingOn: WAITING_LABEL[waitingOn(a)],
        risk: result.risk ? { level: result.risk.level, approvalRate: result.risk.approvalRate } : null,
        worst: worstSeverity(result),
        checks: result.checks,
        outstandingDocs: outstandingDocs(a).map((d) => d.label),
        openConditions: a.conditions.filter((c) => c.status === 'open').map((c) => c.label),
      }
    }),
  }
}
