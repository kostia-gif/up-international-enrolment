'use client'

import { AppHeader } from '@/components/app-header'
import { WizardProvider } from '@/lib/wizard'
import { WizardShell } from '@/components/wizard/wizard-shell'

export default function NewApplicationPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <WizardProvider>
        <WizardShell />
      </WizardProvider>
    </div>
  )
}
