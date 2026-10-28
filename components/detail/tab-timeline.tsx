'use client'

import { FileText, MessageSquare, Paperclip } from 'lucide-react'
import type { Application } from '@/lib/types'
import { actorMeta } from '@/lib/actor'
import { formatDateTime } from '@/lib/format'
import { isNewEvent } from '@/lib/documents'
import { NewBadge } from '@/components/new-badge'
import { cn } from '@/lib/utils'

const KIND_META = {
  document: { icon: FileText, label: 'Document' },
  comms: { icon: MessageSquare, label: 'Message' },
} as const

export function TabTimeline({ app, viewedAt }: { app: Application; viewedAt?: string }) {
  const events = [...app.events].reverse()
  const newCount = events.filter((e) => isNewEvent(e, viewedAt)).length

  return (
    <div className="flex flex-col gap-5">
      {newCount > 0 && (
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
          <span className="size-1.5 rounded-full bg-success" aria-hidden />
          {newCount} new since your last visit
        </p>
      )}
      <ol className="relative flex flex-col gap-5 border-l border-border pl-6">
        {events.map((e, i) => {
          const meta = actorMeta[e.actor]
          const Icon = meta.icon
          const isNew = isNewEvent(e, viewedAt)
          const kind = e.kind ? KIND_META[e.kind] : undefined
          return (
            <li
              key={i}
              className={cn('relative', isNew && '-my-2 -ml-3 rounded-lg bg-success/8 py-2 pl-3 pr-2')}
            >
              <span
                className={cn(
                  'absolute flex size-6 items-center justify-center rounded-full ring-4 ring-background',
                  isNew ? '-left-[45px] top-2' : '-left-[33px]',
                  meta.chip,
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-pretty">
                  {e.label}
                  {isNew && <NewBadge />}
                </p>
                <time className="text-xs text-muted-foreground">{formatDateTime(e.ts)}</time>
              </div>
              {e.detail && <p className="mt-0.5 text-sm text-muted-foreground text-pretty">{e.detail}</p>}
              {e.attachments?.map((a) => (
                <p key={a.name} className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Paperclip className="size-3" aria-hidden />
                  {a.name}
                  {a.addedTo && ` · ${a.addedTo}`}
                </p>
              ))}
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                {meta.label}
                {kind && (
                  <>
                    <span aria-hidden>·</span>
                    <kind.icon className="size-3" aria-hidden />
                    {kind.label}
                  </>
                )}
              </p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
