'use client'

import { useState } from 'react'
import { X, Layers } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { formatDate } from '@/lib/format'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CoursePicker } from './course-picker'
import { CATALOG } from '@/lib/catalog'

export function StepCreate() {
  const { student, setStudent, courses, addCourse, removeCourse, hasBundle } = useWizard()
  const [showBundle, setShowBundle] = useState(false)

  // Map selected courses back to catalog ids so the second picker can exclude them.
  const selectedIds = courses
    .map((c) => CATALOG.find((p) => p.programmeName === c.programmeName)?.id)
    .filter((x): x is string => !!x)

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-base font-semibold">Student</h2>
        <p className="mb-4 text-sm text-muted-foreground text-pretty">
          Just the name to get started. Date of birth, nationality, passport number and other
          identity details are read straight from the passport when you drop documents in the next
          step.
        </p>
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
          <div className="grid gap-1.5">
            <Label htmlFor="agentRef">Agent reference (optional)</Label>
            <Input
              id="agentRef"
              value={student.agentRef}
              onChange={(e) => setStudent({ agentRef: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold">Course</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Search or browse by brand and level. The NZQA programme name and next intakes are shown.
        </p>

        {courses.length > 0 && (
          <ul className="mb-4 flex flex-col gap-2">
            {courses.map((c, i) => (
              <li
                key={`${c.programmeName}-${i}`}
                className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/5 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-pretty">{c.programmeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.brand} · {c.campus} · intake {formatDate(c.intakeDate)} · {c.priceBundle}
                  </p>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => removeCourse(i)}>
                  <X className="size-4" />
                  <span className="sr-only">Remove course</span>
                </Button>
              </li>
            ))}
          </ul>
        )}

        {courses.length === 0 && (
          <CoursePicker onSelect={(p, intake) => addCourse(p, intake)} />
        )}

        {courses.length >= 1 && !hasBundle && (
          <>
            {!showBundle ? (
              <button
                onClick={() => setShowBundle(true)}
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Layers className="size-4" /> Add a second course (bundle)
              </button>
            ) : (
              <div className="mt-2">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">Second course (bundle)</p>
                  <Button variant="ghost" size="sm" onClick={() => setShowBundle(false)}>
                    Cancel
                  </Button>
                </div>
                <CoursePicker
                  excludeIds={selectedIds}
                  onSelect={(p, intake) => {
                    addCourse(p, intake)
                    setShowBundle(false)
                  }}
                />
              </div>
            )}
          </>
        )}

        {hasBundle && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Layers className="size-3.5" /> Bundle selected — the checklist now covers both courses.
          </p>
        )}
      </section>
    </div>
  )
}
