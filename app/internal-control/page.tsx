import type { Metadata } from 'next'
import { IcHeader } from '@/components/internal-control/ic-header'
import { IcJourney } from '@/components/internal-control/ic-journey'
import {
  IcSummaryCards,
  IcMetrics,
  IcSchoolFollowUps,
} from '@/components/internal-control/ic-summary'
import { IcQueue } from '@/components/internal-control/ic-queue'

export const metadata: Metadata = {
  title: 'Internal Control — UP Apply Platform',
  description:
    'Independently audit international admissions applications and verify final student compliance evidence.',
}

export default function InternalControlDashboardPage() {
  return (
    <div className="min-h-screen">
      <IcHeader />
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold tracking-tight">Internal Control</h1>
          <p className="mt-1 text-pretty text-sm text-muted-foreground">
            Independently audit international admissions applications and verify final student
            compliance evidence.
          </p>
        </div>

        <div className="mt-5">
          <IcSummaryCards />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <IcJourney />
          <IcSchoolFollowUps />
        </div>

        <div className="mt-4">
          <IcMetrics />
        </div>

        <div className="mt-6">
          <IcQueue />
        </div>
      </main>
    </div>
  )
}
