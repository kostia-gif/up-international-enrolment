'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Application } from '@/lib/types'
import { BOARD_COLUMNS } from '@/lib/dashboard'
import { newActivity } from '@/lib/documents'
import { NewBadge } from '@/components/new-badge'
import { daysLabel, NextActionLine } from './stage-board'

function NewActivityCell({ app }: { app: Application }) {
  const items = newActivity(app)
  if (items.length === 0) return <span className="text-xs text-muted-foreground">{'—'}</span>
  const [latest, ...rest] = items
  return (
    <span
      className="inline-flex items-center gap-2 text-xs"
      title={items.map((i) => i.label).join('\n')}
    >
      <NewBadge />
      <span className="font-medium text-foreground">{latest.label}</span>
      {rest.length > 0 && <span className="text-muted-foreground">+{rest.length} more</span>}
    </span>
  )
}

const STAGE_ORDER = Object.fromEntries(BOARD_COLUMNS.map((c, i) => [c.key, i]))

export function ApplicationList({
  applications,
  onOpen,
}: {
  applications: Application[]
  onOpen: (id: string) => void
}) {
  const rows = [...applications].sort((a, b) => STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage])

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
            <th className="px-4 py-2.5 font-medium">New activity</th>
            <th className="px-4 py-2.5 font-medium">Time</th>
            <th className="px-4 py-2.5 font-medium">Next step</th>
            <th className="px-4 py-2.5">
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((app) => {
            return (
              <tr
                key={app.id}
                onClick={() => onOpen(app.id)}
                className="cursor-pointer transition-colors hover:bg-muted/40"
              >
                <td className="px-4 py-2.5 font-medium">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpen(app.id)
                    }}
                    className="text-left hover:underline"
                  >
                    {app.studentName}
                  </button>
                  {app.duplicateHold && (
                    <span className="ml-2 text-xs font-medium text-muted-foreground">On hold</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{app.course.programmeName}</td>
                <td className="px-4 py-2.5">
                  {app.stage === 'Draft' ? 'Draft' : app.stage}
                </td>
                <td className="px-4 py-2.5">
                  <NewActivityCell app={app} />
                </td>
                <td className="px-4 py-2.5 text-muted-foreground tabular-nums">
                  {daysLabel(app.daysInStage)}
                </td>
                <td className="px-4 py-2.5">
                  <NextActionLine app={app} />
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
