'use client'

import { use } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { AdmissionsHeader } from '@/components/admissions/admissions-header'
import { ReviewWizard } from '@/components/admissions/review-wizard'
import { Button } from '@/components/ui/button'

export default function AdmissionsReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { getApplication } = useStore()
  const app = getApplication(id)

  return (
    <div className="min-h-screen">
      <AdmissionsHeader />
      {app ? (
        <ReviewWizard app={app} />
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
          <h1 className="text-lg font-semibold">Application not found</h1>
          <Button render={<Link href="/admissions" />} nativeButton={false} className="mt-4">
            Back to review queue
          </Button>
        </div>
      )}
    </div>
  )
}
