'use client'

import Link from 'next/link'
import { FileText, UserCheck, Zap } from 'lucide-react'
import { FAST_TRACK_REASONS, useWizard } from '@/lib/wizard'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StudyPlanSection } from './study-plan-section'
import { StudentStart } from './student-start'

export function StepCreate({
  onProcessingChange,
}: {
  onProcessingChange?: (processing: boolean) => void
}) {
  const {
    planComplete,
    student,
    setStudent,
    agentRef,
    setAgentRef,
    fastTrack,
    setFastTrack,
    fastTrackReason,
    setFastTrackReason,
    fastTrackDetail,
    setFastTrackDetail,
    isStudent,
    existingApplication,
  } = useWizard()

  if (isStudent) return <StudentStart onProcessingChange={onProcessingChange} />

  return (
    <div className="flex flex-col gap-8">
      {existingApplication && (
        <section className="flex items-start gap-3 rounded-lg border border-info/30 bg-info/5 p-4">
          <UserCheck className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">
              Existing student — {existingApplication.studentName}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              Their details, documents and answers from the earlier application are copied in
              below. Choose the new course and change anything that needs it.
            </p>
            <Link
              href={`/applications/${existingApplication.id}`}
              className="w-fit text-sm font-medium text-primary hover:underline"
            >
              View their earlier application ({existingApplication.preId})
            </Link>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Who is applying?</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            {existingApplication
              ? 'Copied from their earlier application. Change anything that needs it.'
              : 'Name the application so you can find it later. The passport confirms the spelling in the next step; your own CRM reference is optional.'}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="given-name">Given name</Label>
            <Input
              id="given-name"
              autoComplete="off"
              value={student.given}
              onChange={(e) => setStudent({ given: e.target.value })}
              placeholder="As in the passport"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="family-name">Family name</Label>
            <Input
              id="family-name"
              autoComplete="off"
              value={student.family}
              onChange={(e) => setStudent({ family: e.target.value })}
              placeholder="As in the passport"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agent-ref">
              Agent ID <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="agent-ref"
              autoComplete="off"
              value={agentRef}
              onChange={(e) => setAgentRef(e.target.value)}
              placeholder="Your CRM reference"
              className="font-mono"
            />
          </div>
        </div>
      </section>

      <StudyPlanSection />

      <section aria-labelledby="priority-heading" className="flex flex-col gap-3">
        <h2 id="priority-heading" className="text-base font-semibold">
          Priority
        </h2>
        <div
          className={cn(
            'flex flex-col gap-3 rounded-lg border p-4 transition-colors',
            fastTrack ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40',
          )}
        >
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={fastTrack}
              onChange={(e) => setFastTrack(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Zap className="size-3.5 text-primary" aria-hidden />
                Fast track this application
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground text-pretty">
                Use when the student is ready to commit. UP admissions prioritises it in their queue.
              </span>
            </span>
          </label>

          {fastTrack && (
            <div className="flex flex-col gap-2 border-t border-primary/20 pt-3 pl-7">
              <p className="text-xs font-medium text-muted-foreground">
                Why does this need fast tracking? <span className="text-destructive">*</span>
              </p>
              <div role="radiogroup" aria-label="Fast track reason" className="flex flex-wrap gap-2">
                {FAST_TRACK_REASONS.map((r) => {
                  const active = fastTrackReason === r.key
                  return (
                    <button
                      key={r.key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setFastTrackReason(r.key)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                        active
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                      )}
                    >
                      {r.label}
                    </button>
                  )
                })}
              </div>
              {fastTrackReason === 'other' && (
                <Input
                  autoFocus
                  value={fastTrackDetail}
                  onChange={(e) => setFastTrackDetail(e.target.value)}
                  placeholder="Tell UP admissions why"
                  aria-label="Fast track reason details"
                  className="max-w-sm"
                />
              )}
            </div>
          )}
        </div>
      </section>

      {planComplete && (
        <section className="flex items-start gap-3 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          <FileText className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="text-pretty">
            {existingApplication
              ? 'Next, their documents from the earlier application are already there and get checked against this course automatically. Add or replace anything it still needs.'
              : 'Next, drop the passport, transcripts and English test. Each file is read, translated if needed and checked against the document requirements for this course.'}
          </p>
        </section>
      )}
    </div>
  )
}
