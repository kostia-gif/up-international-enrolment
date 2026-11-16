import type { Metadata } from 'next'
import { AgentLogin } from '@/components/agent-login'

export const metadata: Metadata = { title: 'Sign in | UP Enrol' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode } = await searchParams
  return <AgentLogin initialMode={mode === 'reset' ? 'reset' : 'signin'} />
}
