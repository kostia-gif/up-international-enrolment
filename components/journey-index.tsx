import Link from 'next/link'
import { ArrowRight, FileText, Languages, UserRound } from 'lucide-react'
import { JOURNEYS, journeyProgramme, type Journey, type JourneyOutcome } from '@/lib/journeys'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

const OUTCOME: Record<JourneyOutcome, { label: string; dot: string; text: string }> = {
  green: { label: 'Green — proceeds', dot: 'bg-success', text: 'text-success' },
  amber: { label: 'Amber — action needed', dot: 'bg-warning', text: 'text-warning' },
  red: { label: 'Red — unlikely to proceed', dot: 'bg-destructive', text: 'text-destructive' },
}

export function JourneyIndex() {
  const vet = JOURNEYS.filter((j) => j.sector === 'VET')
  const he = JOURNEYS.filter((j) => j.sector === 'HE')

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 md:px-6">
      <header className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Proof of concept
        </p>
        <h1 className="text-3xl font-semibold text-balance">Applicant journeys</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          Each journey pre-selects a course, names the student and swaps in a matching set of
          demo documents, so the wizard plays out one business-rule outcome end to end. Pick one
          to load it; drop the files in Step 2 as you normally would.
        </p>
        <ol className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
          {['Course and intake', 'Documents', 'Assessment', 'Answers', 'Review and offer'].map(
            (s, i) => (
              <li key={s} className="flex items-center gap-1.5">
                <span className="grid size-4 place-items-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                  {i + 1}
                </span>
                {s}
              </li>
            ),
          )}
        </ol>
      </header>

      <Group title="Vocational (VET)" journeys={vet} />
      <Group title="Higher education (HE)" journeys={he} />

      <p className="text-xs text-muted-foreground">
        Visa approval figures are illustrative POC data by nationality and course level; see{' '}
        <Link href="/rules?step=3" className="underline hover:text-foreground">
          the Step 3 rules
        </Link>{' '}
        for the thresholds.
      </p>
    </main>
  )
}

function Group({ title, journeys }: { title: string; journeys: Journey[] }) {
  return (
    <section aria-labelledby={`grp-${title}`} className="flex flex-col gap-4">
      <h2 id={`grp-${title}`} className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {journeys.map((j) => (
          <li key={j.id}>
            <JourneyCard journey={j} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function JourneyCard({ journey }: { journey: Journey }) {
  const p = journeyProgramme(journey)
  const outcome = OUTCOME[journey.expected]
  const translated = journey.files.filter((f) => f.translated).length
  const rejected = journey.files.filter((f) => f.problem).length

  return (
    <Link
      href={`/new?journey=${journey.id}`}
      className="group flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug text-pretty">{journey.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
            {journey.summary}
          </p>
        </div>
        <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Course</dt>
        <dd className="text-pretty">
          {p ? `${p.brand} · ${p.programmeName}` : journey.programmeId} · intake{' '}
          {formatDate(journey.intake)}
        </dd>
        <dt className="text-muted-foreground">Student</dt>
        <dd>
          {journey.student.given} {journey.student.family} · {journey.student.nationality}
          {journey.agentRef && (
            <span className="ml-1.5 font-mono text-muted-foreground">{journey.agentRef}</span>
          )}
        </dd>
      </dl>

      <ul className="flex flex-wrap gap-1.5 text-[11px] font-medium">
        <li className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
          <FileText className="size-3" aria-hidden /> {journey.files.length} files
        </li>
        {translated > 0 && (
          <li className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
            <Languages className="size-3" aria-hidden /> {translated} translated
          </li>
        )}
        {rejected > 0 && (
          <li className="rounded bg-destructive/10 px-1.5 py-0.5 text-destructive">
            {rejected} rejected with fix
          </li>
        )}
        <li className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
          <UserRound className="size-3" aria-hidden /> {journey.sector}
        </li>
      </ul>

      <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3">
        <p className={cn('flex items-center gap-1.5 text-xs font-semibold', outcome.text)}>
          <span className={cn('size-2 rounded-full', outcome.dot)} aria-hidden />
          Expected: {outcome.label}
        </p>
        <ul className="flex flex-col gap-1">
          {journey.watchFor.map((w) => (
            <li key={w} className="text-xs leading-relaxed text-muted-foreground text-pretty">
              {w}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}
