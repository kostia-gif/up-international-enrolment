import {
  CATALOG,
  UNIVERSITY_NAME,
  blockEndsBefore,
  earliestStartAfter,
  intakeState,
  type CatalogProgramme,
} from './catalog'
import { destinationLabel } from './destinations'
import type { PlanBlock, StudyPlan } from './types'

export const MAX_PLAN_BLOCKS = 3

export function primaryBlock(plan: StudyPlan): PlanBlock | undefined {
  return plan.blocks.find((b) => b.role === 'primary')
}

export function sortedBlocks(plan: StudyPlan): PlanBlock[] {
  return [...plan.blocks].sort((a, b) => a.intake.localeCompare(b.intake))
}

export function englishProgramme(): CatalogProgramme | undefined {
  return CATALOG.find((p) => p.kind === 'english')
}

// The latest English intake that finishes before the primary starts.
export function englishIntakeBefore(english: CatalogProgramme, primaryIntake: string): string | undefined {
  return [...english.intakes]
    .sort()
    .reverse()
    .find((i) => intakeState(i) !== 'closed' && blockEndsBefore(english, i, primaryIntake))
}

// Step 1 is complete when a primary exists and, for a pathway, a destination is set.
export function planComplete(plan: StudyPlan): boolean {
  const p = primaryBlock(plan)
  if (!p) return false
  return p.programme.kind !== 'pathway' || !!p.destination
}

const monthYear = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })

export { monthYear }

// "UPIC Foundation (Standard), Mar 2027 → University of Auckland, BCom / LLB Conjoint – Accounting, from Feb 2028"
export function pathwayLine(plan: StudyPlan): string | null {
  const parts: string[] = []
  for (const b of sortedBlocks(plan)) {
    if (b.role === 'alternative') continue
    parts.push(`${b.programme.programmeName}, ${monthYear(b.intake)}`)
    if (b.destination && b.programme.pathwayUniversity) {
      const start = earliestStartAfter(b.programme, b.intake)
      parts.push(
        `${UNIVERSITY_NAME[b.programme.pathwayUniversity]}, ${destinationLabel(b.destination)}, from ${monthYear(start)}`,
      )
    }
  }
  return parts.length > 1 ? parts.join(' → ') : null
}

export function alternativeBlocks(plan: StudyPlan): PlanBlock[] {
  return plan.blocks.filter((b) => b.role === 'alternative')
}
