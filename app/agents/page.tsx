import { redirect } from 'next/navigation'
import { listAgentProfiles } from '@/lib/agent-profiles'

export default function AgentsIndex() {
  const first = listAgentProfiles()[0]
  redirect(`/agents/${first?.id ?? ''}`)
}
