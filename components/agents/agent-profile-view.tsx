'use client'

import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { agencyForCounsellor } from '@/lib/fixtures'
import { standingFor, STANDING_COPY, type AgentProfile } from '@/lib/agent-profiles'
import { AgentTabs } from '@/components/agents/agent-tabs'
import { AgencyStrip } from '@/components/agents/agency-strip'
import { ProfileDetails } from '@/components/agents/profile-details'
import { AgentRightsPanel } from '@/components/agents/agent-controls'
import { cn } from '@/lib/utils'

export function AgentProfileView({ profile }: { profile: AgentProfile }) {
  // The profile being viewed, not the signed-in agent — each agent shows
  // their own agency's standing here.
  const agency = agencyForCounsellor(profile.id)
  const standing = standingFor(profile, agency)
  const initials = profile.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  const since = new Date(profile.since).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 md:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 self-start text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to dashboard
      </Link>

      <AgentTabs activeId={profile.id} />

      <AgencyStrip agency={agency} />

      <section
        aria-labelledby="agent-heading"
        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
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
              <span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted-foreground">
                {profile.role}
              </span>
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                {profile.agentCode}
              </span>
              <span className="text-xs text-muted-foreground">Agent since {since}</span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3" aria-hidden />
              {profile.region} · {profile.markets.join(', ')}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold',
            standing === 'trusted' && 'bg-success/15 text-success',
            standing === 'standard' && 'bg-muted text-muted-foreground',
            standing === 'building' && 'border border-dashed border-border text-muted-foreground',
            standing === 'review' && 'bg-destructive/15 text-destructive',
          )}
        >
          {STANDING_COPY[standing].chip}
        </span>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <ProfileDetails profile={profile} />
        </div>
        <div className="flex flex-col gap-6">
          <AgentRightsPanel profile={profile} agency={agency} />
        </div>
      </div>
    </main>
  )
}
