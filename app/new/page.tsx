'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { WizardProvider } from '@/lib/wizard'
import { WizardShell } from '@/components/wizard/wizard-shell'
import { findJourney } from '@/lib/journeys'
import { useStore } from '@/lib/store'

function NewApplication() {
  const params = useSearchParams()
  const journey = findJourney(params.get('journey'))
  // Adding an application for a student already on file: ?existing=<application id>.
  const existingId = params.get('existing')
  const { getApplication } = useStore()
  const existingApplication = existingId ? (getApplication(existingId) ?? null) : null
  return (
    // Keyed so switching journeys or students from an index starts a fresh wizard.
    <WizardProvider
      key={journey?.id ?? (existingApplication ? `existing-${existingApplication.id}` : 'blank')}
      journey={journey}
      existingApplication={existingApplication}
    >
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
