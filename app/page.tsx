'use client'

import { useMemo, useState } from 'react'
import { Filter, LayoutGrid, List, X } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { StageBoard } from '@/components/dashboard/stage-board'
import { ApplicationList } from '@/components/dashboard/application-list'
import { AssistantPanel } from '@/components/dashboard/assistant-panel'
import { DraftsButton } from '@/components/dashboard/drafts-button'
import { useStore } from '@/lib/store'
import { ACTIVITY_CATEGORIES, newActivity, type ActivityCategory } from '@/lib/documents'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type View = 'pipeline' | 'list'
type ActivityFilter = null | 'any' | ActivityCategory

export default function DashboardPage() {
  const { visibleApplications } = useStore()
  const [view, setView] = useState<View>('pipeline')
  const [focusId, setFocusId] = useState<string | null>(null)
  const [brand, setBrand] = useState<string | null>(null)

  const brands = useMemo(
    () => Array.from(new Set(visibleApplications.map((a) => a.course.brand))).sort(),
    [visibleApplications],
  )

  const [activity, setActivity] = useState<ActivityFilter>(null)

  const filtered = useMemo(
    () =>
      visibleApplications.filter((a) => {
        if (brand && a.course.brand !== brand) return false
        return true
      }),
    [visibleApplications, brand],
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

  const drafts = filtered.filter((a) => a.stage === 'Draft')
  const activeFilterCount = brand ? 1 : 0
  const focusApp = focusId ? filtered.find((a) => a.id === focusId) : undefined

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <h1 className="sr-only">Pipeline</h1>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border border-border p-0.5">
            <ToggleButton
              active={view === 'pipeline'}
              onClick={() => setView('pipeline')}
              icon={<LayoutGrid className="size-3.5" />}
              label="Pipeline"
            />
            <ToggleButton
              active={view === 'list'}
              onClick={() => setView('list')}
              icon={<List className="size-3.5" />}
              label="List"
            />
          </div>

          <div
            role="group"
            aria-label="Filters"
            className="ml-auto flex flex-wrap items-center gap-2"
          >
            {focusApp && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={() => setFocusId(null)}
              >
                <X className="size-3.5" />
                <span className="hidden sm:inline">{focusApp.studentName}</span>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" className="gap-1.5" />}
              >
                <Filter className="size-3.5" />
                <span className="hidden sm:inline">{brand ?? 'Brand'}</span>
                {activeFilterCount > 0 && (
                  <span className="rounded bg-primary px-1 text-[10px] text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
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
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setBrand(null)}>
                Clear
              </Button>
            )}
            <DraftsButton drafts={drafts} />
          </div>
        </div>

        <div className="mt-3">
          <AssistantPanel applications={filtered} focusApp={focusApp} />
        </div>

        <div className="mt-4">
          {view === 'pipeline' ? (
            <StageBoard applications={filtered} focusId={focusId} onFocus={setFocusId} />
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
              <ApplicationList applications={listRows} focusId={focusId} onFocus={setFocusId} />
            </div>
          )}
        </div>
      </main>
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
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-4 tabular-nums',
            active ? 'bg-primary-foreground/20' : 'bg-success text-success-foreground',
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
  trailing,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  trailing?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded px-3 py-1 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {label}
      {trailing}
    </button>
  )
}
