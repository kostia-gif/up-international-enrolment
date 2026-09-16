'use client'

import { useMemo, useState } from 'react'
import { Search, GraduationCap, TriangleAlert } from 'lucide-react'
import {
  CATALOG,
  BRANDS,
  LEVEL_GROUPS,
  intakeState,
  type CatalogProgramme,
} from '@/lib/catalog'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function CoursePicker({
  onSelect,
  excludeIds = [],
}: {
  onSelect: (p: CatalogProgramme, intake: string) => void
  excludeIds?: string[]
}) {
  const [mode, setMode] = useState<'search' | 'browse'>('search')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const available = useMemo(
    () => CATALOG.filter((p) => !excludeIds.includes(p.id)),
    [excludeIds],
  )

  const searchResults = useMemo(() => {
    if (!query.trim()) return available
    const q = query.toLowerCase()
    return available.filter(
      (p) =>
        p.programmeName.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.level.toLowerCase().includes(q),
    )
  }, [query, available])

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-1 border-b border-border p-1.5">
        <Button
          variant={mode === 'search' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setMode('search')}
        >
          Search
        </Button>
        <Button
          variant={mode === 'browse' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setMode('browse')}
        >
          Browse
        </Button>
      </div>

      {mode === 'search' ? (
        <div className="p-3">
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programmes, brands, levels"
              className="pl-8"
            />
          </div>
          <ProgrammeList
            programmes={searchResults}
            openId={openId}
            setOpenId={setOpenId}
            onSelect={onSelect}
          />
        </div>
      ) : (
        <BrowseView programmes={available} openId={openId} setOpenId={setOpenId} onSelect={onSelect} />
      )}
    </div>
  )
}

function BrowseView({
  programmes,
  openId,
  setOpenId,
  onSelect,
}: {
  programmes: CatalogProgramme[]
  openId: string | null
  setOpenId: (id: string | null) => void
  onSelect: (p: CatalogProgramme, intake: string) => void
}) {
  const [brand, setBrand] = useState(BRANDS[0])
  const [group, setGroup] = useState<string | null>(null)

  const groupsForBrand = LEVEL_GROUPS.filter((g) =>
    programmes.some((p) => p.brand === brand && p.levelGroup === g),
  )
  const filtered = programmes.filter(
    (p) => p.brand === brand && (!group || p.levelGroup === group),
  )

  return (
    <div className="grid grid-cols-1 gap-0 sm:grid-cols-[120px_150px_1fr]">
      <div className="flex flex-col border-b border-border p-2 sm:border-b-0 sm:border-r">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase text-muted-foreground">Brand</p>
        {BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => {
              setBrand(b)
              setGroup(null)
            }}
            className={cn(
              'rounded px-2 py-1.5 text-left text-sm transition-colors',
              brand === b ? 'bg-primary/10 font-medium' : 'hover:bg-muted',
            )}
          >
            {b}
          </button>
        ))}
      </div>
      <div className="flex flex-col border-b border-border p-2 sm:border-b-0 sm:border-r">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase text-muted-foreground">Level</p>
        <button
          onClick={() => setGroup(null)}
          className={cn(
            'rounded px-2 py-1.5 text-left text-sm transition-colors',
            !group ? 'bg-primary/10 font-medium' : 'hover:bg-muted',
          )}
        >
          All
        </button>
        {groupsForBrand.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={cn(
              'rounded px-2 py-1.5 text-left text-sm transition-colors',
              group === g ? 'bg-primary/10 font-medium' : 'hover:bg-muted',
            )}
          >
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
        />
      </div>
    </div>
  )
}

function ProgrammeList({
  programmes,
  openId,
  setOpenId,
  onSelect,
}: {
  programmes: CatalogProgramme[]
  openId: string | null
  setOpenId: (id: string | null) => void
  onSelect: (p: CatalogProgramme, intake: string) => void
}) {
  if (programmes.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No programmes found.</p>
  }
  return (
    <ul className="flex flex-col gap-2">
      {programmes.map((p) => (
        <li key={p.id} className="rounded-md border border-border">
          <button
            onClick={() => setOpenId(openId === p.id ? null : p.id)}
            className="flex w-full items-start gap-3 p-3 text-left"
          >
            <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-pretty">{p.programmeName}</p>
              <p className="text-xs text-muted-foreground">
                {p.brand} · {p.campus} · {p.durationMonths} months · {p.priceBundle}
              </p>
            </div>
          </button>
          {openId === p.id && (
            <div className="border-t border-border p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Select an intake</p>
              <div className="flex flex-wrap gap-2">
                {p.intakes.map((intake) => {
                  const state = intakeState(intake)
                  const closed = state === 'closed'
                  return (
                    <button
                      key={intake}
                      disabled={closed}
                      onClick={() => onSelect(p, intake)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors',
                        closed
                          ? 'cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through'
                          : 'border-border hover:border-primary hover:bg-primary/5',
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
          )}
        </li>
      ))}
    </ul>
  )
}
