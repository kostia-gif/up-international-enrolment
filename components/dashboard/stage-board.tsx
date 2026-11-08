'use client'

import Link from 'next/link'
import { Clock, Hourglass, CircleArrowRight, Plus } from 'lucide-react'
import type { Application } from '@/lib/types'
import { shortProgramme } from '@/lib/format'
import { BOARD_COLUMNS, nextAction, offerSummary } from '@/lib/dashboard'
import { newActivity } from '@/lib/documents'
import { NewBadge } from '@/components/new-badge'
import { cn } from '@/lib/utils'

export function daysLabel(days: number): string {
  return `${days}d`
}

function daysTitle(days: number): string {
  return `${days} day${days === 1 ? '' : 's'} in this stage`
}

export function NextActionLine({ app, className }: { app: Application; className?: string }) {
  const action = nextAction(app)
  const yours = action.owner === 'you'
  const Icon = yours ? CircleArrowRight : Hourglass
  return (
    <span
      className={cn(
        'flex min-w-0 items-start gap-1.5 text-xs leading-snug',
        yours ? 'font-medium text-foreground' : 'text-muted-foreground',
        className,
      )}
    >
      <Icon
        className={cn('mt-px size-3.5 shrink-0', yours ? 'text-warning' : 'text-muted-foreground')}
        aria-hidden
      />
      <span className="min-w-0 text-pretty">
        <span className="sr-only">{yours ? 'To action: ' : 'Next: '}</span>
        {action.label}
      </span>
    </span>
  )
}

function Card({ app, onOpen }: { app: Application; onOpen: (id: string) => void }) {
  const isNew = newActivity(app).length > 0 || Boolean(app.unseenUpdate)
  const offer = offerSummary(app)

  return (
    <button
      type="button"
      onClick={() => onOpen(app.id)}
      aria-label={`Preview ${app.studentName}'s application`}
      className="group flex w-full flex-col gap-2 rounded-lg border border-border bg-card p-3 text-left shadow-xs transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex w-full items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-tight tracking-tight text-pretty">
          {app.studentName}
        </span>
        {isNew && <NewBadge className="shrink-0" />}
      </span>
      <span className="-mt-1 text-xs leading-snug text-muted-foreground text-pretty">
        {shortProgramme(app.course.programmeName)}
      </span>
      {offer && <span className="text-[11px] font-medium text-muted-foreground">{offer}</span>}

      <span className="flex w-full items-end justify-between gap-2 border-t border-border/70 pt-2">
        <NextActionLine app={app} />
        <span
          title={daysTitle(app.daysInStage)}
          className="inline-flex shrink-0 items-center gap-1 text-[11px] tabular-nums text-muted-foreground"
        >
          <Clock className="size-3" aria-hidden />
          {daysLabel(app.daysInStage)}
          <span className="sr-only"> in this stage</span>
        </span>
      </span>
    </button>
  )
}

export function StageBoard({
  applications,
  onOpen,
}: {
  applications: Application[]
  onOpen: (id: string) => void
}) {
  const columns = BOARD_COLUMNS.map((col) => ({
    ...col,
    cards: applications.filter((a) => a.stage === col.key),
  }))

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">
      <div className="grid min-w-[1040px] grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,0.75fr)] gap-3">
        {columns.map((col) => (
          <section
            key={col.key}
            aria-labelledby={`col-${col.key}`}
            aria-disabled={col.phase2 || undefined}
            className={cn(
              'flex flex-col gap-2.5 rounded-xl border p-2.5',
              col.phase2
                ? 'border-dashed border-border bg-transparent'
                : 'border-border/60 bg-muted/50',
            )}
          >
            <header className="flex items-center justify-between gap-2 px-1 pt-0.5">
              <h2
                id={`col-${col.key}`}
                className={cn(
                  'text-xs font-semibold',
                  col.phase2 ? 'text-muted-foreground' : 'text-foreground',
                )}
              >
                {col.label}
              </h2>
              {col.phase2 ? (
                <span className="shrink-0 text-[10px] font-medium text-muted-foreground">Phase 2</span>
              ) : (
                <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground ring-1 ring-border">
                  {col.cards.length}
                  <span className="sr-only"> applications</span>
                </span>
              )}
            </header>

            {col.phase2 ? (
              <div className="flex flex-1 flex-col gap-1 rounded-lg border border-dashed border-border px-3 py-8 text-center">
                <p className="text-xs font-medium text-muted-foreground">Coming in phase 2</p>
                <p className="text-[11px] leading-relaxed text-muted-foreground text-pretty">
                  Payment and visa tracking will appear here after an unconditional offer.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {col.key === 'Draft' && (
                  <Link
                    href="/new"
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/40 bg-card px-3 py-2.5 text-xs font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <Plus className="size-3.5" aria-hidden />
                    New application
                  </Link>
                )}
                {col.cards.map((a) => (
                  <Card key={a.id} app={a} onOpen={onOpen} />
                ))}
                {col.cards.length === 0 && col.key !== 'Draft' && (
                  <p className="rounded-lg border border-dashed border-border px-3 py-8 text-center text-[11px] text-muted-foreground">
                    No applications
                  </p>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
