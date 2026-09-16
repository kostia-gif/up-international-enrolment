import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Languages, ShieldCheck, RefreshCw } from 'lucide-react'
import { AudienceShowcase } from '@/components/marketing/audience-showcase'
import { InnovationFeatures } from '@/components/marketing/innovation-features'

export const metadata: Metadata = {
  title: 'UP Apply Platform — AI-powered international student enrolment',
  description:
    'One enrolment platform for education agents and UP admissions. AI document intake in any language, live readiness, provider-verified English tests, CRM sync and Letters of Offer.',
}

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.2_0.05_270)] via-brand to-[oklch(0.28_0.07_230)] text-brand-foreground">
        <div
          className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-[oklch(0.6_0.11_184)]/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 left-1/4 size-80 rounded-full bg-[oklch(0.55_0.17_285)]/20 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <header className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-[oklch(0.55_0.2_27)] text-base font-black leading-none tracking-tight text-white shadow-sm">
                UP
              </span>
              <span className="text-sm font-semibold tracking-tight">Apply Platform</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-brand-foreground/80 transition-colors hover:bg-white/10"
            >
              Go to portals
              <ArrowRight className="size-3.5" />
            </Link>
          </header>

          <div className="max-w-3xl py-16 sm:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground/60">
              UP Education · New Zealand
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              International student enrolment, done right the first time
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-foreground/75">
              One AI-powered platform where education agents build and submit applications and UP
              admissions reviews, verifies and issues offers — sharing the same live records end to
              end.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#choose"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:brightness-105"
              >
                Explore by role
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-white/10"
              >
                Enter the platform
              </Link>
            </div>

            <ul className="mt-12 grid gap-4 sm:grid-cols-3">
              {HERO_POINTS.map((p) => (
                <li key={p.label} className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-brand-foreground">
                    <p.icon className="size-4" />
                  </span>
                  <span className="text-sm leading-snug text-brand-foreground/80">{p.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Audience selector + features */}
      <div id="choose" className="scroll-mt-6">
        <AudienceShowcase />
      </div>

      {/* Innovation features */}
      <InnovationFeatures />

      {/* How it works */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
              One flow, from application to offer
            </h2>
          </div>

          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="text-sm font-semibold text-primary tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-pretty text-base font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.2_0.05_270)] via-brand to-[oklch(0.28_0.07_230)] px-8 py-14 text-center text-brand-foreground shadow-lg">
          <div
            className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-[oklch(0.6_0.11_184)]/25 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-xl">
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to see it with your own applications?
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-brand-foreground/75">
              Jump into whichever portal you work in — both run on the same live, shared records.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/agent"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:brightness-105"
              >
                Agent enrolment
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.08] px-5 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-white/12"
              >
                Admissions review
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>UP Apply Platform · Prototype with mock data.</p>
          <Link href="/" className="font-medium text-foreground hover:text-primary">
            Back to portals
          </Link>
        </div>
      </footer>
    </main>
  )
}

const HERO_POINTS = [
  { icon: Languages, label: 'AI reads and translates documents in any language' },
  { icon: ShieldCheck, label: 'Provider-verified English tests and evidence' },
  { icon: RefreshCw, label: 'Verified files kept in sync with your CRM' },
]

const STEPS = [
  {
    title: 'Agents build the application',
    description:
      'Documents are dropped in any language; AI extracts, translates and checks them while live readiness confirms nothing is missing.',
  },
  {
    title: 'Admissions reviews the evidence',
    description:
      'A prioritised queue with side-by-side originals and translations, auto-checked requirements and provider-verified test scores.',
  },
  {
    title: 'Offers issued and synced',
    description:
      'Conditional or unconditional Letters of Offer are generated in-platform and verified files push straight to the CRM.',
  },
]
