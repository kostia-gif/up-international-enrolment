'use client'

import { useMemo, useState } from 'react'
import { Zap, Clock, ShieldCheck, Mail } from 'lucide-react'
import { AdmissionsHeader } from '@/components/admissions/admissions-header'
import { ReviewQueue } from '@/components/admissions/review-queue'
import { AdmissionsComms } from '@/components/admissions/admissions-comms'
import { useStore } from '@/lib/store'
import { admissionsQueue, admissionsBucket, emailedDocsSummary } from '@/lib/admissions'
import { cn } from '@/lib/utils'
import { ProcessPipeline } from '@/components/admissions/process-pipeline'

// CRM application opportunities received from Enroller, not yet allocated.
const CRM_UNASSIGNED = 6

export default function AdmissionsDashboardPage() {
  const { applications } = useStore()
  const [commsOpen, setCommsOpen] = useState(false)
  const [commsFocusId, setCommsFocusId] = useState<string | null>(null)

  function openComms(id: string | null) {
    setCommsFocusId(id)
    setCommsOpen(true)
  }

  const stats = useMemo(() => {
    const queue = admissionsQueue(applications)
    const awaiting = queue.filter((a) => admissionsBucket(a) === 'awaiting')
    return {
      awaiting: awaiting.length,
      fastTrack: awaiting.filter((a) => a.fastTrack).length,
      conditional: queue.filter((a) => admissionsBucket(a) === 'conditional').length,
      docsEmailed: emailedDocsSummary(applications).totalDocs,
    }
  }, [applications])

  return (
    <div className="min-h-screen">
      <AdmissionsHeader />
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Review queue</h1>
            <p className="mt-1 max-w-2xl text-pretty text-sm text-muted-foreground">
              My unprocessed application opportunities, received through Enroller and allocated in
              CRM. Run the three initial checks, complete the assessment in CRM, then issue the
              offer, take payment and push the enrolment to Yoobee.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Stat
              icon={Mail}
              label="Docs emailed"
              value={stats.docsEmailed}
              tone="text-info"
              onClick={() => openComms(null)}
            />
            <Stat icon={Clock} label="Awaiting" value={stats.awaiting} tone="text-info" />
            <Stat icon={Zap} label="Fast track" value={stats.fastTrack} tone="text-destructive" />
            <Stat
              icon={ShieldCheck}
              label="Conditional"
              value={stats.conditional}
              tone="text-ai"
            />
          </div>
        </div>

        <div className="mt-5">
          <ProcessPipeline applications={applications} unassigned={CRM_UNASSIGNED} />
        </div>

        <div className="mt-6">
          <ReviewQueue applications={applications} onOpenComms={openComms} />
        </div>
      </main>

      <AdmissionsComms
        applications={applications}
        open={commsOpen}
        onOpenChange={setCommsOpen}
        focusId={commsFocusId}
        onFocus={setCommsFocusId}
      />
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
  onClick,
}: {
  icon: typeof Clock
  label: string
  value: number
  tone: string
  onClick?: () => void
}) {
  const content = (
    <>
      <Icon className={`size-4 ${tone}`} />
      <div className="leading-tight text-left">
        <p className="text-base font-semibold tabular-nums">{value}</p>
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
    </>
  )
  const base = 'flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm'
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          base,
          'transition-colors hover:border-info/50 hover:bg-info/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        {content}
      </button>
    )
  }
  return <div className={base}>{content}</div>
}
