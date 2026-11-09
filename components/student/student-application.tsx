'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  BadgeCheck,
  CircleAlert,
  CircleCheck,
  Download,
  Expand,
  FileText,
  Hourglass,
  PartyPopper,
  Upload,
  UserRound,
} from 'lucide-react'
import type { Application } from '@/lib/types'
import { useStore } from '@/lib/store'
import { firstName } from '@/lib/student'
import { hasOffer, isUnconditional } from '@/lib/dashboard'
import { offerLetters } from '@/lib/documents'
import { formatDate, relativeTime } from '@/lib/format'
import { PageBand } from '@/components/page-band'
import { Button } from '@/components/ui/button'
import { LetterOfOfferDocument, LetterOfOfferPreviewDialog, type LooData } from '@/components/letter-of-offer'
import { checklistGroups, ChecklistGroup, Detail, intakeLabel } from '@/components/dashboard/application-preview'
import { AcceptOfferDialog } from './accept-offer-dialog'
import { cn } from '@/lib/utils'

// What a signed-in student sees: the same checklist and details the agent
// preview shows, with the Letter of Offer front and centre.
export function StudentApplicationView({ app }: { app: Application }) {
  const { studentUpload, acceptOffer } = useStore()
  const [letterOpen, setLetterOpen] = useState(false)
  const [acceptOpen, setAcceptOpen] = useState(false)

  const offered = hasOffer(app)
  const unconditional = isUnconditional(app)
  const accepted = Boolean(app.offerAcceptedAt) || app.stage === 'Payment & visa'
  const letter = offerLetters(app).at(-1)
  const { needed, withUp, done } = checklistGroups(app)
  const events = [...app.events].sort((a, b) => b.ts.localeCompare(a.ts))
  const agent = app.channel !== 'direct' ? app.issuingAgent : undefined

  const looData: LooData | null = letter
    ? {
        studentName: app.studentName,
        preId: app.preId,
        course: app.course,
        conditions: letter.conditions,
        hideCosts: !letter.includesPricing,
        agent: app.issuingAgent,
      }
    : null
  const letterTitle = unconditional ? 'Unconditional Letter of Offer' : 'Conditional Letter of Offer'

  function upload(id: string, title: string) {
    studentUpload(app.id, id, title)
    toast.success(`${title} uploaded`, { description: 'UP admissions will check it and update your application.' })
  }

  function accept() {
    acceptOffer(app.id)
    setAcceptOpen(false)
    toast.success('Offer accepted', { description: 'UP will email your fee invoice and visa documents.' })
  }

  return (
    <>
      <PageBand
        innerClassName="max-w-6xl"
        eyebrow="Your application"
        title={`Kia ora, ${firstName(app)}`}
        meta={
          <span>
            {app.course.programmeName} · Reference <span className="font-mono">{app.preId}</span>
          </span>
        }
      />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex min-w-0 flex-col gap-8">
          <StatusBanner
            app={app}
            offered={offered}
            unconditional={unconditional}
            accepted={accepted}
            onAccept={() => setAcceptOpen(true)}
          />

          {looData && letter && (
            <section aria-labelledby="loo-heading" className="flex flex-col gap-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <h2 id="loo-heading" className="text-lg font-semibold">
                    {letterTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Issued {formatDate(letter.issuedAt)} by {letter.issuedBy}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setLetterOpen(true)}>
                    <Expand className="size-3.5" aria-hidden /> View full size
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => toast.success(`${letterTitle} downloaded (PDF)`)}
                  >
                    <Download className="size-3.5" aria-hidden /> Download PDF
                  </Button>
                </div>
              </div>
              <div className="max-h-[30rem] overflow-y-auto border border-border bg-card shadow-sm">
                <LetterOfOfferDocument data={looData} />
              </div>
              <LetterOfOfferPreviewDialog data={looData} open={letterOpen} onOpenChange={setLetterOpen} />
            </section>
          )}

          {needed.length + withUp.length + done.length > 0 && !(unconditional && needed.length === 0) && (
            <section aria-labelledby="todo-heading" className="flex flex-col gap-4">
              <div className="flex flex-col gap-0.5">
                <h2 id="todo-heading" className="text-lg font-semibold">
                  {offered && !unconditional ? 'To get your unconditional offer' : 'Entry requirements'}
                </h2>
                {needed.length > 0 && (
                  <p className="text-sm text-muted-foreground text-pretty">
                    Upload these and UP admissions will check them. You&apos;ll get an email when
                    anything changes.
                  </p>
                )}
              </div>

              {needed.length > 0 && (
                <ChecklistGroup label="Needed from you" tone="action">
                  {needed.map((row) => (
                    <li key={row.id} className="flex items-center gap-3 px-4 py-3.5">
                      <CircleAlert className="size-5 shrink-0 text-action" aria-hidden />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-sm font-semibold text-pretty">{row.title}</span>
                        {row.detail && (
                          <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
                            {row.detail}
                          </span>
                        )}
                      </span>
                      <UploadButton label={row.title} onFile={() => upload(row.id, row.title)} />
                    </li>
                  ))}
                </ChecklistGroup>
              )}

              {withUp.length > 0 && (
                <ChecklistGroup label="With UP admissions">
                  {withUp.map((row) => (
                    <li key={row.id} className="flex items-center gap-3 px-4 py-3">
                      <Hourglass className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-sm font-medium text-pretty">{row.title}</span>
                        <span className="text-xs text-muted-foreground">Uploaded · UP admissions is checking it</span>
                      </span>
                    </li>
                  ))}
                </ChecklistGroup>
              )}

              {done.length > 0 && (
                <ChecklistGroup label="Done">
                  {done.map((row) => (
                    <li key={row.id} className="flex items-center gap-3 px-4 py-3">
                      <CircleCheck className="size-5 shrink-0 text-success" aria-hidden />
                      <span className="text-sm text-pretty">{row.title}</span>
                    </li>
                  ))}
                </ChecklistGroup>
              )}
            </section>
          )}
        </div>

        <aside aria-label="Application summary" className="flex flex-col gap-7 self-start border border-border bg-muted/50 p-6">
          <section aria-labelledby="details-heading" className="flex flex-col gap-3">
            <h2 id="details-heading" className="text-sm font-semibold">
              Application details
            </h2>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
              <Detail label="Reference" value={app.preId} mono />
              <Detail label="Intake" value={intakeLabel(app.course.intakeDate)} />
              <Detail label="Campus" value={app.course.delivery === 'online' ? 'Online' : app.course.campus} />
              <Detail label="Duration" value={`${app.course.durationMonths} months`} />
              <Detail label="Applied" value={relativeTime(app.createdAt)} />
            </dl>
          </section>

          {agent && (
            <section aria-labelledby="agent-heading" className="flex flex-col gap-2">
              <h2 id="agent-heading" className="text-sm font-semibold">
                Your education agent
              </h2>
              <p className="flex items-start gap-2 text-sm">
                <UserRound className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-muted-foreground">{agent.agency}</span>
                  <a href={`mailto:${agent.email}`} className="truncate text-primary underline underline-offset-4">
                    {agent.email}
                  </a>
                </span>
              </p>
            </section>
          )}

          <section aria-labelledby="docs-heading" className="flex flex-col gap-3">
            <h2 id="docs-heading" className="text-sm font-semibold">
              Your documents
            </h2>
            {app.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">None yet</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {app.documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-2 text-sm">
                    <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="truncate">{d.type === 'Supporting' ? d.originalName : d.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {events.length > 0 && (
            <section aria-labelledby="activity-heading" className="flex flex-col gap-3">
              <h2 id="activity-heading" className="text-sm font-semibold">
                Activity
              </h2>
              <ol className="flex flex-col">
                {events.slice(0, 5).map((e, i, list) => (
                  <li key={`${e.ts}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
                    {i < list.length - 1 && (
                      <span className="absolute top-3 bottom-0 left-[4.5px] w-px bg-input" aria-hidden />
                    )}
                    <span
                      className={cn(
                        'relative mt-1.5 size-2.5 shrink-0 rounded-full',
                        i === 0 ? 'bg-primary' : 'border border-muted-foreground bg-muted',
                      )}
                      aria-hidden
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm text-pretty">{e.label}</span>
                      <span className="text-xs text-muted-foreground">{relativeTime(e.ts)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </aside>
      </main>

      {unconditional && !accepted && (
        <AcceptOfferDialog app={app} open={acceptOpen} onOpenChange={setAcceptOpen} onAccept={accept} />
      )}
    </>
  )
}

function StatusBanner({
  app,
  offered,
  unconditional,
  accepted,
  onAccept,
}: {
  app: Application
  offered: boolean
  unconditional: boolean
  accepted: boolean
  onAccept: () => void
}) {
  if (accepted) {
    return (
      <section aria-label="Status" className="flex items-start gap-3 border border-success/30 bg-success/5 px-5 py-4">
        <PartyPopper className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold">
            You accepted your offer{app.offerAcceptedAt ? ` on ${formatDate(app.offerAcceptedAt)}` : ''}
          </p>
          <p className="text-sm text-muted-foreground text-pretty">
            Next, pay your tuition fees and apply for your student visa. UP has emailed your invoice
            and the documents Immigration New Zealand needs.
          </p>
        </div>
      </section>
    )
  }
  if (unconditional) {
    return (
      <section
        aria-label="Status"
        className="flex flex-col gap-4 border border-primary/30 bg-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div className="flex flex-col gap-0.5">
            <p className="font-semibold text-secondary-foreground">Your unconditional offer is ready</p>
            <p className="text-sm text-muted-foreground text-pretty">
              Read your Letter of Offer below, then accept it online to confirm your place.
            </p>
          </div>
        </div>
        <Button size="lg" className="shrink-0" onClick={onAccept}>
          Accept offer
        </Button>
      </section>
    )
  }
  if (offered) {
    return (
      <section aria-label="Status" className="flex items-start gap-3 border border-primary/30 bg-secondary px-5 py-4">
        <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-secondary-foreground">You have a conditional offer</p>
          <p className="text-sm text-muted-foreground text-pretty">
            Your place is offered on the conditions in the letter. Once UP has the items below, you
            get your unconditional offer to accept.
          </p>
        </div>
      </section>
    )
  }
  return (
    <section aria-label="Status" className="flex items-start gap-3 border border-border bg-muted/50 px-5 py-4">
      <Hourglass className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-medium text-muted-foreground">
          {app.stage === 'Draft' ? 'Not submitted yet' : 'With UP admissions'}
        </p>
        <p className="text-sm font-semibold text-pretty">
          {app.stage === 'Draft'
            ? 'Your application is still being prepared'
            : 'UP admissions is reviewing your application'}
        </p>
      </div>
    </section>
  )
}

function UploadButton({ label, onFile }: { label: string; onFile: (name: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file.name)
          e.target.value = ''
        }}
      />
      <Button size="sm" className="shrink-0 gap-1.5" onClick={() => inputRef.current?.click()} aria-label={`Upload ${label}`}>
        <Upload className="size-3.5" aria-hidden />
        Upload
      </Button>
    </>
  )
}
