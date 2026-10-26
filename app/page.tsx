'use client'

import { useMemo, useState } from 'react'
import { Filter, LayoutGrid, List, X } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { StageBoard } from '@/components/dashboard/stage-board'
import { ApplicationList } from '@/components/dashboard/application-list'
import { AssistantPanel } from '@/components/dashboard/assistant-panel'
import { DraftsButton } from '@/components/dashboard/drafts-button'
import { useStore } from '@/lib/store'
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

export default function DashboardPage() {
  const { visibleApplications } = useStore()
  const [view, setView] = useState<View>('pipeline')
  const [focusId, setFocusId] = useState<string | null>(null)
  const [brand, setBrand] = useState<string | null>(null)

  const brands = useMemo(
    () => Array.from(new Set(visibleApplications.map((a) => a.course.brand))).sort(),
    [visibleApplications],
  )

  const filtered = useMemo(
    () =>
      visibleApplications.filter((a) => {
        if (brand && a.course.brand !== brand) return false
        return true
      }),
    [visibleApplications, brand],
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

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" className="gap-1.5" />}
            >
              <Filter className="size-3.5" />
              <span className="hidden sm:inline">Brand</span>
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
            </DropdownMenuContent>
          </DropdownMenu>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBrand(null)}
            >
              Clear
            </Button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <DraftsButton drafts={drafts} />
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
          </div>
        </div>

        <div className="mt-4">
          <AssistantPanel applications={filtered} focusApp={focusApp} />
        </div>

        <div className="mt-4">
          {view === 'pipeline' ? (
            <StageBoard applications={filtered} focusId={focusId} onFocus={setFocusId} />
          ) : (
            <ApplicationList applications={filtered} focusId={focusId} onFocus={setFocusId} />
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
