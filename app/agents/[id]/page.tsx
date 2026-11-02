import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { AgentFunnel } from '@/components/agents/agent-funnel'
import { AgentQuality } from '@/components/agents/agent-quality'
import { AgentRightsControl, AgentStatusControl } from '@/components/agents/agent-controls'
import { AgentTabs } from '@/components/agents/agent-tabs'
import { getAgentProfile, isGoldTier } from '@/lib/agent-profiles'
import { cn } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const p = getAgentProfile(id)
  return { title: p ? `${p.name} | Agent profile` : 'Agent profile' }
}

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = getAgentProfile(id)
  if (!profile) notFound()

  const initials = profile.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  const since = new Date(profile.since).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })
  const gold = isGoldTier(profile)

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 self-start text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to dashboard
        </Link>

        <AgentTabs activeId={profile.id} />

        <section
          aria-labelledby="agent-heading"
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="relative shrink-0">
              <span
                className={cn(
                  'grid size-14 place-items-center rounded-full bg-brand text-lg font-semibold text-brand-foreground',
                  gold && 'ring-[3px] ring-[oklch(0.78_0.16_80)] ring-offset-2 ring-offset-card',
                )}
              >
                {initials}
              </span>
              {gold && (
                <span
                  className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-[oklch(0.78_0.16_80)] ring-2 ring-card"
                  title="Gold tier — trusted agent"
                >
                  <ShieldCheck className="size-3.5 text-[oklch(0.25_0.05_60)]" strokeWidth={3} aria-hidden />
                </span>
              )}
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 id="agent-heading" className="text-xl font-semibold text-foreground">
                  {profile.name}
                </h1>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {profile.agentCode}
                </span>
                <span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted-foreground">
                  {profile.role}
                </span>
                {gold && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.78_0.16_80)]/15 px-2 py-0.5 text-xs font-semibold text-[oklch(0.6_0.14_75)]">
                    <ShieldCheck className="size-3.5" aria-hidden />
                    Gold tier · Trusted agent
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {profile.agency} · Agent since {since}
                {gold && (
                  <>
                    {' '}
                    · <span className="text-foreground">UP trusts this agent&apos;s applications: fast-tracked offers and scholarship requests</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 md:text-right">
            <Detail icon={Mail} label="Email" value={profile.email} />
            <Detail icon={Phone} label="Phone" value={profile.phone} />
            <Detail icon={MapPin} label="Based in" value={profile.region} />
            <Detail label="Markets" value={profile.markets.join(', ')} />
          </dl>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            <AgentQuality profile={profile} />
            <AgentFunnel funnel={profile.funnel} />
          </div>
          <div className="flex flex-col gap-6">
            <AgentStatusControl key={`s-${profile.id}`} profile={profile} />
            <AgentRightsControl key={`r-${profile.id}`} profile={profile} />
          </div>
        </div>
      </main>
    </div>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col md:items-end">
      <dt className="flex items-center gap-1 text-xs text-muted-foreground">
        {Icon && <Icon className="size-3" />}
        {label}
      </dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  )
}
