'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { WizardProvider } from '@/lib/wizard'
import { WizardShell } from '@/components/wizard/wizard-shell'
import { findJourney } from '@/lib/journeys'

function NewApplication() {
  const params = useSearchParams()
  const journey = findJourney(params.get('journey'))
  return (
    // Keyed so switching journeys from the index starts a fresh wizard.
    <WizardProvider key={journey?.id ?? 'blank'} journey={journey}>
      <WizardShell />
    </WizardProvider>
  )
}

export default function NewApplicationPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <Suspense fallback={null}>
        <NewApplication />
      </Suspense>
    </div>
  )
}
