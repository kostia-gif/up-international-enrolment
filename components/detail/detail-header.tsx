'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles, Users } from 'lucide-react'
import type { Application } from '@/lib/types'
import { AGENCY } from '@/lib/store'
import { shortProgramme } from '@/lib/format'
import { cn } from '@/lib/utils'

export function DetailHeader({ app }: { app: Application }) {
  const agent = AGENCY.counsellors.find((c) => c.id === app.agentId)
  const openConditions = app.conditions.filter((c) => c.status !== 'cleared').length

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to dashboard
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-balance">{app.studentName}</h1>
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                {app.preId}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              {app.course.brand} · {shortProgramme(app.course.programmeName)} · {app.course.campus}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {agent?.name}
              {app.agentRef ? ` · Agent ref ${app.agentRef}` : ''}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium">
              {app.stage}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
                app.route === 'auto'
                  ? 'border-ai/25 bg-ai/10 text-ai'
                  : 'border-info/25 bg-info/10 text-info',
              )}
            >
              {app.route === 'auto' ? (
                <>
                  <Sparkles className="size-3.5" /> Auto pathway
                </>
              ) : (
                <>
                  <Users className="size-3.5" /> Admissions review
                </>
              )}
            </span>
            {openConditions > 0 && (
              <span className="text-xs text-muted-foreground">
                {openConditions} condition{openConditions > 1 ? 's' : ''} outstanding
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
