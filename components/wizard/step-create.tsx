'use client'

import Link from 'next/link'
import { FileText, Lock, UserCheck, Zap } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
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
              Their passport, transcripts and other documents on file are carried over and locked
              on this application. Choose the new course below; you can update contact details and
              add anything new as you go.
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
              ? 'Name and passport are carried over from their earlier application and can’t be changed here.'
              : 'Name the application so you can find it later. The passport confirms the spelling in the next step; your own CRM reference is optional.'}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="given-name" className="flex items-center gap-1.5">
              Given name
              {existingApplication && <Lock className="size-3 text-muted-foreground" aria-hidden />}
            </Label>
            <Input
              id="given-name"
              autoComplete="off"
              value={student.given}
              onChange={(e) => setStudent({ given: e.target.value })}
              placeholder="As in the passport"
              disabled={!!existingApplication}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="family-name" className="flex items-center gap-1.5">
              Family name
              {existingApplication && <Lock className="size-3 text-muted-foreground" aria-hidden />}
            </Label>
            <Input
              id="family-name"
              autoComplete="off"
              value={student.family}
              onChange={(e) => setStudent({ family: e.target.value })}
              placeholder="As in the passport"
              disabled={!!existingApplication}
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
        <label
          className={cn(
            'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors',
            fastTrack ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40',
          )}
        >
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
      </section>

      {planComplete && (
        <section className="flex items-start gap-3 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          <FileText className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="text-pretty">
            {existingApplication
              ? 'Next, their documents already on file are checked against this course automatically. Add anything new it still needs.'
              : 'Next, drop the passport, transcripts and English test. Each file is read, translated if needed and checked against the document requirements for this course.'}
          </p>
        </section>
      )}
    </div>
  )
}
