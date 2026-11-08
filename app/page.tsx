'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDownUp, BookOpen, Filter, LayoutGrid, List } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { StageBoard } from '@/components/dashboard/stage-board'
import { ApplicationList } from '@/components/dashboard/application-list'
import { ApplicationPreview } from '@/components/dashboard/application-preview'
import { useStore } from '@/lib/store'
import { ACTIVITY_CATEGORIES, newActivity, type ActivityCategory } from '@/lib/documents'
import { waitingOn } from '@/lib/dashboard'
import type { Application } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type View = 'pipeline' | 'list'
type ActivityFilter = null | 'any' | ActivityCategory
type SortKey = 'action' | 'longest' | 'newest' | 'name'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'action', label: 'Your action first' },
  { key: 'longest', label: 'Longest in stage' },
  { key: 'newest', label: 'Newest first' },
  { key: 'name', label: 'Student name' },
]

const SORTERS: Record<SortKey, (a: Application, b: Application) => number> = {
  action: (a, b) =>
    Number(waitingOn(b) === 'you') - Number(waitingOn(a) === 'you') || b.daysInStage - a.daysInStage,
  longest: (a, b) => b.daysInStage - a.daysInStage,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  name: (a, b) => a.studentName.localeCompare(b.studentName),
}

export default function DashboardPage() {
  const { visibleApplications, markSeen } = useStore()
  const [view, setView] = useState<View>('pipeline')
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [brand, setBrand] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('action')
  const [activity, setActivity] = useState<ActivityFilter>(null)

  const brands = useMemo(
    () => Array.from(new Set(visibleApplications.map((a) => a.course.brand))).sort(),
    [visibleApplications],
  )

  const filtered = useMemo(
    () =>
      visibleApplications
        .filter((a) => !brand || a.course.brand === brand)
        .sort(SORTERS[sort]),
    [visibleApplications, brand, sort],
  )

  const activityById = useMemo(
    () => new Map(filtered.map((a) => [a.id, newActivity(a)])),
    [filtered],
  )
  const activityCounts = useMemo(() => {
    const counts: Record<string, number> = { any: 0 }
    for (const items of activityById.values()) {
      if (items.length) counts.any++
      for (const c of new Set(items.map((i) => i.category))) counts[c] = (counts[c] ?? 0) + 1
    }
    return counts
  }, [activityById])
  const listRows = useMemo(
    () =>
      activity
        ? filtered.filter((a) => {
            const items = activityById.get(a.id) ?? []
            return activity === 'any' ? items.length > 0 : items.some((i) => i.category === activity)
          })
        : filtered,
    [filtered, activity, activityById],
  )

  const previewApp = previewId ? visibleApplications.find((a) => a.id === previewId) : undefined
  const openPreview = (id: string) => {
    setPreviewId(id)
    markSeen(id)
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-semibold tracking-tight">Applications</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} application{filtered.length === 1 ? '' : 's'}
              {brand ? ` at ${brand}` : ''}
            </p>
          </div>
          <Link
            href="/rules?step=dashboard"
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <BookOpen className="size-4" aria-hidden />
            How stages work
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-1.5">
          <div className="inline-flex rounded-md bg-muted p-0.5" role="group" aria-label="View">
            <ToggleButton
              active={view === 'pipeline'}
              onClick={() => setView('pipeline')}
              icon={<LayoutGrid className="size-3.5" />}
              label="Board"
            />
            <ToggleButton
              active={view === 'list'}
              onClick={() => setView('list')}
              icon={<List className="size-3.5" />}
              label="List"
            />
          </div>

          <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden />

          <div role="group" aria-label="Filter and sort" className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-1.5" />}>
                <Filter className="size-3.5" aria-hidden />
                <span>
                  <span className="text-muted-foreground">Brand:</span> {brand ?? 'All'}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Brand</DropdownMenuLabel>
                  {brands.map((b) => (
                    <DropdownMenuCheckboxItem
                      key={b}
                      checked={brand === b}
                      onCheckedChange={(v) => setBrand(v ? b : null)}
                    >
                      {b}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-1.5" />}>
                <ArrowDownUp className="size-3.5" aria-hidden />
                <span>
                  <span className="text-muted-foreground">Sort:</span>{' '}
                  {SORTS.find((s) => s.key === sort)?.label}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                    {SORTS.map((s) => (
                      <DropdownMenuRadioItem key={s.key} value={s.key}>
                        {s.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {brand && (
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setBrand(null)}>
                Clear filter
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4">
          {view === 'pipeline' ? (
            <StageBoard applications={filtered} onOpen={openPreview} />
          ) : (
            <div className="flex flex-col gap-3">
              <div
                role="group"
                aria-label="Filter by new activity"
                className="flex flex-wrap items-center gap-1.5"
              >
                <span className="mr-1 text-xs font-medium text-muted-foreground">New activity</span>
                <ActivityChip active={activity === null} onClick={() => setActivity(null)} label="All" />
                <ActivityChip
                  active={activity === 'any'}
                  onClick={() => setActivity('any')}
                  label="Any new"
                  count={activityCounts.any}
                />
                {ACTIVITY_CATEGORIES.map((c) => (
                  <ActivityChip
                    key={c.key}
                    active={activity === c.key}
                    onClick={() => setActivity(activity === c.key ? null : c.key)}
                    label={c.label}
                    count={activityCounts[c.key] ?? 0}
                  />
                ))}
              </div>
              <ApplicationList applications={listRows} onOpen={openPreview} />
            </div>
          )}
        </div>
      </main>

      <ApplicationPreview app={previewApp} onOpenChange={(open) => !open && setPreviewId(null)} />
    </div>
  )
}

function ActivityChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count?: number
}) {
  const empty = count === 0
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      disabled={empty && !active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-4 tabular-nums',
            active ? 'bg-background/20' : 'bg-muted text-foreground',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded px-3 py-1 text-sm font-medium transition-colors',
        active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
