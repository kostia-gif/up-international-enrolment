'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import {
  Sparkles,
  ArrowUp,
  X,
  FileSearch,
  ShieldCheck,
  ListChecks,
  GraduationCap,
  Percent,
  ClipboardCheck,
} from 'lucide-react'
import { useWizard, WIZARD_STEPS } from '@/lib/wizard'
import { FIELD_TOTAL } from '@/lib/fixtures'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuickPrompt {
  icon: React.ReactNode
  label: string
  prompt: string
}

// Prompts adapt to the step the agent is on, so the help is about what's on
// screen right now — checking rules and reviewing docs before uploading,
// insurance options, special conditions, and so on.
function promptsForStep(step: number): QuickPrompt[] {
  const help: QuickPrompt = {
    icon: <ClipboardCheck className="size-3.5" />,
    label: 'Help with this application',
    prompt:
      'Look at the application I am building right now. What still needs my attention, and what should I do next?',
  }
  switch (step) {
    case 1:
      return [
        {
          icon: <GraduationCap className="size-3.5" />,
          label: 'Which programme fits?',
          prompt:
            'Based on this student, which UP programme is the best fit and what are its entry requirements and next open intake?',
        },
        help,
      ]
    case 2:
      return [
        {
          icon: <FileSearch className="size-3.5" />,
          label: 'Check a doc before I upload',
          prompt:
            'Before I upload, what makes a document valid here? I want to check my passport and transcript will pass the rules.',
        },
        {
          icon: <ListChecks className="size-3.5" />,
          label: 'What documents are required?',
          prompt: 'What documents does this application need, and which are still missing?',
        },
        help,
      ]
    case 3:
      return [
        {
          icon: <ListChecks className="size-3.5" />,
          label: "What's still outstanding?",
          prompt:
            'Review the extracted data and requirements. What is still outstanding or needs confirming before I continue?',
        },
        help,
      ]
    case 4:
      return [
        {
          icon: <ShieldCheck className="size-3.5" />,
          label: 'Insurance options',
          prompt: 'What are the insurance options here, and which one adds a condition to the offer?',
        },
        {
          icon: <Percent className="size-3.5" />,
          label: 'Discounts & special conditions',
          prompt:
            'Explain the discount options and special admission — which of these route the application to admissions review, and what conditions get added to the offer?',
        },
        help,
      ]
    default:
      return [help]
  }
}

export function WizardAssistant() {
  const wizard = useWizard()
  const { step, student, courses, documents, requirements, requests, fields, notes } = wizard
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/wizard-advisor' }),
  })

  const stepLabel = WIZARD_STEPS.find((s) => s.key === step)?.label ?? `Step ${step}`

  // Compact snapshot of the live draft, rebuilt each render and read through a
  // ref so a send always uses the latest state.
  const draft = useMemo(
    () => ({
      step: stepLabel,
      studentName: `${student.given} ${student.family}`.trim(),
      nationality: student.nationality,
      courses: courses.map((c) => ({
        brand: c.brand,
        programme: c.programmeName,
        level: c.level,
        campus: c.campus,
        intake: c.intakeDate,
      })),
      documents: documents.map((d) => ({ type: d.type, status: d.status })),
      requirements: requirements.map((r) => ({
        label: r.label,
        category: r.category,
        status: r.status,
      })),
      requests: requests.map((r) => ({ type: r.type, detail: r.detail, status: r.status })),
      fieldsExtracted: fields.filter((f) => f.source === 'ai' && f.value.trim() !== '').length,
      fieldsConfirmed: fields.filter((f) => f.status === 'confirmed').length,
      fieldTotal: FIELD_TOTAL,
      notes,
    }),
    [stepLabel, student, courses, documents, requirements, requests, fields, notes],
  )
  const draftRef = useRef(draft)
  draftRef.current = draft

  const busy = status === 'submitted' || status === 'streaming'

  const ask = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setOpen(true)
    sendMessage({ text: trimmed }, { body: { draft: draftRef.current } })
    setInput('')
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, status, open])

  const prompts = promptsForStep(step)
  const empty = messages.length === 0

  return (
    <>
      {/* Launcher card, lives in the wizard rail under the readiness gauges */}
      <section
        className="rounded-lg border border-ai/30 bg-ai/5 p-3"
        aria-label="UP Advisor assistant"
      >
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-ai/15 text-ai">
            <Sparkles className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold leading-tight">
              UP Advisor
              <span className="rounded bg-ai/15 px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide text-ai">
                AI
              </span>
            </p>
            <p className="truncate text-[11px] text-muted-foreground">Help on this step</p>
          </div>
        </div>

        <div className="mt-2.5 flex flex-col gap-1.5">
          {prompts.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => ask(q.prompt)}
              className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-left text-xs transition-colors hover:border-ai/40 hover:bg-ai/5"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded bg-ai/10 text-ai">
                {q.icon}
              </span>
              <span className="text-pretty font-medium leading-tight">{q.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2 w-full rounded-md px-2 py-1 text-[11px] font-medium text-ai transition-colors hover:bg-ai/10"
        >
          {empty ? 'Ask a question' : 'Open conversation'}
        </button>
      </section>

      {/* Docked conversation panel */}
      {open && (
        <div className="fixed bottom-4 left-4 z-50 flex h-[560px] max-h-[calc(100dvh-6rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <header className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <span className="grid size-8 place-items-center rounded-lg bg-ai/10 text-ai">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                UP Advisor
                <span className="rounded bg-ai/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ai">
                  AI
                </span>
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {stepLabel} · {draft.studentName || 'New application'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close assistant"
            >
              <X className="size-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            {empty ? (
              <div className="flex flex-col">
                <p className="text-pretty text-sm text-muted-foreground">
                  I can see the application you&apos;re building. Ask me to check a document before
                  you upload it, explain insurance or discount options, or tell you what&apos;s still
                  outstanding on this step.
                </p>
                <div className="mt-3 grid gap-2">
                  {prompts.map((q) => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => ask(q.prompt)}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ai/40 hover:bg-ai/5 hover:shadow-sm"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-ai/10 text-ai">
                        {q.icon}
                      </span>
                      <span className="font-medium">{q.label}</span>
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
                placeholder="Ask about this application…"
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
        </div>
      )}
    </>
  )
}

function MessageBubble({ role, children }: { role: string; children: React.ReactNode }) {
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
      <p key={`p-${key++}`} className="my-1 text-pretty first:mt-0 last:mb-0">
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
