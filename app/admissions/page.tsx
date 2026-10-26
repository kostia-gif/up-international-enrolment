'use client'

import { AdmissionsHeader } from '@/components/admissions/admissions-header'
import { ReviewQueue } from '@/components/admissions/review-queue'
import { useStore } from '@/lib/store'

export default function AdmissionsDashboardPage() {
  const { applications } = useStore()

  return (
    <div className="min-h-screen">
      <AdmissionsHeader />
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <h1 className="text-xl font-semibold tracking-tight">Review queue</h1>
        <div className="mt-5">
          <ReviewQueue applications={applications} />
        </div>
      </main>
    </div>
  )
}
