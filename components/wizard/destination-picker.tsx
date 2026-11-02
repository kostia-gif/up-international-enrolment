'use client'

import { useMemo, useState } from 'react'
import { CircleCheck, GraduationCap, Search } from 'lucide-react'
import { UNIVERSITY_NAME, earliestStartAfter } from '@/lib/catalog'
import {
  DESTINATIONS,
  conjointsFor,
  degreesFor,
  destinationLabel,
  majorsFor,
  searchDestinations,
  type Destination,
  type PathwayUniversity,
} from '@/lib/destinations'
import { monthYear } from '@/lib/study-plan'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const selectClass =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50'

export function DestinationPicker({
  university,
  foundationIntake,
  foundationDurationMonths,
  value,
  onChange,
}: {
  university: PathwayUniversity
  foundationIntake: string
  foundationDurationMonths: number
  value: Destination | undefined
  onChange: (d: Destination | undefined) => void
}) {
  const earliest = earliestStartAfter({ durationMonths: foundationDurationMonths }, foundationIntake)

  return (
    <section
      aria-labelledby="destination-heading"
      className={cn(
        'flex flex-col gap-4 rounded-lg border bg-card p-4',
        value ? 'border-border' : 'border-primary/40',
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 id="destination-heading" className="flex items-center gap-2 text-sm font-semibold">
            <GraduationCap className="size-4 text-muted-foreground" aria-hidden />
            Destination degree
            <span className="text-xs font-normal text-destructive">Required</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            {UNIVERSITY_NAME[university]} · pre-filled from the foundation chosen
          </p>
        </div>
      </header>

      {university === 'UoA' ? (
        <UoaBuilder value={value} onChange={onChange} />
      ) : (
        <FlatList university={university} value={value} onChange={onChange} />
      )}

      {value && (
        <div className="flex flex-col gap-1 rounded-md border border-success/30 bg-success/5 p-3">
          <p className="flex items-start gap-2 text-sm font-medium text-foreground">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
            <span className="text-pretty">{destinationLabel(value)}</span>
          </p>
          <p className="pl-6 font-mono text-xs text-muted-foreground">{value.id}</p>
          <p className="pl-6 text-xs text-foreground">
            Earliest start after this foundation: <span className="font-semibold">{monthYear(earliest)}</span>
            {foundationDurationMonths <= 6 && (
              <span className="text-muted-foreground"> · fast-track finishes a semester earlier</span>
            )}
          </p>
        </div>
      )}
    </section>
  )
}

function UoaBuilder({
  value,
  onChange,
}: {
  value: Destination | undefined
  onChange: (d: Destination | undefined) => void
}) {
  const [query, setQuery] = useState('')
  const [degree, setDegree] = useState<string>(value?.degrees[0] ?? '')
  const [conjoint, setConjoint] = useState<string>(value?.degrees[1] ?? '')

  const degrees = useMemo(() => degreesFor('UoA'), [])
  const conjoints = useMemo(() => (degree ? conjointsFor('UoA', degree) : []), [degree])
  const majors = useMemo(
    () => (degree ? majorsFor('UoA', degree, conjoint || null) : []),
    [degree, conjoint],
  )
  const results = useMemo(() => searchDestinations(query, 'UoA'), [query])

  // Selecting a product fills the three dropdowns from whichever half was chosen.
  const pick = (d: Destination) => {
    setDegree(d.degrees[0])
    setConjoint(d.degrees[1] ?? '')
    onChange(d)
  }

  const changeDegree = (next: string) => {
    setQuery('')
    setDegree(next)
    setConjoint('')
    const options = next ? majorsFor('UoA', next, null) : []
    onChange(options.length === 1 && options[0].major === null ? options[0] : undefined)
  }

  const changeConjoint = (next: string) => {
    setQuery('')
    setConjoint(next)
    const options = degree ? majorsFor('UoA', degree, next || null) : []
    onChange(options.length === 1 && options[0].major === null ? options[0] : undefined)
  }

  const changeMajor = (id: string) => {
    setQuery('')
    onChange(DESTINATIONS.find((d) => d.id === id))
  }

  const noMajors = majors.length === 1 && majors[0].major === null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dest-search" className="text-xs">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="dest-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. commerce law accounting"
            className="pl-9"
            autoComplete="off"
          />
        </div>
        {query.trim() && (
          <ul
            className="max-h-56 overflow-y-auto rounded-md border border-border"
            aria-label="Matching destinations"
          >
            {results.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No products match every word.</li>
            ) : (
              results.map((d) => (
                <li key={d.id} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    onClick={() => pick(d)}
                    className={cn(
                      'flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-muted',
                      value?.id === d.id && 'bg-primary/5',
                    )}
                  >
                    <span className="text-pretty">{destinationLabel(d)}</span>
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{d.id}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground" aria-hidden>
        <span className="h-px flex-1 bg-border" />
        or build it
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dest-degree" className="text-xs">
            Degree <span className="text-muted-foreground">({degrees.length})</span>
          </Label>
          <select
            id="dest-degree"
            className={selectClass}
            value={degree}
            onChange={(e) => changeDegree(e.target.value)}
          >
            <option value="">Choose a degree</option>
            {degrees.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dest-conjoint" className="text-xs">
            Conjoint
          </Label>
          <select
            id="dest-conjoint"
            className={selectClass}
            value={conjoint}
            disabled={!degree || conjoints.length === 0}
            onChange={(e) => changeConjoint(e.target.value)}
          >
            <option value="">None</option>
            {conjoints.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dest-major" className="text-xs">
            Major {degree && !noMajors && <span className="text-muted-foreground">({majors.length})</span>}
          </Label>
          <select
            id="dest-major"
            className={selectClass}
            value={value && majors.some((m) => m.id === value.id) ? value.id : ''}
            disabled={!degree || noMajors}
            onChange={(e) => changeMajor(e.target.value)}
          >
            <option value="">{noMajors ? 'No major for this degree' : 'Choose a major'}</option>
            {!noMajors &&
              majors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.major}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function FlatList({
  university,
  value,
  onChange,
}: {
  university: PathwayUniversity
  value: Destination | undefined
  onChange: (d: Destination | undefined) => void
}) {
  const [query, setQuery] = useState('')
  const options = useMemo(() => {
    const all = DESTINATIONS.filter((d) => d.university === university)
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return terms.length ? all.filter((d) => terms.every((t) => d.name.toLowerCase().includes(t))) : all
  }, [university, query])

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="dest-flat" className="text-xs">
        Programme
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          id="dest-flat"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Filter ${options.length} programmes`}
          className="pl-9"
          autoComplete="off"
        />
      </div>
      <ul className="max-h-56 overflow-y-auto rounded-md border border-border" aria-label="Programmes">
        {options.map((d) => (
          <li key={d.id} className="border-b border-border last:border-b-0">
            <button
              type="button"
              onClick={() => onChange(d)}
              aria-pressed={value?.id === d.id}
              className={cn(
                'flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-muted',
                value?.id === d.id && 'bg-primary/5 font-medium',
              )}
            >
              <span className="text-pretty">{destinationLabel(d)}</span>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{d.id}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
