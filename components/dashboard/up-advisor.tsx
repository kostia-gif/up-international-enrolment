'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import {
  Sparkles,
  ArrowUp,
  GraduationCap,
  Scale,
  ListChecks,
  type LucideIcon,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuickPrompt {
  Icon: LucideIcon
  label: string
  prompt: string
}

export function UpAdvisor() {
  const { visibleApplications } = useStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/advisor' }),
  })

  // Compact, PII-light snapshot so the advisor can answer status questions.
  const snapshot = useMemo(
    () =>
      visibleApplications.map((a) => ({
        studentName: a.studentName,
        brand: a.course.brand,
        programme: a.course.programmeName,
        stage: a.stage,
        route: a.route,
        outstanding: [
          ...a.conditions
            .filter((c) => c.status !== 'cleared')
            .map((c) => `${c.label} (owner: ${c.owner})`),
          ...a.requirements
            .filter((r) => r.status === 'missing' || r.status === 'problem')
            .map((r) => r.label),
        ],
      })),
    [visibleApplications],
  )
  const snapshotRef = useRef(snapshot)
  snapshotRef.current = snapshot

  // Live pipeline count so the "outstanding tasks" prompt reflects real work.
  const outstandingCount = useMemo(
    () =>
      visibleApplications.reduce(
        (sum, a) =>
          sum +
          a.conditions.filter((c) => c.status !== 'cleared').length +
          a.requirements.filter((r) => r.status === 'missing' || r.status === 'problem').length,
        0,
      ),
    [visibleApplications],
  )

  const prompts: QuickPrompt[] = [
    {
      Icon: Scale,
      label: 'Tell me about the new 2027 immigration laws, and how they impact my applications',
      prompt: 'Tell me about the new 2027 immigration laws, and how they impact my applications.',
    },
    {
      Icon: ListChecks,
      label:
        outstandingCount > 0 ? `View my top ${outstandingCount} open activities` : 'View my open activities',
      prompt:
        'Summarise the outstanding tasks across my current applications, and tell me who needs to action each item.',
    },
    {
      Icon: GraduationCap,
      label: 'Check eligibility for new Masters AI course',
      prompt:
        "Check my students' eligibility for the new Master of Applied AI — what are the entry requirements and who qualifies?",
    },
  ]

  const busy = status === 'submitted' || status === 'streaming'

  const ask = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    sendMessage({ text: trimmed }, { body: { applications: snapshotRef.current } })
    setInput('')
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, status])

  const empty = messages.length === 0

  return (
    <section
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm',
        empty ? '' : 'h-full min-h-[420px]',
      )}
      aria-label="UP Advisor assistant"
    >
      <header className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <span className="grid size-8 place-items-center rounded-lg bg-ai/10 text-ai">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            UP Advisor
            <span className="rounded bg-ai/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ai">
              AI
            </span>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Courses, eligibility & pipeline support
          </p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {empty ? (
          <div className="flex flex-col">
            <p className="text-sm font-medium">Common questions</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {prompts.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => ask(q.prompt)}
                  className="flex flex-col items-start gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-ai/40 hover:bg-ai/5 hover:shadow-sm"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-md bg-ai/10 text-ai">
                    <q.Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-balance">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role}>
                {m.parts.map((part, i) =>
                  part.type === 'text' ? <RichText key={i} text={part.text} /> : null,
                )}
              </MessageBubble>
            ))}
            {status === 'submitted' && (
              <MessageBubble role="assistant">
                <ThinkingDots />
              </MessageBubble>
            )}
            {error && (
              <p className="text-xs text-destructive">
                Something went wrong reaching the advisor. Please try again.
              </p>
            )}
          </div>
        )}
      </div>

      <form
        className="border-t border-border p-2.5"
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
      >
        <div className="flex items-end gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 focus-within:border-ai/50 focus-within:ring-1 focus-within:ring-ai/30">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing &&
                e.keyCode !== 229
              ) {
                e.preventDefault()
                ask(input)
              }
            }}
            rows={1}
            placeholder="Ask UP Advisor…"
            className="max-h-28 min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            size="icon"
            className="size-8 shrink-0 rounded-md"
            disabled={busy || input.trim() === ''}
            aria-label="Send message"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </form>
    </section>
  )
}

function MessageBubble({
  role,
  children,
}: {
  role: string
  children: React.ReactNode
}) {
  const isUser = role === 'user'
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-br-sm bg-primary text-primary-foreground'
            : 'rounded-bl-sm bg-muted text-foreground',
        )}
      >
        {children}
      </div>
    </div>
  )
}

function ThinkingDots() {
  return (
    <span className="flex items-center gap-1 py-0.5" aria-label="UP Advisor is thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

// Lightweight renderer for the assistant's markdown-ish output: paragraphs,
// dash/asterisk bullet lists, and **bold** spans. Avoids a markdown dependency.
function RichText({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: React.ReactNode[] = []
  let list: string[] = []
  let key = 0

  const flushList = () => {
    if (list.length === 0) return
    blocks.push(
      <ul key={`ul-${key++}`} className="my-1 ml-4 list-disc space-y-1">
        {list.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>,
    )
    list = []
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const bullet = line.match(/^\s*[-*]\s+(.*)$/)
    if (bullet) {
      list.push(bullet[1])
      continue
    }
    flushList()
    if (line.trim() === '') continue
    if (/^\s*-{3,}\s*$/.test(line)) {
      blocks.push(<hr key={`hr-${key++}`} className="my-2 border-border" />)
      continue
    }
    blocks.push(
      <p key={`p-${key++}`} className="my-1 first:mt-0 last:mb-0 text-pretty">
        {renderInline(line)}
      </p>,
    )
  }
  flushList()

  return <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{blocks}</div>
}

function renderInline(text: string): React.ReactNode {
  const segments = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return segments.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return <strong key={i}>{seg.slice(2, -2)}</strong>
    }
    return <span key={i}>{seg}</span>
  })
}
