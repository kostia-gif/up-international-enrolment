'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, GraduationCap, Laptop, MapPin, Search, TriangleAlert } from 'lucide-react'
import {
  CATALOG,
  BRANDS,
  LEVEL_GROUPS,
  ONLINE,
  allLocations,
  intakeState,
  isOnlineOnly,
  leadsToTeacherRegistration,
  offeringsFor,
  withOffering,
  type CatalogProgramme,
  type Offering,
} from '@/lib/catalog'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type SelectFn = (p: CatalogProgramme, intake: string) => void

// A course is shown for a location when it has a live offering there.
function runsAt(p: CatalogProgramme, location: string | null): boolean {
  if (!location) return true
  return offeringsFor(p).some((o) => o.campus === location && !o.comingSoon)
}

export function CoursePicker({
  onSelect,
  excludeIds = [],
}: {
  // Receives the programme narrowed to the chosen campus or Online.
  onSelect: SelectFn
  excludeIds?: string[]
}) {
  const [mode, setMode] = useState<'search' | 'browse'>('search')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [location, setLocation] = useState<string | null>(null)

  const available = useMemo(
    () => CATALOG.filter((p) => !excludeIds.includes(p.id)),
    [excludeIds],
  )
  const locations = useMemo(() => allLocations(available), [available])
  const atLocation = useMemo(() => available.filter((p) => runsAt(p, location)), [available, location])

  const searchResults = useMemo(() => {
    if (!query.trim()) return atLocation
    const q = query.toLowerCase()
    return atLocation.filter(
      (p) =>
        p.programmeName.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.level.toLowerCase().includes(q) ||
        offeringsFor(p).some((o) => o.campus.toLowerCase().includes(q)),
    )
  }, [query, atLocation])

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-muted/40 p-1.5">
        <div className="flex items-center gap-1">
          <Button variant={mode === 'search' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('search')}>
            Search
          </Button>
          <Button variant={mode === 'browse' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('browse')}>
            Browse
          </Button>
        </div>
        <LocationFilter locations={locations} value={location} onChange={setLocation} />
      </div>

      {mode === 'search' ? (
        <div className="p-3">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programmes, brands, levels, campuses"
              className="h-10 bg-background pl-9 text-sm"
            />
          </div>
          <ProgrammeList
            programmes={searchResults}
            openId={openId}
            setOpenId={setOpenId}
            onSelect={onSelect}
            location={location}
          />
        </div>
      ) : (
        <BrowseView
          programmes={atLocation}
          openId={openId}
          setOpenId={setOpenId}
          onSelect={onSelect}
          location={location}
        />
      )}
    </div>
  )
}

function LocationFilter({
  locations,
  value,
  onChange,
}: {
  locations: string[]
  value: string | null
  onChange: (v: string | null) => void
}) {
  return (
    <div role="group" aria-label="Filter by location" className="ml-auto flex flex-wrap items-center gap-1">
      <span className="mr-1 flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="size-3.5" aria-hidden /> Where
      </span>
      {[null, ...locations].map((loc) => {
        const active = value === loc
        return (
          <button
            key={loc ?? 'all'}
            type="button"
            onClick={() => onChange(loc)}
            aria-pressed={active}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
              active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {loc === ONLINE && <Laptop className="size-3" aria-hidden />}
            {loc ?? 'Anywhere'}
          </button>
        )
      })}
    </div>
  )
}

function BrowseView({
  programmes,
  openId,
  setOpenId,
  onSelect,
  location,
}: {
  programmes: CatalogProgramme[]
  openId: string | null
  setOpenId: (id: string | null) => void
  onSelect: SelectFn
  location: string | null
}) {
  const [brand, setBrand] = useState(BRANDS[0])
  const [group, setGroup] = useState<string | null>(null)

  const groupsForBrand = LEVEL_GROUPS.filter((g) =>
    programmes.some((p) => p.brand === brand && p.levelGroup === g),
  )
  const filtered = programmes.filter(
    (p) => p.brand === brand && (!group || p.levelGroup === group),
  )

  const facet = (active: boolean) =>
    cn(
      'rounded-md px-2 py-1.5 text-left text-sm transition-colors',
      active
        ? 'bg-card font-medium text-foreground shadow-xs ring-1 ring-border'
        : 'text-muted-foreground hover:bg-card/70 hover:text-foreground',
    )

  return (
    <div className="grid grid-cols-1 gap-0 sm:grid-cols-[120px_150px_1fr]">
      <div className="flex flex-col gap-0.5 border-b border-border bg-muted/30 p-2 sm:border-b-0 sm:border-r">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Brand</p>
        {BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => {
              setBrand(b)
              setGroup(null)
            }}
            className={facet(brand === b)}
          >
            {b}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-0.5 border-b border-border bg-muted/30 p-2 sm:border-b-0 sm:border-r">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Level</p>
        <button onClick={() => setGroup(null)} className={facet(!group)}>
          All
        </button>
        {groupsForBrand.map((g) => (
          <button key={g} onClick={() => setGroup(g)} className={facet(group === g)}>
            {g}
          </button>
        ))}
      </div>
      <div className="p-3">
        <ProgrammeList
          programmes={filtered}
          openId={openId}
          setOpenId={setOpenId}
          onSelect={onSelect}
          location={location}
        />
      </div>
    </div>
  )
}

// "Auckland · Hamilton · Christchurch" or "4 campuses". Online is shown as a badge.
function locationSummary(p: CatalogProgramme): string {
  const campuses = offeringsFor(p)
    .filter((o) => !o.comingSoon && o.delivery === 'campus')
    .map((o) => o.campus)
  if (campuses.length === 0) return ONLINE
  return campuses.length > 3 ? `${campuses.length} campuses` : campuses.join(' · ')
}

