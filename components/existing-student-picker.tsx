'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, FileText, Search, UserRound } from 'lucide-react'
import { useStore } from '@/lib/store'
import { groupExistingStudents } from '@/lib/existing-students'
import { STAGE_TONE } from '@/lib/dashboard'
import { toneBadge } from '@/lib/status'
import { formatDate } from '@/lib/format'
import { PageBand } from '@/components/page-band'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ExistingStudentPicker() {
  const { visibleApplications } = useStore()
  const [query, setQuery] = useState('')

  const students = useMemo(() => groupExistingStudents(visibleApplications), [visibleApplications])

  const filtered = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (terms.length === 0) return students
    return students.filter((s) =>
      terms.every((t) =>
        [s.name, s.nationality, s.passportNumber ?? '', ...s.applications.map((a) => a.course.programmeName)]
          .join(' ')
          .toLowerCase()
          .includes(t),
      ),
    )
  }, [students, query])

  return (
    <>
      <PageBand
        innerClassName="max-w-5xl"
        eyebrow={
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
            <Link href="/" className="font-semibold text-primary-foreground hover:underline">
              Applications
            </Link>
            <span aria-hidden>/</span>
            <span>Add application for existing student</span>
          </nav>
        }
        title="Add application for existing student"
        meta="Pick a student your agency has already applied for. Their details, answers and documents are copied into the new application; change anything that needs it for the new course."
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-8 md:px-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, nationality or passport"
            className="pl-9"
            autoComplete="off"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            {students.length === 0
              ? 'No students on file yet. Start a new application the usual way instead.'
              : 'No students match that search.'}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((s) => {
              const latest = s.applications[0]
              return (
                <li
                  key={s.key}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                      <UserRound className="size-4.5" aria-hidden />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-semibold">
                        {s.name}
                        {s.nationality && (
                          <span className="font-normal text-muted-foreground">· {s.nationality}</span>
                        )}
                      </p>
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        {s.passportNumber && <span className="font-mono">{s.passportNumber}</span>}
                        <span className="inline-flex items-center gap-1">
                          <FileText className="size-3" aria-hidden />
                          {s.applications.length} application{s.applications.length === 1 ? '' : 's'} on
                          file
                        </span>
                      </p>
                      <ul className="flex flex-col gap-0.5">
                        {s.applications.slice(0, 2).map((a) => (
                          <li key={a.id} className="flex flex-wrap items-center gap-1.5 text-xs text-pretty">
                            <span
                              className={cn(
                                'rounded-full border px-1.5 py-px font-medium',
                                toneBadge[STAGE_TONE[a.stage]],
                              )}
                            >
                              {a.stage}
                            </span>
                            <span className="truncate text-muted-foreground">
                              {a.course.programmeName} · intake {formatDate(a.course.intakeDate)}
                            </span>
                          </li>
                        ))}
                        {s.applications.length > 2 && (
                          <li className="text-xs text-muted-foreground">
                            +{s.applications.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <Button
                    render={<Link href={`/new?existing=${latest.id}`} />}
                    nativeButton={false}
                    className="shrink-0 gap-1.5 self-start sm:self-center"
                  >
                    Start new application
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
