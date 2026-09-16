'use client'

import { use } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { AdmissionsHeader } from '@/components/admissions/admissions-header'
import { ApplicationSummary } from '@/components/admissions/application-summary'
import { Button } from '@/components/ui/button'

export default function AdmissionsApplicationPage({
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
        <ApplicationSummary app={app} />
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
          <h1 className="text-lg font-semibold">Application not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This file may have been removed or the link is out of date.
          </p>
          <Button render={<Link href="/admissions" />} nativeButton={false} className="mt-4">
            Back to review queue
          </Button>
        </div>
      )}
    </div>
  )
}
