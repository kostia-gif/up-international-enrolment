'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Percent, Clock, Sparkles, ShieldCheck, Users } from 'lucide-react'
import type { Application, Request, RequestType } from '@/lib/types'
import { useStore } from '@/lib/store'
import { routeReasons } from '@/lib/readiness'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const typeMeta: Record<RequestType, { label: string; icon: typeof Percent }> = {
  discount: { label: 'Discount or scholarship', icon: Percent },
  'ready-to-commit': { label: 'Ready to commit', icon: Clock },
  'special-admission': { label: 'Special admission', icon: Sparkles },
  insurance: { label: 'Insurance', icon: ShieldCheck },
}

const statusTone: Record<Request['status'], string> = {
  pending: 'bg-warning/12 text-warning border-warning/25',
  approved: 'bg-success/12 text-success border-success/25',
  declined: 'bg-destructive/12 text-destructive border-destructive/25',
}

export function TabRequests({ app }: { app: Application }) {
  const { setNotes, recomputeRoute, addEvent } = useStore()
  const [draftNotes, setDraftNotes] = useState(app.notesToAdmissions ?? '')

  const reasons = routeReasons(app)

  function saveNotes() {
    setNotes(app.id, draftNotes)
    recomputeRoute(app.id)
    addEvent(app.id, {
      ts: new Date().toISOString(),
      actor: 'agent',
      label: 'Note to admissions updated',
    })
    toast.success('Notes saved')
  }

  return (
    <div className="flex flex-col gap-6">
      <section
        className={cn(
          'flex items-start gap-2 rounded-lg border p-4',
          app.route === 'auto'
            ? 'border-ai/25 bg-ai/5'
            : 'border-info/25 bg-info/5',
        )}
      >
        {app.route === 'auto' ? (
          <Sparkles className="mt-0.5 size-4 shrink-0 text-ai" />
        ) : (
          <Users className="mt-0.5 size-4 shrink-0 text-info" />
        )}
        <p className="text-sm text-pretty">
          {app.route === 'auto'
            ? 'This application follows the automatic pathway — a conditional offer can be issued without human review.'
            : `Routed to admissions review because: ${reasons.join(', ') || 'a request was attached'}.`}
        </p>
      </section>

      {app.requests.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No requests attached.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {app.requests.map((r) => {
            const meta = typeMeta[r.type]
            const Icon = meta.icon
            return (
              <li key={r.type} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <Icon className="size-4 text-muted-foreground" />
                    {meta.label}
                  </span>
                  <span
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
                      statusTone[r.status],
                    )}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground text-pretty">{r.detail}</p>
                {r.caseFile && (
                  <dl className="mt-2 grid gap-1.5 rounded-md bg-muted/50 p-3 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Experience</dt>
                      <dd>{r.caseFile.experienceYears} years · {r.caseFile.roleLevel}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">References</dt>
                      <dd>{r.caseFile.references.join(', ')}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground">Summary</dt>
                      <dd className="text-pretty">{r.caseFile.summary}</dd>
                    </div>
                  </dl>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <section className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium">Notes to admissions</h3>
        <p className="mb-2 text-xs text-muted-foreground">
          Anything here routes the application to admissions review.
        </p>
        <Textarea
          value={draftNotes}
          onChange={(e) => setDraftNotes(e.target.value)}
          placeholder="Optional free-text notes"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            disabled={draftNotes === (app.notesToAdmissions ?? '')}
            onClick={saveNotes}
          >
            Save notes
          </Button>
        </div>
      </section>
    </div>
  )
}
