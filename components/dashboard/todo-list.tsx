'use client'

import Link from 'next/link'
import { ArrowUpRight, CircleCheck } from 'lucide-react'
import type { Application } from '@/lib/types'
import { counsellorName } from '@/lib/fixtures'
import { shortProgramme, formatShortDate } from '@/lib/format'
import { toneDot } from '@/lib/status'
import { appTodos } from '@/lib/dashboard'
import { cn } from '@/lib/utils'

function Row({
  app,
  selected,
  onFocus,
}: {
  app: Application
  selected: boolean
  onFocus: (id: string) => void
}) {
  const todos = appTodos(app)
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
        'group relative cursor-pointer rounded-lg border bg-card p-4 transition-colors',
        selected ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-pretty">{app.studentName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
            {shortProgramme(app.course.programmeName)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {app.course.brand} · {app.stage} · {formatShortDate(app.course.intakeDate)} ·{' '}
            {counsellorName(app.agentId)}
          </p>
        </div>
        <Link
          href={`/applications/${app.id}`}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${app.studentName}'s application`}
          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {todos.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
          {todos.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', toneDot[t.tone])} />
              <span className="min-w-0 flex-1 text-pretty">{t.label}</span>
              <span className="shrink-0 text-[11px] text-muted-foreground">{t.waitingOn}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-sm text-success">
          <CircleCheck className="size-4" /> No outstanding items
        </p>
      )}
    </div>
  )
}

export function TodoList({
  applications,
  focusId,
  onFocus,
}: {
  applications: Application[]
  focusId: string | null
  onFocus: (id: string) => void
}) {
  // Applications with outstanding items first, so the work is at the top.
  const sorted = [...applications].sort((a, b) => appTodos(b).length - appTodos(a).length)

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((a) => (
        <Row key={a.id} app={a} selected={focusId === a.id} onFocus={onFocus} />
      ))}
      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground">No applications match these filters.</p>
      )}
    </div>
  )
}
