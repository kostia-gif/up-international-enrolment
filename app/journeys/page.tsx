import type { Metadata } from 'next'
import { AppHeader } from '@/components/app-header'
import { JourneyIndex } from '@/components/journey-index'

export const metadata: Metadata = {
  title: 'POC journeys — Agent POC',
  description: 'Scripted applicant journeys that walk the application wizard through each business-rule outcome.',
}

export default function JourneysPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <JourneyIndex />
    </div>
  )
}
