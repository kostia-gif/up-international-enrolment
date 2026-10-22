'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  GraduationCap,
  Search,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import type { Application } from '@/lib/types'
import { formatShortDate } from '@/lib/format'
import {
  BOARD_COLUMNS,
  boardColumnFor,
  awaitingItem,
  looBadge,
  nextOwner,
  type BoardColumnKey,
  type NextOwner,
} from '@/lib/dashboard'
import { counsellorName } from '@/lib/fixtures'
import { toneDot } from '@/lib/status'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pill, cardStatuses } from './stage-board'
import { ElapsedTracker } from './elapsed-tracker'

const PAGE_SIZE = 25

const OWNER_ICON: Record<NextOwner, LucideIcon> = {
  Student: GraduationCap,
  You: UserRound,
  'UP admissions': Building2,
}

type SortKey = 'student' | 'stage' | 'intake' | 'created'
type SortDir = 'asc' | 'desc'

const STAGE_ORDER: Record<BoardColumnKey, number> = Object.fromEntries(
  BOARD_COLUMNS.map((c, i) => [c.key, i]),
) as Record<BoardColumnKey, number>

const STAGE_LABEL: Record<BoardColumnKey, string> = Object.fromEntries(
  BOARD_COLUMNS.map((c) => [c.key, c.label]),
) as Record<BoardColumnKey, string>

