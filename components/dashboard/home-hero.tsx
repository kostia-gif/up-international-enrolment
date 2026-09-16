'use client'

import { UpAdvisor } from '@/components/dashboard/up-advisor'

// The agent home hero is now the UP Advisor itself — it replaces the old
// "start a new application" CTA (still available in the header) and the
// news & offers rail, surfacing that content as suggested advisor prompts.
export function HomeHero() {
  return <UpAdvisor />
}
