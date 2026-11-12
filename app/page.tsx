'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDownUp, BookOpen, Filter, LayoutGrid, List, Plus, Search, UserRoundPlus } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { PageBand } from '@/components/page-band'
import { StageBoard } from '@/components/dashboard/stage-board'
import { ApplicationList } from '@/components/dashboard/application-list'
import { ApplicationPreview } from '@/components/dashboard/application-preview'
import { useStore } from '@/lib/store'
import { ACTIVITY_CATEGORIES, newActivity, type ActivityCategory } from '@/lib/documents'
import { waitingOn } from '@/lib/dashboard'
import type { Application } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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
    Number(waitingOn(b) === 'you') - Number(waitingOn(a) === 'you') ||
    b.daysInStage - a.daysInStage,
  longest: (a, b) => b.daysInStage - a.daysInStage,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  name: (a, b) => a.studentName.localeCompare(b.studentName),
}

// Name, passport number or either application ID (CRM pre-ID or internal id).
function matchesSearch(a: Application, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const passport = a.fields.find((f) => f.key === 'passport_number')?.value ?? ''
  return [a.studentName, a.preId, a.id, passport].some((v) => v.toLowerCase().includes(needle))
}

export default function DashboardPage() {
  const { visibleApplications, markSeen } = useStore()
  const [view, setView] = useState<View>('pipeline')
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [brand, setBrand] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('action')
  const [activity, setActivity] = useState<ActivityFilter>(null)
  const [query, setQuery] = useState('')

  const brands = useMemo(
    () => Array.from(new Set(visibleApplications.map((a) => a.course.brand))).sort(),
    [visibleApplications],
  )

  const filtered = useMemo(
    () =>
      visibleApplications
        .filter((a) => (!brand || a.course.brand === brand) && matchesSearch(a, query))
        .sort(SORTERS[sort]),
    [visibleApplications, brand, sort, query],
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
            return activity === 'any'
              ? items.length > 0
              : items.some((i) => i.category === activity)
          })
        : filtered,
    [filtered, activity, activityById],
  )

  const awaiting = filtered.filter((a) => waitingOn(a) === 'you').length
  // Same rule as the NEW badge on board cards.
  const newCount = filtered.filter(
    (a) => (activityById.get(a.id)?.length ?? 0) > 0 || Boolean(a.unseenUpdate),
  ).length

  const previewApp = previewId ? visibleApplications.find((a) => a.id === previewId) : undefined
  const openPreview = (id: string) => {
    setPreviewId(id)
    markSeen(id)
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <PageBand
        title="My applications"
        innerClassName="max-w-[1400px]"
        meta={
          <p className="text-base">
            <button
              type="button"
              onClick={() => {
                setView('pipeline')
                setActivity(null)
                setSort('action')
              }}
              className="underline-offset-4 hover:underline"
            >
              {awaiting === 0
                ? 'Nothing awaiting you'
                : `${awaiting} action${awaiting === 1 ? '' : 's'} awaiting you`}
            </button>
            {newCount > 0 && (
              <>
                <span aria-hidden>, </span>
                <button
                  type="button"
                  onClick={() => {
                    setView('list')
                    setActivity('any')
                  }}
                  className="underline-offset-4 hover:underline"
                >
                  {newCount} new
                </button>
              </>
            )}
          </p>
        }
        actions={
          <Link
            href="/rules?step=dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-primary-foreground/90 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
          >
            <BookOpen className="size-4" aria-hidden />
            How stages work
          </Link>
        }
      />
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="inline-flex rounded-full border border-input bg-card p-0.5"
            role="group"
            aria-label="View"
          >
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

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, passport or ID"
              aria-label="Search applications by name, passport number or ID"
              className="h-9 pl-8"
            />
          </div>

          <div
            role="group"
            aria-label="Filter and sort"
            className="flex flex-wrap items-center gap-2"
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" className="gap-1.5 font-normal" />}
              >
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
              <DropdownMenuTrigger
                render={<Button variant="outline" className="gap-1.5 font-normal" />}
              >
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

            {(brand || query) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => {
                  setBrand(null)
                  setQuery('')
                }}
              >
                Clear filter{brand && query ? 's' : ''}
              </Button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    render={<Link href="/new/existing" />}
                    nativeButton={false}
                    variant="outline"
                    size="icon-lg"
                    aria-label="Add application for existing student"
                  />
                }
              >
                <UserRoundPlus className="size-4.5" aria-hidden />
              </TooltipTrigger>
              <TooltipContent>Add application for existing student</TooltipContent>
            </Tooltip>
            <Button render={<Link href="/new" />} nativeButton={false} size="lg" className="gap-2">
              <Plus className="size-4.5" strokeWidth={2.5} aria-hidden />
              New application
            </Button>
          </div>
        </div>

        <div className="mt-5">
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
                <ActivityChip
                  active={activity === null}
                  onClick={() => setActivity(null)}
                  label="All"
                />
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
          ? 'border-primary bg-primary text-primary-foreground'
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
        'inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors',
        active
          ? 'bg-secondary text-secondary-foreground ring-1 ring-primary'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