export function ApplicationList({
  applications,
  focusId,
  onFocus,
}: {
  applications: Application[]
  focusId: string | null
  onFocus: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<BoardColumnKey | 'all'>('all')
  const [ownerFilter, setOwnerFilter] = useState<NextOwner | 'all'>('all')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'created', dir: 'desc' })
  const [page, setPage] = useState(0)

  const rows = useMemo(
    () =>
      applications.map((app) => ({
        app,
        stage: boardColumnFor(app),
        owner: nextOwner(app),
      })),
    [applications],
  )

  const stageCounts = useMemo(() => {
    const counts = Object.fromEntries(BOARD_COLUMNS.map((c) => [c.key, 0])) as Record<
      BoardColumnKey,
      number
    >
    for (const r of rows) counts[r.stage]++
    return counts
  }, [rows])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = rows.filter((r) => {
      if (stage !== 'all' && r.stage !== stage) return false
      if (ownerFilter !== 'all' && r.owner !== ownerFilter) return false
      if (!q) return true
      return (
        r.app.studentName.toLowerCase().includes(q) ||
        r.app.id.toLowerCase().includes(q) ||
        r.app.course.programmeName.toLowerCase().includes(q) ||
        r.app.course.brand.toLowerCase().includes(q)
      )
    })
    const dir = sort.dir === 'asc' ? 1 : -1
    return filtered.sort((a, b) => {
      switch (sort.key) {
        case 'student':
          return a.app.studentName.localeCompare(b.app.studentName) * dir
        case 'stage':
          return (STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage]) * dir
        case 'intake':
          return a.app.course.intakeDate.localeCompare(b.app.course.intakeDate) * dir
        default:
          return a.app.createdAt.localeCompare(b.app.createdAt) * dir
      }
    })
  }, [rows, query, stage, ownerFilter, sort])

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const pageRows = visible.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
    setPage(0)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder="Search student, ID or course"
            aria-label="Search applications"
            className="h-8 pl-8 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter by stage">
          <StageChip
            active={stage === 'all'}
            onClick={() => {
              setStage('all')
              setPage(0)
            }}
            label="All"
            count={rows.length}
          />
          {BOARD_COLUMNS.map((c) => (
            <StageChip
              key={c.key}
              active={stage === c.key}
              onClick={() => {
                setStage(c.key)
                setPage(0)
              }}
              label={c.label}
              count={stageCounts[c.key]}
            />
          ))}
        </div>

        <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          Awaiting
          <select
            value={ownerFilter}
            onChange={(e) => {
              setOwnerFilter(e.target.value as NextOwner | 'all')
              setPage(0)
            }}
            className="h-8 rounded-md border border-border bg-card px-2 text-xs text-foreground"
          >
            <option value="all">Anyone</option>
            <option value="You">You</option>
            <option value="Student">Student</option>
            <option value="UP admissions">UP admissions</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="border-b border-border bg-muted/50 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <SortHeader label="Student" sortKey="student" sort={sort} onSort={toggleSort} />
              <th className="px-3 py-2 font-semibold">Course</th>
              <SortHeader label="Stage" sortKey="stage" sort={sort} onSort={toggleSort} />
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold">Awaiting</th>
              <SortHeader label="Intake" sortKey="intake" sort={sort} onSort={toggleSort} />
              <SortHeader label="Age" sortKey="created" sort={sort} onSort={toggleSort} />
              <th className="w-10 px-3 py-2">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(({ app, stage: s, owner }) => {
              const statuses = cardStatuses(app, s)
              const loo = looBadge(app)
              const awaiting = s === 'submitted' ? awaitingItem(app) : null
              const OwnerIcon = OWNER_ICON[owner]
              const selected = focusId === app.id
              return (
                <tr
                  key={app.id}
                  onClick={() => onFocus(app.id)}
                  className={cn(
                    'cursor-pointer border-b border-border/60 align-top transition-colors last:border-b-0',
                    selected ? 'bg-primary/5' : 'hover:bg-muted/40',
                  )}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{app.studentName}</span>
                      {app.duplicateHold && (
                        <span className="rounded-full border border-destructive/25 bg-destructive/12 px-1.5 text-[10px] font-medium text-destructive">
                          On hold
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {app.id} · {counsellorName(app.agentId)}
                    </p>
                  </td>
                  <td className="max-w-64 px-3 py-2.5">
                    <p className="truncate" title={app.course.programmeName}>
                      {app.course.programmeName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {app.course.brand} · {app.course.level}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs">{STAGE_LABEL[s]}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap items-center gap-1">
                      {statuses.map((st, i) =>
                        'text' in st ? (
                          <span
                            key={`${i}-${st.text}`}
                            className="inline-flex items-center gap-1 rounded-full border border-warning/25 bg-warning/12 px-2 py-0.5 text-[10px] font-medium text-warning"
                          >
                            <span className={cn('size-1.5 rounded-full', toneDot.warning)} aria-hidden />
                            {st.text}
                          </span>
                        ) : (
                          <Pill key={`${i}-${st.label}`} pill={st} />
                        ),
                      )}
                      {loo && <span className="text-[10px] font-medium text-ai">{loo}</span>}
                      {statuses.length === 0 && !loo && (
                        <span className="text-[11px] text-muted-foreground">-</span>
                      )}
                    </div>
                    {awaiting && (
                      <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-warning">
                        <CircleAlert className="size-3" aria-hidden />
                        Awaiting {awaiting}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-xs',
                        owner === 'You' ? 'font-semibold text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      <OwnerIcon className="size-3.5" aria-hidden />
                      {owner}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs tabular-nums">
                    {formatShortDate(app.course.intakeDate)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground tabular-nums">
                    <ElapsedTracker iso={app.createdAt} />
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/applications/${app.id}`}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Open ${app.studentName}'s application`}
                      className="inline-flex rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </td>
                </tr>
              )
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No applications match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {visible.length === 0
            ? '0 applications'
            : `${currentPage * PAGE_SIZE + 1}-${Math.min((currentPage + 1) * PAGE_SIZE, visible.length)} of ${visible.length}`}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <span className="px-2 tabular-nums">
            Page {currentPage + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function StageChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
      <span className={cn('tabular-nums', active ? 'opacity-80' : 'text-muted-foreground')}>{count}</span>
    </button>
  )
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey: SortKey
  sort: { key: SortKey; dir: SortDir }
  onSort: (key: SortKey) => void
}) {
  const active = sort.key === sortKey
  const Icon = sort.dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <th
      className="px-3 py-2 font-semibold"
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn('inline-flex items-center gap-1 uppercase', active && 'text-foreground')}
      >
        {label}
        {active && <Icon className="size-3" aria-hidden />}
      </button>
    </th>
  )
}
