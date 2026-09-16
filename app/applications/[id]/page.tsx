'use client'

import { use } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { AppHeader } from '@/components/app-header'
import { DetailHeader } from '@/components/detail/detail-header'
import { TabOverview } from '@/components/detail/tab-overview'
import { TabDocuments } from '@/components/detail/tab-documents'
import { TabFields } from '@/components/detail/tab-fields'
import { TabConditions } from '@/components/detail/tab-conditions'
import { TabRequests } from '@/components/detail/tab-requests'
import { TabTimeline } from '@/components/detail/tab-timeline'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { getApplication } = useStore()
  const app = getApplication(id)

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

  const openConditions = app.conditions.filter((c) => c.status !== 'cleared').length

  return (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <DetailHeader app={app} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Tabs defaultValue="overview">
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents ({app.documents.length})</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="conditions">
              Conditions{openConditions > 0 ? ` (${openConditions})` : ''}
            </TabsTrigger>
            <TabsTrigger value="requests">Requests ({app.requests.length})</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <TabOverview app={app} />
          </TabsContent>
          <TabsContent value="documents" className="mt-6">
            <TabDocuments app={app} />
          </TabsContent>
          <TabsContent value="fields" className="mt-6">
            <TabFields app={app} />
          </TabsContent>
          <TabsContent value="conditions" className="mt-6">
            <TabConditions app={app} />
          </TabsContent>
          <TabsContent value="requests" className="mt-6">
            <TabRequests app={app} />
          </TabsContent>
          <TabsContent value="timeline" className="mt-6">
            <TabTimeline app={app} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
