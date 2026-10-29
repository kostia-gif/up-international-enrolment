import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { AgentFunnel } from '@/components/agents/agent-funnel'
import { AgentRightsControl, AgentStatusControl } from '@/components/agents/agent-controls'
import { AgentTabs } from '@/components/agents/agent-tabs'
import { getAgentProfile } from '@/lib/agent-profiles'

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
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-brand text-lg font-semibold text-brand-foreground">
              {initials}
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
              </div>
              <p className="text-sm text-muted-foreground">
                {profile.agency} · Agent since {since}
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
          <AgentFunnel funnel={profile.funnel} />
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
