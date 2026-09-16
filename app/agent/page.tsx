'use client'

import { useMemo, useState } from 'react'
import { Filter, LayoutGrid, ListChecks, X } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { StageBoard } from '@/components/dashboard/stage-board'
import { TodoList } from '@/components/dashboard/todo-list'
import { PerformanceSummary } from '@/components/dashboard/performance-summary'
import { TimelineDialog } from '@/components/dashboard/timeline-dialog'
import { HomeHero } from '@/components/dashboard/home-hero'
import { useStore } from '@/lib/store'
import { counsellorName } from '@/lib/fixtures'
import { todoCounts } from '@/lib/dashboard'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type View = 'pipeline' | 'todos'

export default function DashboardPage() {
  const { visibleApplications } = useStore()
  const [view, setView] = useState<View>('pipeline')
  const [focusId, setFocusId] = useState<string | null>(null)
  const [brand, setBrand] = useState<string | null>(null)
  const [agent, setAgent] = useState<string | null>(null)

  const brands = useMemo(
    () => Array.from(new Set(visibleApplications.map((a) => a.course.brand))).sort(),
    [visibleApplications],
  )
  const agents = useMemo(
    () => Array.from(new Set(visibleApplications.map((a) => a.agentId))),
    [visibleApplications],
  )

  const filtered = useMemo(
    () =>
      visibleApplications.filter((a) => {
        if (brand && a.course.brand !== brand) return false
        if (agent && a.agentId !== agent) return false
        return true
      }),
    [visibleApplications, brand, agent],
  )

  const activeFilterCount = (brand ? 1 : 0) + (agent ? 1 : 0)
  const counts = useMemo(() => todoCounts(filtered), [filtered])
  const focusApp = focusId ? filtered.find((a) => a.id === focusId) : undefined

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <HomeHero />

        <h2 className="mt-8 mb-3 text-sm font-semibold text-muted-foreground">Your pipeline</h2>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border border-border p-0.5">
            <ToggleButton
              active={view === 'pipeline'}
              onClick={() => setView('pipeline')}
              icon={<LayoutGrid className="size-3.5" />}
              label="Pipeline"
            />
            <ToggleButton
              active={view === 'todos'}
              onClick={() => setView('todos')}
              icon={<ListChecks className="size-3.5" />}
              label="To-dos"
              trailing={
                counts.urgent + counts.amber > 0 ? (
                  <span className="flex items-center gap-1">
                    {counts.urgent > 0 && (
                      <span className="rounded-full bg-destructive px-1.5 text-[10px] font-semibold tabular-nums text-white">
                        {counts.urgent}
                      </span>
                    )}
                    {counts.amber > 0 && (
                      <span className="rounded-full bg-warning px-1.5 text-[10px] font-semibold tabular-nums text-warning-foreground">
                        {counts.amber}
                      </span>
                    )}
                  </span>
                ) : null
              }
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" className="gap-1.5" />}
            >
              <Filter className="size-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="rounded bg-primary px-1 text-[10px] text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
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
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Agent</DropdownMenuLabel>
                {agents.map((id) => (
                  <DropdownMenuCheckboxItem
                    key={id}
                    checked={agent === id}
                    onCheckedChange={(v) => setAgent(v ? id : null)}
                  >
                    {counsellorName(id)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setBrand(null)
                setAgent(null)
              }}
            >
              Clear
            </Button>
          )}

          <div className="ml-auto flex items-center gap-2">
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
            <PerformanceSummary applications={filtered} />
            <TimelineDialog applications={filtered} focusId={focusId} onFocus={setFocusId} />
          </div>
        </div>

        <div className="mt-5">
          {view === 'pipeline' ? (
            <StageBoard applications={filtered} focusId={focusId} onFocus={setFocusId} />
          ) : (
            <TodoList applications={filtered} focusId={focusId} onFocus={setFocusId} />
          )}
        </div>
      </main>
    </div>
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
