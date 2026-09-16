'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Languages,
  Gauge,
  Sparkles,
  Users,
  FileSignature,
  ListChecks,
  ScanSearch,
  BadgeCheck,
  Mail,
  RefreshCw,
  GraduationCap,
  Building2,
  Check,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AudienceId = 'agent' | 'admin'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  benefit: string
}

interface Audience {
  id: AudienceId
  label: string
  select: string
  tagline: string
  icon: LucideIcon
  href: string
  cta: string
  headline: string
  intro: string
  features: Feature[]
}

const AUDIENCES: Audience[] = [
  {
    id: 'agent',
    label: 'Education agent',
    select: "I'm an education agent",
    tagline: 'Build & submit applications',
    icon: GraduationCap,
    href: '/agent',
    cta: 'Open agent enrolment',
    headline: 'Submit offer-ready applications the first time',
    intro:
      'Turn a folder of documents in any language into a complete, checked application — with an AI advisor beside you at every step.',
    features: [
      {
        icon: Languages,
        title: 'AI document intake, any language',
        description:
          'Drop passports, transcripts and test reports in any language. AI reads, translates and extracts every field for you.',
        benefit: 'Hours of manual data entry gone, with far fewer rejected submissions.',
      },
      {
        icon: Gauge,
        title: 'Guided wizard with live readiness',
        description:
          'A step-by-step flow with readiness gauges that show exactly what is still missing before you submit.',
        benefit: 'No more guessing — you submit only when the application is truly complete.',
      },
      {
        icon: Sparkles,
        title: 'UP Advisor at your side',
        description:
          'Ask about programme fit, entry rules, insurance options or special conditions, and have the AI check a document before you upload it.',
        benefit: 'Instant, grounded answers instead of waiting days on an email thread.',
      },
      {
        icon: Users,
        title: 'One pipeline for your whole agency',
        description:
          'Every student, brand and intake tracked in a single view with clear next actions.',
        benefit: 'Nothing slips between the cracks across your full book of students.',
      },
      {
        icon: FileSignature,
        title: 'Faster conditional offers',
        description:
          'Clean, verified applications move through UP admissions quickly and come back as Letters of Offer.',
        benefit: 'Quicker turnarounds mean faster commissions and happier students.',
      },
    ],
  },
  {
    id: 'admin',
    label: 'UP administrator',
    select: "I'm a UP administrator",
    tagline: 'Review, verify & issue offers',
    icon: Building2,
    href: '/admissions',
    cta: 'Open admissions review',
    headline: 'Review with confidence, decide in minutes',
    intro:
      'A prioritised queue, side-by-side evidence and automated verification so your team spends time on judgement, not paperwork.',
    features: [
      {
        icon: ListChecks,
        title: 'Smart, prioritised review queue',
        description:
          'Applications auto-sorted into awaiting, fast-track and conditional buckets with the highest-impact work surfaced first.',
        benefit: 'Your team always knows what to pick up next.',
      },
      {
        icon: ScanSearch,
        title: 'Evidence step-through',
        description:
          'Original and translated documents side by side, with academic requirements auto-checked against the course criteria and full achievements on hand.',
        benefit: 'Every decision is backed by clear, verifiable evidence.',
      },
      {
        icon: BadgeCheck,
        title: 'Automated English verification',
        description:
          'Test scores and certificate authenticity are verified directly against the provider’s API, step by step.',
        benefit: 'Fraudulent or mismatched results are caught before an offer is made.',
      },
      {
        icon: Mail,
        title: 'Engagement & communications',
        description:
          'See which applicants emailed documents, open a communications digest and drop into any applicant’s thread.',
        benefit: 'Full context on every conversation without leaving the queue.',
      },
      {
        icon: RefreshCw,
        title: 'Always in sync with your CRM',
        description:
          'Verified files push straight to Dynamics, with a live indicator confirming every record is reconciled.',
        benefit: 'One source of truth your whole institution can rely on.',
      },
      {
        icon: FileSignature,
        title: 'Issue Letters of Offer in-platform',
        description:
          'Approve and generate conditional or unconditional offers without switching tools.',
        benefit: 'Close the loop in a single, auditable workflow.',
      },
    ],
  },
]

export function AudienceShowcase() {
  const [active, setActive] = useState<AudienceId>('agent')
  const audience = AUDIENCES.find((a) => a.id === active)!

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Built for both sides of the desk
        </p>
        <h2 className="mt-3 text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
          Choose your view
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          The same live records power both experiences. Pick the role you work in to see the
          features and benefits made for you.
        </p>
      </div>

      {/* Audience selector */}
      <div
        role="tablist"
        aria-label="Choose your view"
        className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm"
      >
        {AUDIENCES.map((a) => {
          const selected = a.id === active
          return (
            <button
              key={a.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(a.id)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200',
                selected
                  ? 'bg-brand text-brand-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-secondary',
              )}
            >
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-lg',
                  selected ? 'bg-white/15 text-brand-foreground' : 'bg-secondary text-foreground',
                )}
              >
                <a.icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold tracking-tight">{a.select}</span>
                <span
                  className={cn(
                    'block truncate text-xs',
                    selected ? 'text-brand-foreground/70' : 'text-muted-foreground',
                  )}
                >
                  {a.tagline}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Active audience panel */}
      <div className="mt-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h3 className="text-pretty text-xl font-semibold tracking-tight sm:text-2xl">
              {audience.headline}
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              {audience.intro}
            </p>
          </div>
          <Link
            href={audience.href}
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:brightness-105"
          >
            {audience.cta}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {audience.features.map((f) => (
            <article
              key={f.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
                <f.icon className="size-5" />
              </span>
              <h4 className="mt-4 text-pretty text-sm font-semibold tracking-tight">{f.title}</h4>
              <p className="mt-1.5 text-pretty text-[13px] leading-relaxed text-muted-foreground">
                {f.description}
              </p>
              <p className="mt-4 flex items-start gap-2 border-t border-border pt-3 text-[13px] font-medium leading-relaxed text-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                {f.benefit}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
