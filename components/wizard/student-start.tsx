'use client'

import { BookOpen, FileText, Link2, ScanSearch } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import type { EntryMode } from '@/lib/student'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StudyPlanSection } from './study-plan-section'
import { StepDocuments } from './step-documents'
import { CourseMatches } from './course-matches'

const ENTRY_OPTIONS: { mode: EntryMode; title: string; detail: string; icon: typeof BookOpen }[] = [
  {
    mode: 'course',
    title: 'I know which course I want',
    detail: 'Search our programmes and choose a start date.',
    icon: BookOpen,
  },
  {
    mode: 'discover',
    title: 'Show me what I can apply for',
    detail: 'Upload your passport, transcripts and English test. We read them and list the courses you meet the entry for.',
    icon: ScanSearch,
  },
]

// Step 1 for a student applying direct. Same wizard as agents use; the start
// differs only in how the course is found.
export function StudentStart({
  onProcessingChange,
}: {
  onProcessingChange?: (processing: boolean) => void
}) {
  const { student, setStudent, entryMode, setEntryMode, course, planComplete, documents, fields } =
    useWizard()
  // Once the passport is read, show the name from it until the student types.
  const fromPassport = (key: string) => fields.find((f) => f.key === key && f.source === 'ai')?.value ?? ''
  const given = student.given || fromPassport('given_name')
  const family = student.family || fromPassport('family_name')

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">About you</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            Your name exactly as it appears in your passport. We check it against your passport
            scan in the next step.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="given-name">Given name(s)</Label>
            <Input
              id="given-name"
              autoComplete="given-name"
              value={given}
              onChange={(e) => setStudent({ given: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="family-name">Family name</Label>
            <Input
              id="family-name"
              autoComplete="family-name"
              value={family}
              onChange={(e) => setStudent({ family: e.target.value })}
            />
          </div>
        </div>
      </section>

      {entryMode === 'linked' && course ? (
        <section
          aria-label="Course from the course page"
          className="flex flex-col gap-3 border border-primary/30 bg-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <Link2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="font-semibold text-secondary-foreground text-pretty">
                You&apos;re applying for {course.programmeName}
              </p>
              <p className="text-sm text-muted-foreground">
                Chosen on the course page. You can change it below.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEntryMode('discover')}
            className="shrink-0 text-sm font-semibold text-primary underline underline-offset-4 hover:text-secondary-foreground"
          >
            Not sure? See what you can apply for
          </button>
        </section>
      ) : (
        <section aria-labelledby="entry-heading" className="flex flex-col gap-3">
          <h2 id="entry-heading" className="text-base font-semibold">
            How would you like to start?
          </h2>
          <div role="radiogroup" aria-labelledby="entry-heading" className="grid gap-3 sm:grid-cols-2">
            {ENTRY_OPTIONS.map(({ mode, title, detail, icon: Icon }) => {
              const active = entryMode === mode || (mode === 'course' && entryMode === 'linked')
              return (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setEntryMode(mode)}
                  className={cn(
                    'flex items-start gap-3 border bg-card p-4 text-left transition-colors',
                    active ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/40',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-full',
                      active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-semibold">{title}</span>
                    <span className="text-sm leading-relaxed text-muted-foreground text-pretty">{detail}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {entryMode === 'discover' ? (
        <section aria-labelledby="discover-heading" className="flex flex-col gap-4">
          <div>
            <h2 id="discover-heading" className="text-base font-semibold">
              Upload your documents
            </h2>
            <p className="text-sm text-muted-foreground text-pretty">
              Passport, academic transcripts and English test, in any language. These are the same
              documents your application needs, so you won&apos;t upload them twice.
            </p>
          </div>
          <StepDocuments onProcessingChange={onProcessingChange} aside={<CourseMatches />} />
        </section>
      ) : (
        <StudyPlanSection />
      )}

      {planComplete && entryMode !== 'discover' && (
        <section className="flex items-start gap-3 border border-dashed border-border p-4 text-sm text-muted-foreground">
          <FileText className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="text-pretty">
            {documents.length > 0
              ? 'Next, we check the documents you uploaded against the requirements for this course.'
              : 'Next, upload your passport, transcripts and English test. Each file is read, translated if needed and checked against the requirements for this course.'}
          </p>
        </section>
      )}
    </div>
  )
}
