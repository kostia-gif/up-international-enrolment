'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Mail,
  Paperclip,
  X,
  Link2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import type { Application, InboundEmail } from '@/lib/types'
import { useStore } from '@/lib/store'
import { actorMeta } from '@/lib/actor'
import { buildActivityFeed, buildThreads, channelMeta, senderMeta } from '@/lib/dashboard'
import { RelativeTime } from '@/components/relative-time'
import { formatDateTime } from '@/lib/format'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type ViewMode = 'name' | 'all'

export function ActivityTimeline({
  applications,
  focusId,
  onFocus,
}: {
  applications: Application[]
  focusId: string | null
  onFocus: (id: string | null) => void
}) {
  const {
    emails,
    applications: allApplications,
    simulateEmailCapture,
    getApplication,
    updateApplication,
    addEvent,
  } = useStore()
  const [locallyMatched, setLocallyMatched] = useState<Record<string, string>>({})
  // Default to the by-applicant view, ordered by most recent activity.
  const [view, setView] = useState<ViewMode>('name')
  // Which applicant thread is open, seeded from the board focus. Kept local so
  // navigating inside the dialog never disturbs the board behind it.
  const [selectedId, setSelectedId] = useState<string | null>(focusId)
  const scrollRef = useRef<HTMLDivElement>(null)

  const focusApp = selectedId ? applications.find((a) => a.id === selectedId) : undefined

  // In by-applicant view we show one student's thread; in all-activity view we
  // merge every application into a single conversation.
  const showThreadList = view === 'name' && !focusApp
  const feedApps = view === 'all' ? applications : focusApp ? [focusApp] : []
  const feed = buildActivityFeed(feedApps)
  const threads = buildThreads(applications)

  // Chat convention: newest at the bottom. Scroll there on load / focus change.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [selectedId, view, feed.length])

  function handleSimulate() {
    const result = simulateEmailCapture()
    if (result.applicationId) {
      const app = getApplication(result.applicationId)
      toast.success('Email captured', {
        description: app ? `${result.summary} — ${app.studentName}` : result.summary,
      })
      onFocus(result.applicationId)
    } else {
      toast('Email received', { description: result.summary })
    }
  }

  function attach(email: InboundEmail, appId: string) {
    setLocallyMatched((m) => ({ ...m, [email.id]: appId }))
    addEvent(appId, {
      ts: new Date().toISOString(),
      actor: 'email',
      label: 'Captured from email',
      detail: email.documents?.length
        ? `${email.documents.length} document${email.documents.length === 1 ? '' : 's'} added`
        : 'Attached manually',
      channel: 'email',
      attachments: email.documents?.map((name) => ({ name, addedTo: 'Applicant file' })),
    })
    if (email.documents?.length) {
      updateApplication(appId, (a) => ({
        ...a,
        documents: [
          ...a.documents,
          ...email.documents!.map((name, i) => ({
            id: `${email.id}-doc-${i}`,
            type: 'Supporting',
            fileName: `Supporting_${a.preId}.pdf`,
            originalName: name,
            language: 'English',
            status: 'checked' as const,
            pages: 1,
          })),
        ],
      }))
    }
    const app = getApplication(appId)
    toast.success('Attached to application', { description: app?.studentName })
    onFocus(appId)
  }

  // Unmatched inbound emails still needing a home (global view only).
  const unmatched = focusApp
    ? []
    : emails.filter((e) => !e.matchedApplicationId && !locallyMatched[e.id])

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border p-3">
        <div className="flex min-w-0 items-center gap-2">
          {focusApp && (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
              aria-label="Back to all applicants"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold">Activity</p>
            <p className="truncate text-xs text-muted-foreground">
              {focusApp
                ? focusApp.studentName
                : view === 'name'
                  ? 'By applicant · most recent first'
                  : 'All applications'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSimulate}>
            <Mail className="size-3.5" /> Simulate email
          </Button>
        </div>
      </div>

      {/* View toggle: default to By applicant, or switch to All activity. */}
      {!focusApp && (
        <div className="flex items-center gap-1 border-b border-border p-2">
          <SegBtn active={view === 'name'} onClick={() => setView('name')}>
            By applicant
          </SegBtn>
          <SegBtn active={view === 'all'} onClick={() => setView('all')}>
            All activity
          </SegBtn>
        </div>
      )}

      {focusApp && (
        <Link
          href={`/applications/${focusApp.id}`}
          className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs text-primary hover:underline"
        >
          Open full application <ArrowUpRight className="size-3.5" />
        </Link>
      )}

      {unmatched.length > 0 && !showThreadList && (
        <div className="flex flex-col gap-2 border-b border-border bg-warning/5 p-3">
          {unmatched.map((email) => (
            <div key={email.id} className="rounded-md border border-warning/25 bg-card p-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{email.subject}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{email.sender}</p>
                </div>
                <span className="shrink-0 rounded-full border border-warning/25 bg-warning/12 px-2 py-0.5 text-[10px] font-medium text-warning">
                  Needs matching
                </span>
              </div>
              {email.documents && email.documents.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {email.documents.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      <Paperclip className="size-2.5" /> {d}
                    </span>
                  ))}
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline" size="sm" className="mt-2 h-7 gap-1.5 text-xs" />}
                >
                  <Link2 className="size-3.5" /> Attach to…
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Attach to application</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allApplications.map((a) => (
                      <DropdownMenuItem key={a.id} onClick={() => attach(email, a.id)}>
                        <span className="truncate">{a.studentName}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{a.preId}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* By-applicant list: threads ordered by most recent activity. */}
      {showThreadList ? (
        <div className="flex-1 overflow-y-auto p-2">
          {threads.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {threads.map((t) => {
                const ch = channelMeta[t.lastChannel]
                return (
                  <li key={t.appId}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(t.appId)
                        onFocus(t.appId)
                      }}
                      className="flex w-full items-center gap-3 rounded-md border border-transparent p-2.5 text-left hover:border-border hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{t.studentName}</span>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {t.preId}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {t.lastLabel}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={cn(
                              'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium',
                              ch.chip,
                            )}
                          >
                            {ch.label}
                          </span>
                          <RelativeTime
                            className="text-[10px] text-muted-foreground"
                            iso={t.lastTs}
                          />
                        </div>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
          {feed.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {feed.map((entry) => {
                const sender = senderMeta[entry.actor]
                const meta = actorMeta[entry.actor]
                const ch = channelMeta[entry.channel]
                const Icon = meta.icon
                const isYou = sender.side === 'right'
                return (
                  <div key={entry.id} className={cn('flex gap-2', isYou && 'flex-row-reverse')}>
                    <span
                      className={cn(
                        'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
                        meta.chip,
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <div
                      className={cn(
                        'max-w-[85%] rounded-lg px-3 py-2',
                        isYou ? 'bg-primary/10' : 'bg-muted',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{sender.name}</span>
                        <span
                          className={cn(
                            'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium',
                            ch.chip,
                          )}
                        >
                          {ch.label}
                        </span>
                      </div>
                      <time
                        className="mt-0.5 block text-[10px] text-muted-foreground"
                        dateTime={entry.ts}
                        suppressHydrationWarning
                      >
                        {formatDateTime(entry.ts)}
                      </time>
                      <p className="mt-1 text-sm text-pretty">{entry.label}</p>
                      {entry.detail && (
                        <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
                          {entry.detail}
                        </p>
                      )}
                      {entry.attachments && entry.attachments.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1.5 border-t border-border/60 pt-2">
                          {entry.attachments.map((att) => (
                            <div key={att.name} className="flex flex-col gap-0.5">
                              <span className="inline-flex items-center gap-1 text-xs">
                                <Paperclip className="size-3 shrink-0 text-muted-foreground" />
                                <span className="truncate font-medium">{att.name}</span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] text-success">
                                <CheckCircle2 className="size-3 shrink-0" />
                                Added to platform · {att.addedTo}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {view === 'all' && (
                        <button
                          type="button"
                          onClick={() => {
                            setView('name')
                            setSelectedId(entry.appId)
                            onFocus(entry.appId)
                          }}
                          className="mt-1.5 text-[11px] text-primary hover:underline"
                        >
                          {entry.studentName}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SegBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}
