'use client'

import Link from 'next/link'
import { ArrowUpRight, Clock, Building2, UserRound } from 'lucide-react'
import type { Application } from '@/lib/types'
import { shortProgramme } from '@/lib/format'
import {
  BOARD_COLUMNS,
  columnFor,
  outstandingDocs,
  waitingOn,
  WAITING_LABEL,
} from '@/lib/dashboard'
import { toneDot } from '@/lib/status'
import { cn } from '@/lib/utils'
import { CardDropPanel } from './card-drop-panel'

export function daysLabel(days: number): string {
  return `${days} day${days === 1 ? '' : 's'} in stage`
}

function Card({
  app,
  selected,
  onFocus,
}: {
  app: Application
  selected: boolean
  onFocus: (id: string) => void
}) {
  const owner = waitingOn(app)
  const OwnerIcon = owner === 'you' ? UserRound : Building2
  const showDropPanel = selected && outstandingDocs(app).length > 0

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onFocus(app.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onFocus(app.id)
        }
      }}
      className={cn(
        'group relative cursor-pointer rounded-xl border bg-card p-3 shadow-sm transition-all duration-200',
        selected
          ? 'border-primary ring-1 ring-primary shadow-md'
          : 'border-border hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
      )}
    >
      <div className="flex items-start justify-between gap-2 pr-5">
        <p className="text-sm font-medium leading-tight text-pretty">{app.studentName}</p>
        {app.duplicateHold && (
          <span className="shrink-0 rounded-full border border-destructive/25 bg-destructive/12 px-2 py-0.5 text-[10px] font-medium text-destructive">
            On hold
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground text-pretty">
        {shortProgramme(app.course.programmeName)}
      </p>

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="size-3" aria-hidden />
          {daysLabel(app.daysInStage)}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 text-[11px] font-medium',
            owner === 'you' ? 'text-warning' : 'text-muted-foreground',
          )}
        >
          <OwnerIcon className="size-3" aria-hidden />
          {WAITING_LABEL[owner]}
        </span>
      </div>

      {showDropPanel && <CardDropPanel app={app} />}

      <Link
        href={`/applications/${app.id}`}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Open ${app.studentName}'s application`}
        className="absolute right-2 top-2 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  )
}

export function StageBoard({
  applications,
  focusId,
  onFocus,
}: {
  applications: Application[]
  focusId: string | null
  onFocus: (id: string) => void
}) {
  const columns = BOARD_COLUMNS.map((col) => ({
    ...col,
    cards: applications.filter((a) => columnFor(a) === col.key),
  }))

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map((col) => (
        <section
          key={col.key}
          className="flex flex-col gap-2.5 rounded-2xl border border-border/70 bg-muted/40 p-2.5"
        >
          <header className="flex items-center justify-between gap-2 px-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground">
              <span className={cn('size-1.5 rounded-full', toneDot[col.tone])} aria-hidden />
              {col.label}
            </p>
            <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground ring-1 ring-border">
              {col.cards.length}
            </span>
          </header>
          <div className="flex flex-col gap-2">
            {col.cards.map((a) => (
              <Card key={a.id} app={a} selected={focusId === a.id} onFocus={onFocus} />
            ))}
            {col.cards.length === 0 && (
              <p className="rounded-lg border border-dashed border-border px-3 py-8 text-center text-[11px] text-muted-foreground">
                None
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