function ProgrammeList({
  programmes,
  openId,
  setOpenId,
  onSelect,
  location,
}: {
  programmes: CatalogProgramme[]
  openId: string | null
  setOpenId: (id: string | null) => void
  onSelect: SelectFn
  location: string | null
}) {
  if (programmes.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        {location ? `No programmes run ${location === ONLINE ? 'online' : `in ${location}`} yet.` : 'No programmes found.'}
      </p>
    )
  }
  return (
    <ul className="overflow-hidden rounded-lg border border-border">
      {programmes.map((p) => {
        const open = openId === p.id
        const onlineOnly = isOnlineOnly(p)
        const offersOnline = offeringsFor(p).some((o) => o.delivery === 'online' && !o.comingSoon)
        return (
          <li
            key={p.id}
            className={cn(
              'border-b border-border last:border-b-0 transition-colors',
              open ? 'bg-accent/50' : 'hover:bg-muted/50',
            )}
          >
            <button
              onClick={() => setOpenId(open ? null : p.id)}
              aria-expanded={open}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
            >
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-md border transition-colors',
                  open
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground',
                )}
              >
                {onlineOnly ? <Laptop className="size-4" aria-hidden /> : <GraduationCap className="size-4" aria-hidden />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{p.programmeName}</span>
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span className="truncate">
                    {p.brand} · {locationSummary(p)} · {p.durationMonths} months
                  </span>
                  {onlineOnly ? (
                    <span className="rounded-full border border-info/30 bg-info/10 px-1.5 py-px text-[11px] font-medium text-info">
                      Online only
                    </span>
                  ) : (
                    offersOnline && (
                      <span className="rounded-full border border-border px-1.5 py-px text-[11px] font-medium">
                        Also online
                      </span>
                    )
                  )}
                  {leadsToTeacherRegistration(p) && (
                    <span className="rounded-full border border-success/30 bg-success/10 px-1.5 py-px text-[11px] font-medium text-success">
                      Leads to NZ teacher registration
                    </span>
                  )}
                  {p.kind === 'pathway' && p.pathwayUniversity && (
                    <span className="rounded-full border border-border px-1.5 py-px text-[11px] font-medium">
                      Pathway to {p.pathwayUniversity}
                    </span>
                  )}
                </span>
              </span>
              <span className="hidden shrink-0 text-right sm:block">
                <span className="block text-sm font-medium">{p.priceBundle}</span>
                <span className="block text-[11px] text-muted-foreground">{p.level}</span>
              </span>
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 text-muted-foreground transition-transform',
                  open && 'rotate-180 text-primary',
                )}
                aria-hidden
              />
            </button>
            {open && <OfferingPicker programme={p} location={location} onSelect={onSelect} />}
          </li>
        )
      })}
    </ul>
  )
}

// Where first, then when. Skipped to intakes when there is only one place.
function OfferingPicker({
  programme,
  location,
  onSelect,
}: {
  programme: CatalogProgramme
  location: string | null
  onSelect: SelectFn
}) {
  const offerings = offeringsFor(programme)
  const live = offerings.filter((o) => !o.comingSoon)
  const [chosen, setChosen] = useState<Offering | null>(
    () => live.find((o) => o.campus === location) ?? (live.length === 1 ? live[0] : null),
  )

  return (
    <div className="flex flex-col gap-3 border-t border-border/70 bg-card px-3 py-3 pl-14">
      {offerings.length > 1 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">Where will the student study?</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Study location">
            {offerings.map((o) => {
              const selected = chosen?.campus === o.campus
              return (
                <button
                  key={o.campus}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={o.comingSoon}
                  onClick={() => setChosen(o)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                    o.comingSoon
                      ? 'cursor-not-allowed border-dashed border-border text-muted-foreground'
                      : selected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card hover:border-primary/50',
                  )}
                >
                  {o.delivery === 'online' ? (
                    <Laptop className="size-3.5" aria-hidden />
                  ) : (
                    <MapPin className="size-3.5" aria-hidden />
                  )}
                  {o.campus}
                  {o.comingSoon ? (
                    <span className="font-normal">· coming soon</span>
                  ) : (
                    <span className="font-normal text-muted-foreground">
                      · {o.intakes.length} intake{o.intakes.length === 1 ? '' : 's'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {chosen?.delivery === 'online' && (
        <p className="flex items-start gap-1.5 rounded-md border border-info/30 bg-info/5 px-2.5 py-2 text-xs leading-relaxed text-foreground text-pretty">
          <Laptop className="mt-0.5 size-3.5 shrink-0 text-info" aria-hidden />
          Studied online from the student&apos;s home country. No NZ student visa is needed, so the
          INZ refusal check is skipped.
        </p>
      )}

      {chosen ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            Select an intake{offerings.length > 1 ? ` · ${chosen.campus}` : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {chosen.intakes.map((intake) => {
              const state = intakeState(intake)
              const closed = state === 'closed'
              return (
                <button
                  key={intake}
                  disabled={closed}
                  onClick={() => onSelect(withOffering(programme, chosen), intake)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all',
                    closed
                      ? 'cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through'
                      : 'border-border bg-card hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-sm',
                  )}
                >
                  {formatDate(intake)}
                  {state === 'closing-soon' && (
                    <span className="flex items-center gap-0.5 text-warning">
                      <TriangleAlert className="size-3" /> closes soon
                    </span>
                  )}
                  {closed && <span>closed</span>}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Choose a location to see its intakes.</p>
      )}
    </div>
  )
}
