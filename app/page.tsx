import Link from 'next/link'
import {
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Users,
  Building2,
  FileCheck2,
  ScanSearch,
  FileSearch,
  TrendingUp,
} from 'lucide-react'

export default function PortalForkPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[oklch(0.2_0.05_270)] via-brand to-[oklch(0.28_0.07_230)] text-brand-foreground">
      <div
        className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-[oklch(0.6_0.11_184)]/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 size-80 rounded-full bg-[oklch(0.55_0.17_285)]/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        <header className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-[oklch(0.55_0.2_27)] text-base font-black leading-none tracking-tight text-white shadow-sm">
              UP
            </span>
            <span className="text-sm font-semibold tracking-tight">Apply Platform</span>
          </div>
          <Link
            href="/product"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-brand-foreground/80 transition-colors hover:bg-white/10"
          >
            Why UP Apply
            <ArrowRight className="size-3.5" />
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground/60">
              UP Education · New Zealand
            </p>
            <h1 className="mt-3 text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
              One platform, four ways in
            </h1>
            <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-brand-foreground/70">
              Agents build and submit international student applications. UP admissions reviews,
              verifies and issues offers. Internal Control independently audits the outcome. Sales tracks the whole pipeline. Choose
              where you&apos;re working today.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PortalCard
              href="/agent"
              eyebrow="For education agents"
              title="Agent enrolment"
              description="Create applications, drop documents in any language, let AI extract and check them, and submit for an offer."
              icon={GraduationCap}
              confidence={70}
              points={[
                { icon: Users, label: 'Your agency pipeline' },
                { icon: FileCheck2, label: 'AI document intake' },
              ]}
            />
            <PortalCard
              href="/admissions"
              eyebrow="For UP admissions"
              title="Admissions review"
              description="Work the review queue, step through evidence with original and translated documents, and push verified files to CRM."
              icon={Building2}
              confidence={90}
              points={[
                { icon: ShieldCheck, label: 'Verify & approve' },
                { icon: FileCheck2, label: 'Issue Letters of Offer' },
              ]}
              accent
            />
            <PortalCard
              href="/internal-control"
              eyebrow="For internal control"
              title="Internal Control"
              description="Independently audit a 20% sample of unconditional offers against final visa, insurance and school SMS evidence."
              icon={ScanSearch}
              confidence={50}
              points={[
                { icon: FileSearch, label: 'Sample & compare' },
                { icon: ShieldCheck, label: 'Confirm compliance' },
              ]}
            />
            <PortalCard
              href="/sales"
              eyebrow="For sales & partners"
              title="Sales pipeline"
              description="Conversion, application volume, unfinished apps, outstanding conditions and INZ visa outcomes. Separate views for agents and external stakeholders."
              icon={TrendingUp}
              confidence={50}
              points={[
                { icon: Users, label: 'Agent & stakeholder views' },
                { icon: FileCheck2, label: 'Conditions & visas' },
              ]}
            />
          </div>

          <div className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground/60">
              The problems we&apos;re solving
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ProblemPanel
                title="For education agents"
                items={[
                  'Letters of Offer that take days, not under 2 hours',
                  'Inaccurate offers — wrong fees and course details',
                  'Low confidence in admission, especially special requirements',
                  'Lost data across emails and Enroller glitches',
                  'Uncoordinated engagement with the student',
                  'Poor exception handling — fees, fast-track, special circumstances, insurance',
                ]}
              />
              <ProblemPanel
                title="For UP admissions"
                accent
                items={[
                  'Manual, time-consuming review process',
                  'Missing documentation and constant requirement chasing',
                  '70% arrives by email, disconnected from the system',
                  'No API to verify English test results',
                  'Platform underused — low Enroller trust',
                  'Poorly configured CRM experience',
                ]}
              />
            </div>

            <div className="mt-4">
              <ProblemPanel
                title="For sales & relationship teams"
                items={[
                  'No visibility of pre-approvals',
                  'Lack of data to view and optimise the funnel',
                  'Too little flexibility to respond to change fast',
                  'No easy sharing of emerging law and policy changes',
                  'Poor UX and tools that erode trust and preference',
                ]}
                columns
              />
            </div>
          </div>
        </div>

        <footer className="flex flex-col gap-2 text-xs text-brand-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <span>Prototype · mock data. Both portals share the same live application records.</span>
          <Link
            href="/product"
            className="font-medium text-brand-foreground/70 underline-offset-4 hover:text-brand-foreground hover:underline"
          >
            Explore features &amp; benefits
          </Link>
        </footer>
      </div>
    </main>
  )
}

function ProblemPanel({
  title,
  items,
  accent,
  columns,
}: {
  title: string
  items: string[]
  accent?: boolean
  columns?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-2">
        <span
          className={
            accent
              ? 'size-1.5 rounded-full bg-primary'
              : 'size-1.5 rounded-full bg-[oklch(0.6_0.11_184)]'
          }
          aria-hidden
        />
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-brand-foreground/60">
          {title}
        </h3>
      </div>
      <ul
        className={
          columns
            ? 'mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2'
            : 'mt-3 flex flex-col gap-2'
        }
      >
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-pretty text-sm leading-snug text-brand-foreground/75"
          >
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-foreground/40" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PortalCard({
  href,
  eyebrow,
  title,
  description,
  icon: Icon,
  points,
  accent,
  confidence,
}: {
  href: string
  eyebrow: string
  title: string
  description: string
  icon: typeof GraduationCap
  points: { icon: typeof Users; label: string }[]
  accent?: boolean
  confidence: number
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-lg backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={
            accent
              ? 'grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm'
              : 'grid size-11 place-items-center rounded-xl bg-white/15 text-brand-foreground'
          }
        >
          <Icon className="size-5" />
        </span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-brand-foreground">
            {confidence}% confident
          </span>
          <span
            className="h-1 w-16 overflow-hidden rounded-full bg-white/10"
            role="meter"
            aria-label={`${title} confidence`}
            aria-valuenow={confidence}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span
              className="block h-full rounded-full bg-[oklch(0.6_0.11_184)]"
              style={{ width: `${confidence}%` }}
            />
          </span>
        </div>
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-brand-foreground/55">
        {eyebrow}
      </p>
      <h2 className="mt-1 flex items-center gap-1.5 text-lg font-semibold tracking-tight">
        {title}
        <ArrowRight className="size-4 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
      </h2>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-brand-foreground/70">
        {description}
      </p>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-4">
        {points.map((p) => (
          <li
            key={p.label}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-foreground/70"
          >
            <p.icon className="size-3.5" />
            {p.label}
          </li>
        ))}
      </ul>
    </Link>
  )
}
