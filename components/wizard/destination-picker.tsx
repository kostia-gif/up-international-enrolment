'use client'

import { useMemo, useState } from 'react'
import { CircleCheck, GraduationCap, Search } from 'lucide-react'
import { UNIVERSITY_NAME, earliestStartAfter } from '@/lib/catalog'
import { DESTINATIONS, destinationLabel, type Destination, type PathwayUniversity } from '@/lib/destinations'
import { monthYear } from '@/lib/study-plan'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

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

      <FlatList university={university} value={value} onChange={onChange} />

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
        Programme <span className="text-muted-foreground">({options.length})</span>
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          id="dest-flat"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. commerce law accounting"
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
