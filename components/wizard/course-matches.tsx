'use client'

import { useMemo } from 'react'
import { toast } from 'sonner'
import { ArrowRight, GraduationCap, Languages, Sparkles } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { LEVEL_HEADING, matchCourses, type CourseMatch } from '@/lib/student'
import type { CourseLevel } from '@/lib/types'
import { formatDate } from '@/lib/format'
import { Button } from '@/components/ui/button'

const LEVEL_ORDER: CourseLevel[] = ['Postgraduate', 'Degree', 'Vocational', 'Pathway']
const PER_LEVEL = 3

// Courses a student can apply for, from the documents read so far.
export function CourseMatches() {
  const { fields, englishResult, setPrimary, setEntryMode } = useWizard()
  const matches = useMemo(() => matchCourses(fields, englishResult), [fields, englishResult])
  const read = (key: string) => fields.find((f) => f.key === key)?.value.trim() ?? ''
  const qualification = read('highest_qual')
  const grade = read('grade_gpa')

  function choose(m: CourseMatch) {
    setPrimary(m.programme, m.intake)
    setEntryMode('course')
    toast.success(`${m.programme.programmeName} selected`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!qualification) {
    return (
      <section
        aria-label="Courses you can apply for"
        className="flex flex-col items-center gap-3 border border-dashed border-border bg-card p-8 text-center"
      >
        <span className="grid size-11 place-items-center rounded-full bg-ai/10 text-ai">
          <Sparkles className="size-5" aria-hidden />
        </span>
        <p className="text-sm font-semibold">Courses you can apply for</p>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
          Your matches appear here as soon as we&apos;ve read your transcript.
        </p>
      </section>
    )
  }

  const byLevel = LEVEL_ORDER.map((level) => ({
    level,
    items: matches.filter((m) => m.programme.levelGroup === level).slice(0, PER_LEVEL),
  })).filter((g) => g.items.length > 0)

  return (
    <section aria-labelledby="matches-heading" className="flex flex-col border border-border bg-card">
      <div className="flex flex-col gap-1 border-b border-border px-4 py-3">
        <h3 id="matches-heading" className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-ai" aria-hidden />
          {matches.length} course{matches.length === 1 ? '' : 's'} you can apply for
        </h3>
        <p className="text-xs text-muted-foreground text-pretty">
          Based on your {qualification}
          {grade ? ` (${grade})` : ''}. Choose one to continue your application.
        </p>
      </div>

      {byLevel.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground text-pretty">
          We couldn&apos;t match a course from these documents. Upload the rest, or contact UP
          admissions for advice.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {byLevel.map(({ level, items }) => (
            <div key={level} className="flex flex-col">
              <p className="bg-muted/50 px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {LEVEL_HEADING[level]}
              </p>
              <ul className="flex flex-col divide-y divide-border">
                {items.map((m) => (
                  <li key={m.programme.id} className="flex items-center gap-3 px-4 py-3">
                    <GraduationCap className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="text-sm font-medium text-pretty">{m.programme.programmeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.programme.brand} · {m.programme.campus} · starts {formatDate(m.intake)}
                      </p>
                      {m.englishShort && (
                        <p className="flex items-center gap-1 text-xs font-medium text-warning">
                          <Languages className="size-3" aria-hidden />
                          English study needed first
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 gap-1"
                      onClick={() => choose(m)}
                      aria-label={`Apply for ${m.programme.programmeName}`}
                    >
                      Apply <ArrowRight className="size-3.5" aria-hidden />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
