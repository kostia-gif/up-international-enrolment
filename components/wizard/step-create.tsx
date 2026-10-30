'use client'

import { FileText, X } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { formatDate } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { CoursePicker } from './course-picker'

export function StepCreate() {
  const { course, setCourse, clearCourse } = useWizard()

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Which course is the student applying for?</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            Pick the course and intake. Everything about the student comes from their documents
            in the next step.
          </p>
        </div>
        {course ? (
          <div className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/5 p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-pretty">{course.programmeName}</p>
              <p className="text-xs text-muted-foreground">
                {course.brand} · {course.campus} · intake {formatDate(course.intakeDate)} ·{' '}
                {course.priceBundle}
              </p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={clearCourse}>
              <X className="size-4" />
              <span className="sr-only">Remove course</span>
            </Button>
          </div>
        ) : (
          <CoursePicker onSelect={(p, intake) => setCourse(p, intake)} />
        )}
      </section>

      {course && (
        <section className="flex items-start gap-3 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          <FileText className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="text-pretty">
            Next, drop the passport, transcripts and English test. The passport fills the
            student&apos;s name and details and checks they aren&apos;t already with another agent.
          </p>
        </section>
      )}
    </div>
  )
}
