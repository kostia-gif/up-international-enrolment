'use client'

import type { Application } from '@/lib/types'
import { actorMeta } from '@/lib/actor'
import { formatDateTime } from '@/lib/format'

export function TabTimeline({ app }: { app: Application }) {
  const events = [...app.events].reverse()

  return (
    <ol className="relative flex flex-col gap-5 border-l border-border pl-6">
      {events.map((e, i) => {
        const meta = actorMeta[e.actor]
        const Icon = meta.icon
        return (
          <li key={i} className="relative">
            <span
              className={`absolute -left-[33px] flex size-6 items-center justify-center rounded-full ring-4 ring-background ${meta.chip}`}
            >
              <Icon className="size-3.5" />
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-pretty">{e.label}</p>
              <time className="text-xs text-muted-foreground">{formatDateTime(e.ts)}</time>
            </div>
            {e.detail && (
              <p className="mt-0.5 text-sm text-muted-foreground text-pretty">{e.detail}</p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">{meta.label}</p>
          </li>
        )
      })}
    </ol>
  )
}
