'use client'

import { useRef } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Bell,
  Building2,
  Clock,
  FileSignature,
  Upload,
  UserRound,
} from 'lucide-react'
import type { Application } from '@/lib/types'
import { shortProgramme } from '@/lib/format'
import {
  BOARD_COLUMNS,
  formatNzd,
  hasOffer,
  LOO_ISSUER_LABEL,
  needsVisaApproval,
  outstandingDocs,
  PAYMENT_META,
  VISA_META,
  waitingOn,
  WAITING_LABEL,
} from '@/lib/dashboard'
import { useStore } from '@/lib/store'
import { toneBadge, toneDot } from '@/lib/status'
import { cn } from '@/lib/utils'
import { CardDropPanel } from './card-drop-panel'
import { UnconditionalChecklist } from '@/components/unconditional-checklist'

export function daysLabel(days: number): string {
  return `${days}d`
}

function daysTitle(days: number): string {
  return `${days} day${days === 1 ? '' : 's'} in this stage`
}

function LooIssuerChip({ app }: { app: Application }) {
  if (!hasOffer(app) || !app.looIssuedBy) return null
  const Icon = app.looIssuedBy === 'agent' ? UserRound : Building2
  const label = LOO_ISSUER_LABEL[app.looIssuedBy]
  return (
    <span
      title={`Letter of Offer ${label.toLowerCase()}`}
      className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
    >
      <FileSignature className="size-3" aria-hidden />
      <Icon className="size-3" aria-hidden />
      <span className="sr-only">Letter of Offer </span>
      {app.looIssuedBy === 'agent' ? 'Agent' : 'UP'}
    </span>
  )
}

function PaymentVisaPanel({ app }: { app: Application }) {
  const { uploadVisaApproval } = useStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const payment = app.payment
  const visa = app.visa ?? { state: 'not-lodged' as const }
  const outstanding = payment ? payment.totalDue - payment.paid : 0

  return (
    <div className="mt-2.5 flex flex-col gap-1.5 border-t border-border/60 pt-2">
      {payment && (
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'rounded-md px-1.5 py-0.5 text-[10px] font-medium',
              toneBadge[PAYMENT_META[payment.state].tone],
            )}
          >
            {PAYMENT_META[payment.state].label}
          </span>
          {outstanding > 0 && (
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {formatNzd(outstanding)} due
            </span>
          )}
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'rounded-md px-1.5 py-0.5 text-[10px] font-medium',
            toneBadge[VISA_META[visa.state].tone],
          )}
        >
          {VISA_META[visa.state].label}
        </span>
        {needsVisaApproval(app) && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
              className="inline-flex items-center gap-1 rounded-md border border-primary/30 px-1.5 py-0.5 text-[10px] font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <Upload className="size-3" aria-hidden />
              Upload approval
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,image/*"
              className="sr-only"
              tabIndex={-1}
              aria-label={`Upload visa approval for ${app.studentName}`}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) uploadVisaApproval(app.id, file.name)
                e.target.value = ''
              }}
            />
          </>
        )}
      </div>
    </div>
  )
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
  const { markSeen } = useStore()
  const owner = waitingOn(app)
  const OwnerIcon = owner === 'you' ? UserRound : Building2
  const showDropPanel = selected && outstandingDocs(app).length > 0
  const focus = () => {
    onFocus(app.id)
    markSeen(app.id)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={focus}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          focus()
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
        <p className="flex items-center gap-1.5 text-sm font-medium leading-tight text-pretty">
          {app.unseenUpdate && (
            <span className="relative inline-flex" title={`New: ${app.unseenUpdate}`}>
              <Bell className="size-3.5 text-primary" aria-hidden />
              <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-destructive" aria-hidden />
              <span className="sr-only">New update: {app.unseenUpdate}.</span>
            </span>
          )}
          {app.studentName}
        </p>
        {app.duplicateHold && (
          <span className="shrink-0 rounded-full border border-destructive/25 bg-destructive/12 px-2 py-0.5 text-[10px] font-medium text-destructive">
            On hold
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground text-pretty">
        {shortProgramme(app.course.programmeName)}
      </p>
      {app.unseenUpdate && (
        <p className="mt-1.5 text-[11px] font-medium text-primary text-pretty">{app.unseenUpdate}</p>
      )}

      {app.stage === 'Conditional offer' && <UnconditionalChecklist app={app} compact />}
      {app.stage === 'Payment & visa' && <PaymentVisaPanel app={app} />}

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
        <span className="flex items-center gap-1.5">
          <span
            title={daysTitle(app.daysInStage)}
            className="inline-flex items-center gap-1 text-[11px] tabular-nums text-muted-foreground"
          >
            <Clock className="size-3" aria-hidden />
            {daysLabel(app.daysInStage)}
            <span className="sr-only"> in this stage</span>
          </span>
          <LooIssuerChip app={app} />
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
        onClick={(e) => {
          e.stopPropagation()
          markSeen(app.id)
        }}
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
    cards: applications.filter((a) => a.stage === col.key),
  }))

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => (
          <section
            key={col.key}
            aria-disabled={col.phase2 || undefined}
            className={cn(
              'flex flex-col gap-2.5 rounded-2xl border p-2.5',
              col.phase2
                ? 'border-dashed border-border bg-muted/20'
                : 'border-border/70 bg-muted/40',
            )}
          >
            <header className="flex items-center justify-between gap-2 px-1">
              <p
                className={cn(
                  'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                  col.phase2 ? 'text-muted-foreground' : 'text-foreground',
                )}
              >
                <span
                  className={cn('size-1.5 rounded-full', col.phase2 ? 'bg-muted-foreground/40' : toneDot[col.tone])}
                  aria-hidden
                />
                {col.label}
              </p>
              {col.phase2 ? (
                <span className="shrink-0 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Phase 2
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground ring-1 ring-border">
                  {col.cards.length}
                </span>
              )}
            </header>
            {col.phase2 && (
              <p className="px-1 text-[11px] leading-relaxed text-muted-foreground text-pretty">
                Payment and visa tracking is coming in phase 2.
              </p>
            )}
            <div
              inert={col.phase2 || undefined}
              className={cn('flex flex-col gap-2', col.phase2 && 'pointer-events-none opacity-50 grayscale select-none')}
            >
              {col.cards.map((a) => (
                <Card key={a.id} app={a} selected={!col.phase2 && focusId === a.id} onFocus={onFocus} />
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
