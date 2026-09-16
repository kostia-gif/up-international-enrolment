'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  Clock,
  FileCheck2,
  GraduationCap,
  UserRound,
  Building2,
  Sparkles,
  CircleAlert,
  type LucideIcon,
} from 'lucide-react'
import type { Application } from '@/lib/types'
import { formatShortDate } from '@/lib/format'
import {
  BOARD_COLUMNS,
  columnFor,
  pickupPill,
  conditionalPill,
  unconditionalPill,
  specialRequestPill,
  reviewNeeds,
  looBadge,
  awaitingItem,
  outstandingDocs,
  nextOwner,
  type BoardColumnKey,
  type CardPill,
  type NextOwner,
} from '@/lib/dashboard'
import { toneBadge, toneDot } from '@/lib/status'
import { cn } from '@/lib/utils'
import { ElapsedTracker } from './elapsed-tracker'
import { CardDropPanel } from './card-drop-panel'

const OWNER_ICON: Record<NextOwner, LucideIcon> = {
  Student: GraduationCap,
  You: UserRound,
  'UP admissions': Building2,
}

function Pill({ pill }: { pill: CardPill }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
        toneBadge[pill.tone],
      )}
    >
      <span className={cn('size-1.5 rounded-full', toneDot[pill.tone])} aria-hidden />
      {pill.label}
    </span>
  )
}

type CardStatus = CardPill | { text: string }

// The status pills for a card, per column. The Submitted column combines the
// pickup indicator with the in-review detail (special request / what's needed).
function cardStatuses(app: Application, column: BoardColumnKey): CardStatus[] {
  switch (column) {
    case 'submitted': {
      const out: CardStatus[] = [pickupPill(app)]
      if (app.route === 'review') {
        out.push(specialRequestPill(app) ?? { text: reviewNeeds(app) })
      }
      return out
    }
    case 'conditional':
      return [conditionalPill(app)]
    case 'unconditional':
      return [unconditionalPill(app)]
    default:
      return []
  }
}

function Card({
  app,
  column,
  selected,
  onFocus,
}: {
  app: Application
  column: BoardColumnKey
  selected: boolean
  onFocus: (id: string) => void
}) {
  const statuses = cardStatuses(app, column)
  const owner = nextOwner(app)
  const OwnerIcon = OWNER_ICON[owner]
  const loo = looBadge(app)
  // Outstanding document / data shown on Submitted cards (incl. those in review).
  const awaiting = column === 'submitted' ? awaitingItem(app) : null
  // For special-request cards, the meta line reads "Special requirement"
  // instead of the elapsed timer.
  const isSpecialReview = column === 'submitted' && specialRequestPill(app) !== null
  // Selecting a card that is awaiting documents reveals an inline drop panel.
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
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-tight text-pretty">{app.studentName}</p>
        {app.duplicateHold && (
          <span className="shrink-0 rounded-full border border-destructive/25 bg-destructive/12 px-2 py-0.5 text-[10px] font-medium text-destructive">
            On hold
          </span>
        )}
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {app.course.brand} · {formatShortDate(app.course.intakeDate)}
      </p>

      {(statuses.length > 0 || loo) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {statuses.map((s, i) =>
            'text' in s ? (
              <span
                key={`${i}-${s.text}`}
                className="inline-flex items-center gap-1 rounded-full border border-warning/25 bg-warning/12 px-2 py-0.5 text-[10px] font-medium text-warning"
              >
                <span className={cn('size-1.5 rounded-full', toneDot.warning)} aria-hidden />
                {s.text}
              </span>
            ) : (
              <Pill key={`${i}-${s.label}`} pill={s} />
            ),
          )}
          {loo && (
            <span
              title="Letter of Offer generated"
              className="inline-flex items-center gap-1 text-[10px] font-medium text-ai"
            >
              <FileCheck2 className="size-3.5" aria-hidden />
              {loo}
            </span>
          )}
        </div>
      )}

      {awaiting && (
        <p className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-warning">
          <CircleAlert className="size-3" aria-hidden />
          Awaiting {awaiting}
        </p>
      )}

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          {isSpecialReview ? (
            <>
              <Sparkles className="size-3 text-warning" aria-hidden />
              Special requirement
            </>
          ) : (
            <>
              <Clock className="size-3" aria-hidden />
              <ElapsedTracker iso={app.createdAt} />
            </>
          )}
        </span>
        <span
          className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground"
          title={`Awaiting action from ${owner}`}
        >
          <OwnerIcon className="size-3" aria-hidden />
          Awaiting {owner}
        </span>
      </div>

      {showDropPanel && <CardDropPanel app={app} />}

      <Link
        href={`/applications/${app.id}`}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Open ${app.studentName}'s application`}
        className="absolute right-2 top-2 hidden rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground group-hover:block"
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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {columns.map((col) => (
        <section
          key={col.key}
          className="flex flex-col gap-2.5 rounded-2xl border border-border/70 bg-muted/40 p-2.5"
        >
          <header className="flex items-center justify-between gap-2 px-1">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                {col.label}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">{col.description}</p>
            </div>
            <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground ring-1 ring-border">
              {col.cards.length}
            </span>
          </header>
          <div className="flex flex-col gap-2">
            {col.cards.map((a) => (
              <Card
                key={a.id}
                app={a}
                column={col.key}
                selected={focusId === a.id}
                onFocus={onFocus}
              />
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
