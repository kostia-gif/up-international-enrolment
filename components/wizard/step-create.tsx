'use client'

import { X } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { formatDate } from '@/lib/format'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CoursePicker } from './course-picker'

export function StepCreate() {
  const { student, setStudent, course, setCourse, clearCourse } = useWizard()

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-4 text-base font-semibold">Student</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="given">Given name</Label>
            <Input
              id="given"
              value={student.given}
              onChange={(e) => setStudent({ given: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="family">Family name</Label>
            <Input
              id="family"
              value={student.family}
              onChange={(e) => setStudent({ family: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold">Course</h2>
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
    </div>
  )
}
