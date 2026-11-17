import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { AgentProfileView } from '@/components/agents/agent-profile-view'
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

  return (
    <div className="min-h-screen">
      <AppHeader />
      <AgentProfileView profile={profile} />
    </div>
  )
}
