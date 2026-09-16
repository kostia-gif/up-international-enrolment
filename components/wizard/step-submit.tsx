'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Users, Loader, CircleCheck, ArrowRight } from 'lucide-react'
import { useWizard, ADMISSIONS_REVIEW_CONDITION } from '@/lib/wizard'
import { useStore } from '@/lib/store'
import { computeRoute, routeReasons } from '@/lib/readiness'
import { formatDate } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { LetterOfOfferPanel } from '@/components/letter-of-offer'
import { TrackingTimer } from './tracking-timer'
import type { Application } from '@/lib/types'

type Phase = 'summary' | 'generating' | 'done-auto' | 'done-review'

export function StepSubmit() {
  const wizard = useWizard()
  const { addApplication, activeUserId } = useStore()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('summary')
  const [created, setCreated] = useState<Application | null>(null)

  const draftForRoute = {
    requests: wizard.requests,
    notesToAdmissions: wizard.notes,
  } as Application
  const route = computeRoute(draftForRoute)
  const reasons = routeReasons(draftForRoute)
  const course = wizard.courses[0]

  // Conditions that will appear on the LOO (mirror buildApplication logic).
  const looConditions = [
    ADMISSIONS_REVIEW_CONDITION,
    ...wizard.requirements
      .filter((r) => r.status === 'expiring' || (r.category === 'english' && r.status === 'missing'))
      .map((r) => r.label),
  ]
  if (wizard.requests.some((r) => r.type === 'insurance' && /own cover/i.test(r.detail))) {
    looConditions.push('Own-cover insurance policy valid for full stay')
  }

  const discountReq = wizard.requests.find((r) => r.type === 'discount')
  const insuranceReq = wizard.requests.find((r) => r.type === 'insurance')

  function submit() {
    const app = wizard.buildApplication(activeUserId, 'psl')
    if (route === 'auto') {
      setPhase('generating')
      setTimeout(() => {
        const withStage: Application = {
          ...app,
          stage: 'Conditional offer',
          events: [
            {
              ts: new Date().toISOString(),
              actor: 'agent',
              label: 'Application submitted',
            },
            {
              ts: new Date().toISOString(),
              actor: 'up',
              label: 'Conditional offer issued',
            },
          ],
        }
        addApplication(withStage)
        setCreated(withStage)
        setPhase('done-auto')
      }, 2000)
    } else {
      const withStage: Application = {
        ...app,
        stage: 'Submitted',
        route: 'review',
        events: [
          {
            ts: new Date().toISOString(),
            actor: 'agent',
            label: 'Application submitted to admissions review',
            detail: reasons.join(', '),
          },
        ],
      }
      addApplication(withStage)
      setCreated(withStage)
      setPhase('done-review')
    }
  }

  if (phase === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-16 text-center">
        <Loader className="size-6 animate-spin text-ai" />
        <p className="text-sm font-medium">Generating conditional Letter of Offer…</p>
      </div>
    )
  }

  if (phase === 'done-auto' && created) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/5 p-4">
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" />
          <div>
            <p className="font-medium">Thank you — your application is submitted</p>
            <p className="text-sm text-muted-foreground text-pretty">
              {looConditions.length > 0
                ? 'A conditional Letter of Offer has been issued for '
                : 'A Letter of Offer has been issued for '}
              {created.studentName} · {course?.programmeName}.
            </p>
          </div>
        </div>

        <TrackingTimer label="Tracking · time since submission" />

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium">
            {looConditions.length > 0 ? 'Conditional Letter of Offer' : 'Letter of Offer'}
          </p>
          <p className="text-xs text-muted-foreground text-pretty">
            Download it or share a secure link with the student.
          </p>
        </div>
        <LetterOfOfferPanel
          data={{
            studentName: created.studentName,
            preId: created.preId,
            course,
            conditions: looConditions,
            bundle: created.bundle,
          }}
        />

        <div className="flex gap-2">
          <Button
            render={<Link href={`/applications/${created.id}`} />}
            nativeButton={false}
            className="gap-1.5"
          >
            Open application <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
            Back to dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'done-review' && created) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2 rounded-md border border-info/30 bg-info/5 p-4">
          <Users className="mt-0.5 size-5 shrink-0 text-info" />
          <div>
            <p className="font-medium">Thank you — sent to admissions review</p>
            <p className="text-sm text-muted-foreground text-pretty">
              Goes to review because: {reasons.join(', ')}. You&apos;ll see the outcome on the
              application and in the pipeline.
            </p>
          </div>
        </div>

        <TrackingTimer label="Tracking · time since submission" />

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium">Draft Letter of Offer</p>
          <p className="text-xs text-muted-foreground text-pretty">
            Preview, download or share the draft now — admissions confirms it before it is issued.
          </p>
        </div>
        <LetterOfOfferPanel
          data={{
            studentName: created.studentName,
            preId: created.preId,
            course,
            conditions: looConditions,
            bundle: created.bundle,
          }}
        />

        <div className="flex gap-2">
          <Button
            render={<Link href={`/applications/${created.id}`} />}
            nativeButton={false}
            className="gap-1.5"
          >
            Open application <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
            Back to dashboard
          </Button>
        </div>
      </div>
    )
  }

  // summary
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium">Summary</p>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Student</dt>
            <dd>{`${wizard.student.given} ${wizard.student.family}`.trim() || '—'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Programme</dt>
            <dd className="text-pretty">{course?.programmeName ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Campus</dt>
            <dd className="text-pretty">{course?.campus ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Intake</dt>
            <dd>{course ? formatDate(course.intakeDate) : '—'}</dd>
          </div>
        </dl>

        <div className="mt-3 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">Pricing</p>
          <dl className="mt-1.5 flex flex-col gap-1.5 text-sm">
            {wizard.courses.map((c, i) => (
              <div key={`${c.programmeName}-${i}`} className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground text-pretty">
                  {c.programmeName}
                  <span className="ml-1 text-xs">· {c.durationMonths} months</span>
                </dt>
                <dd className="shrink-0 font-medium tabular-nums">{c.priceBundle}</dd>
              </div>
            ))}
            {discountReq && (
              <div className="flex items-start justify-between gap-3 text-primary">
                <dt>Discount requested</dt>
                <dd className="shrink-0 text-pretty text-right">{discountReq.detail}</dd>
              </div>
            )}
            <div className="flex items-start justify-between gap-3 border-t border-border pt-1.5">
              <dt className="text-muted-foreground">Insurance</dt>
              <dd className="shrink-0 text-pretty text-right">
                {insuranceReq?.detail ?? 'UP-arranged (default)'}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-muted-foreground text-pretty">
            Fees are indicative and confirmed on the Letter of Offer. Any requested discount is
            applied by admissions before the unconditional offer.
          </p>
        </div>

        <div className="mt-3 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">
            Conditions on the offer{looConditions.length > 0 ? ` (${looConditions.length})` : ''}
          </p>
          {looConditions.length > 0 ? (
            <ul className="mt-1 ml-4 list-disc text-sm">
              {looConditions.map((c) => (
                <li key={c} className="text-pretty">
                  {c}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-success">
              No outstanding conditions — an unconditional offer can be issued.
            </p>
          )}
        </div>
        {wizard.requests.length > 0 && (
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">Requests</p>
            <ul className="mt-1 flex flex-col gap-1 text-sm">
              {wizard.requests.map((r) => (
                <li key={r.type} className="text-pretty">
                  {r.detail}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium">Draft Letter of Offer</p>
        <p className="text-xs text-muted-foreground text-pretty">
          This is how the offer will read. Preview the full document now — it&apos;s issued when you
          submit.
        </p>
      </div>
      <LetterOfOfferPanel
        data={{
          studentName: `${wizard.student.given} ${wizard.student.family}`.trim() || 'the applicant',
          preId: 'DRAFT',
          course,
          conditions: looConditions,
          bundle: wizard.courses,
        }}
      />

      <div
        className={
          route === 'auto'
            ? 'flex items-start gap-2 rounded-md border border-ai/30 bg-ai/5 p-4'
            : 'flex items-start gap-2 rounded-md border border-info/30 bg-info/5 p-4'
        }
      >
        {route === 'auto' ? (
          <Sparkles className="mt-0.5 size-4 shrink-0 text-ai" />
        ) : (
          <Users className="mt-0.5 size-4 shrink-0 text-info" />
        )}
        <p className="text-sm text-pretty">
          {route === 'auto'
            ? 'Conditional offer will be issued now.'
            : `Goes to admissions review because: ${reasons.join(', ')}.`}
        </p>
      </div>

      <Button
        size="lg"
        className="w-fit"
        disabled={route === 'auto' && !wizard.readiness.looReady}
        onClick={submit}
      >
        {route === 'auto' ? 'Submit and create a conditional offer' : 'Submit for review'}
      </Button>
      {route === 'auto' && !wizard.readiness.looReady && (
        <p className="text-xs text-muted-foreground">
          The auto offer needs all required fields complete. Finish Step 4, or attach a request to
          route this to admissions review instead.
        </p>
      )}
      {route === 'review' && !wizard.readiness.looReady && (
        <p className="text-xs text-muted-foreground">
          {wizard.readiness.fieldsTotal - wizard.readiness.fieldsDone} required field(s) are still
          incomplete — admissions will finish these during review.
        </p>
      )}
    </div>
  )
}
