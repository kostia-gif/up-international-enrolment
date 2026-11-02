'use client'

import { Fragment } from 'react'
import { ArrowDown, ArrowRight, GraduationCap, X } from 'lucide-react'
import { UNIVERSITY_NAME, earliestStartAfter } from '@/lib/catalog'
import { destinationLabel } from '@/lib/destinations'
import { monthYear, sortedBlocks } from '@/lib/study-plan'
import type { PlanBlock, StudyPlan } from '@/lib/types'
import { cn } from '@/lib/utils'

const ROLE_LABEL: Record<PlanBlock['role'], string> = {
  primary: 'Offer for',
  before: 'Before',
  after: 'Then',
  alternative: 'Second offer',
}

type Chip =
  | { kind: 'block'; block: PlanBlock; index: number }
  | { kind: 'destination'; block: PlanBlock }

export function PlanStrip({
  plan,
  onRemove,
  className,
}: {
  plan: StudyPlan
  // Index into plan.blocks. Omit for a read-only strip.
  onRemove?: (index: number) => void
  className?: string
}) {
  const sequence: Chip[] = []
  for (const block of sortedBlocks(plan)) {
    if (block.role === 'alternative') continue
    sequence.push({ kind: 'block', block, index: plan.blocks.indexOf(block) })
    if (block.destination) sequence.push({ kind: 'destination', block })
  }
  const alternatives = plan.blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.role === 'alternative')

  if (sequence.length === 0) return null

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <ol className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:flex-wrap sm:items-center">
        {sequence.map((chip, i) => (
          <Fragment key={chip.kind === 'block' ? `b-${chip.block.programme.id}` : `d-${chip.block.destination?.id}`}>
            {i > 0 && (
              <li aria-hidden className="flex justify-center text-muted-foreground sm:block">
                <ArrowDown className="size-4 sm:hidden" />
                <ArrowRight className="hidden size-4 sm:block" />
              </li>
            )}
            <li>
              {chip.kind === 'block' ? (
                <BlockChip block={chip.block} onRemove={onRemove ? () => onRemove(chip.index) : undefined} />
              ) : (
                <DestinationChip block={chip.block} />
              )}
            </li>
          </Fragment>
        ))}
      </ol>
      {alternatives.map(({ block, index }) => (
        <div key={block.programme.id} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Also applying for, as a second offer:</span>
          <BlockChip block={block} onRemove={onRemove ? () => onRemove(index) : undefined} compact />
        </div>
      ))}
    </div>
  )
}

function BlockChip({
  block,
  onRemove,
  compact,
}: {
  block: PlanBlock
  onRemove?: () => void
  compact?: boolean
}) {
  const primary = block.role === 'primary'
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-md border text-sm',
        compact ? 'px-2 py-1' : 'px-3 py-2',
        primary ? 'border-primary/40 bg-primary/5' : 'border-border bg-card',
      )}
    >
      <span className="flex min-w-0 flex-col">
        {!compact && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {ROLE_LABEL[block.role]}
          </span>
        )}
        <span className="truncate font-medium text-foreground">{block.programme.programmeName}</span>
        <span className="text-xs text-muted-foreground">
          {monthYear(block.intake)} · {block.programme.campus}
          {primary && <> · {block.programme.priceBundle}</>}
        </span>
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="grid size-6 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={`Remove ${block.programme.programmeName}`}
        >
          <X className="size-3.5" />
        </button>
      )}
    </span>
  )
}

function DestinationChip({ block }: { block: PlanBlock }) {
  const d = block.destination
  const uni = block.programme.pathwayUniversity
  if (!d || !uni) return null
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-2 text-sm">
      <GraduationCap className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <span className="flex min-w-0 flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {UNIVERSITY_NAME[uni]}
        </span>
        <span className="truncate font-medium text-foreground">{destinationLabel(d)}</span>
        <span className="text-xs text-muted-foreground">
          from {monthYear(earliestStartAfter(block.programme, block.intake))}
        </span>
      </span>
    </span>
  )
}
