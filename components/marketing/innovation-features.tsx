'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ScanText,
  Wand2,
  Radar,
  MailCheck,
  PlugZap,
  Sparkles,
  Check,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Innovation {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  benefit: string
  ai?: boolean
}

const INNOVATIONS: Innovation[] = [
  {
    icon: ScanText,
    eyebrow: 'Document intelligence',
    title: 'AI verification & translation of documents',
    description:
      'Every passport, transcript and certificate is read, authenticated and translated on upload — whatever language it arrives in.',
    benefit: 'Reviewers work from trusted, English-ready evidence from the very first pass.',
  },
  {
    icon: Wand2,
    eyebrow: 'Auto-fill',
    title: 'Auto-populated fields for speed & accuracy',
    description:
      'Extracted data flows straight into the application, so names, dates and results are captured once and carried through.',
    benefit: 'Faster submissions with far fewer typos, mismatches and re-keying errors.',
  },
  {
    icon: Radar,
    eyebrow: 'Live readiness',
    title: 'Real-time tracking of offers & evidence',
    description:
      'Readiness of the Letter of Offer and its supporting evidence is tracked live, flagging anything still outstanding.',
    benefit: 'Everything is provided right the first time — no back-and-forth chasing.',
  },
  {
    icon: MailCheck,
    eyebrow: 'Email sync',
    title: 'Emailed documents captured automatically',
    description:
      'Documents sent by email are auto-tracked, uploaded into the system and run through the same AI verify-and-translate pipeline.',
    benefit: 'The 70% that used to live in inboxes is now connected to the record.',
  },
  {
    icon: PlugZap,
    eyebrow: 'Verification APIs',
    title: 'APIs for document & test verification',
    description:
      'English test scores and certificate authenticity are checked directly against provider APIs, step by step.',
    benefit: 'Fraudulent or mismatched results are caught before an offer is issued.',
  },
  {
    icon: Sparkles,
    eyebrow: 'AI advisor',
    title: 'AI advisor for eligibility & on-hand support',
    description:
      'A grounded advisor answers eligibility, programme-fit and special-condition questions in the context of each application.',
    benefit: 'Instant, application-aware guidance instead of days on an email thread.',
    ai: true,
  },
]

export function InnovationFeatures() {
  const [visible, setVisible] = useState<Set<number>>(new Set())
  const rowRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev)
          for (const entry of entries) {
            if (entry.isIntersecting) {
              next.add(Number((entry.target as HTMLElement).dataset.index))
            }
          }
          return next
        })
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.25 },
    )

    for (const node of rowRefs.current) {
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            What makes it different
          </p>
          <h2 className="mt-3 text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
            The innovation behind every offer
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            Six connected capabilities carry an application from a folder of documents to a verified
            Letter of Offer.
          </p>
        </div>

        <ol className="mx-auto mt-14 max-w-4xl">
          {INNOVATIONS.map((item, i) => {
            const isVisible = visible.has(i)
            const isAI = item.ai
            return (
              <li
                key={item.title}
                data-index={i}
                ref={(el) => {
                  rowRefs.current[i] = el
                }}
                className={cn(
                  'group relative grid gap-6 py-8 transition-all duration-700 ease-out sm:grid-cols-[auto_1fr] sm:gap-8',
                  i !== 0 && 'border-t border-border',
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
                )}
              >
                {/* Marker + connector */}
                <div className="flex items-start gap-4 sm:flex-col sm:items-center">
                  <span
                    className={cn(
                      'grid size-12 shrink-0 place-items-center rounded-2xl shadow-sm transition-colors',
                      isAI ? 'bg-ai/10 text-ai' : 'bg-accent text-primary',
                    )}
                  >
                    <item.icon className="size-6" />
                  </span>
                  <span className="mt-1 text-sm font-semibold tabular-nums text-muted-foreground/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="min-w-0">
                  <p
                    className={cn(
                      'text-xs font-semibold uppercase tracking-[0.18em]',
                      isAI ? 'text-ai' : 'text-primary/70',
                    )}
                  >
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-1.5 text-pretty text-lg font-semibold tracking-tight sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-3 inline-flex items-start gap-2 text-[13px] font-medium leading-relaxed text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {item.benefit}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
