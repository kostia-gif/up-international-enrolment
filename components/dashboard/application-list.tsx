'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Application } from '@/lib/types'
import { BOARD_COLUMNS, waitingOn, WAITING_LABEL } from '@/lib/dashboard'
import { toneDot } from '@/lib/status'
import { cn } from '@/lib/utils'
import { daysLabel } from './stage-board'

const STAGE_ORDER = Object.fromEntries(BOARD_COLUMNS.map((c, i) => [c.key, i]))
const STAGE_TONE = Object.fromEntries(BOARD_COLUMNS.map((c) => [c.key, c.tone]))

export function ApplicationList({
  applications,
  focusId,
  onFocus,
}: {
  applications: Application[]
  focusId: string | null
  onFocus: (id: string) => void
}) {
  const rows = [...applications].sort(
    (a, b) => STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage] || b.daysInStage - a.daysInStage,
  )

  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-sm text-muted-foreground">
        No applications
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Student</th>
            <th className="px-4 py-2.5 font-medium">Programme</th>
            <th className="px-4 py-2.5 font-medium">Stage</th>
            <th className="px-4 py-2.5 font-medium">Time</th>
            <th className="px-4 py-2.5 font-medium">Next</th>
            <th className="px-4 py-2.5">
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((app) => {
            const owner = waitingOn(app)
            return (
              <tr
                key={app.id}
                onClick={() => onFocus(app.id)}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-muted/40',
                  focusId === app.id && 'bg-primary/5',
                )}
              >
                <td className="px-4 py-2.5 font-medium">
                  {app.studentName}
                  {app.duplicateHold && (
                    <span className="ml-2 text-xs font-medium text-destructive">On hold</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{app.course.programmeName}</td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={cn('size-1.5 rounded-full', toneDot[STAGE_TONE[app.stage]])}
                      aria-hidden
                    />
                    {app.stage}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground tabular-nums">
                  {daysLabel(app.daysInStage)}
                </td>
                <td
                  className={cn(
                    'px-4 py-2.5 text-xs font-medium',
                    owner === 'you' ? 'text-warning' : 'text-muted-foreground',
                  )}
                >
                  {WAITING_LABEL[owner]}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/applications/${app.id}`}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Open ${app.studentName}'s application`}
                    className="inline-flex rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
