'use client'

import { use, useState } from 'react'
import { NewCount } from '@/components/new-badge'
import { isNewDocument, isNewEvent, isNewOffer, offerLetters } from '@/lib/documents'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { AppHeader } from '@/components/app-header'
import { DetailHeader } from '@/components/detail/detail-header'
import { TabOverview } from '@/components/detail/tab-overview'
import { TabDocuments } from '@/components/detail/tab-documents'
import { TabTimeline } from '@/components/detail/tab-timeline'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { VisaRiskNotice } from '@/components/visa-risk-notice'
import { visaRisk } from '@/lib/eligibility'

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { getApplication, markActivitySeen } = useStore()
  const app = getApplication(id)
  // Highlights stay visible for this visit even after the tabs mark them seen.
  const [viewedAtOnArrival] = useState(() => app?.activityViewedAt)
  const [tab, setTab] = useState('overview')

  if (!app) {
    return (
      <div className="min-h-dvh bg-background">
        <AppHeader />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
          <h1 className="text-lg font-semibold">Application not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This application may belong to another counsellor, or the link is out of date.
          </p>
          <Button render={<Link href="/" />} nativeButton={false} className="mt-4">
            Back to dashboard
          </Button>
        </div>
      </div>
    )
  }

  const liveViewedAt = app.activityViewedAt
  const newDocs =
    app.documents.filter((d) => isNewDocument(d, liveViewedAt)).length +
    offerLetters(app).filter((l) => isNewOffer(l, liveViewedAt)).length
  const newEvents = app.events.filter((e) => isNewEvent(e, liveViewedAt)).length
  const docCount = app.documents.length + offerLetters(app).length

  const changeTab = (value: string) => {
    setTab(value)
    if (value !== 'overview' && newDocs + newEvents > 0) markActivitySeen(app.id)
  }

  return (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <DetailHeader app={app} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Tabs value={tab} onValueChange={(v) => changeTab(String(v))}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">
              Documents ({docCount})
              <NewCount count={newDocs} />
            </TabsTrigger>
            <TabsTrigger value="timeline">
              Activity
              <NewCount count={newEvents} />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <VisaRiskNotice risk={visaRisk(app)} className="mb-6" />
            <TabOverview app={app} viewedAt={viewedAtOnArrival} />
          </TabsContent>
          <TabsContent value="documents" className="mt-6">
            <TabDocuments app={app} viewedAt={viewedAtOnArrival} />
          </TabsContent>
          <TabsContent value="timeline" className="mt-6">
            <TabTimeline app={app} viewedAt={viewedAtOnArrival} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
