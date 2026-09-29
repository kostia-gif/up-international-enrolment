'use client'

import Link from 'next/link'
import { Plus, ChevronDown, CircleUser, LayoutGrid, TrendingUp } from 'lucide-react'
import { AGENCY, useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AppHeader() {
  const { activeUserId, setActiveUserId, isOwner } = useStore()
  const active = AGENCY.counsellors.find((c) => c.id === activeUserId)

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-[oklch(0.2_0.05_270)] via-brand to-[oklch(0.28_0.07_230)] text-brand-foreground">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <Link href="/agent" className="flex items-center gap-2.5">
          <UpMark />
          <span className="hidden items-baseline gap-1.5 sm:flex">
            <span className="text-sm font-semibold tracking-tight">Apply Platform</span>
            <span className="h-3.5 w-px bg-white/25" aria-hidden />
            <span className="text-xs text-brand-foreground/70">Agent enrolment</span>
          </span>
        </Link>

        <Link
          href="/"
          className="hidden items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-foreground/70 transition-colors hover:bg-white/10 hover:text-brand-foreground lg:inline-flex"
        >
          <LayoutGrid className="size-3.5" />
          Switch portal
        </Link>
        <Link
          href="/sales?view=agent"
          className="hidden items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-foreground/70 transition-colors hover:bg-white/10 hover:text-brand-foreground md:inline-flex"
        >
          <TrendingUp className="size-3.5" />
          Pipeline &amp; conversion
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <span
            className="hidden items-center rounded-lg bg-white px-3 py-1.5 shadow-sm md:flex"
            title={AGENCY.name}
          >
            {/* Agent's agency branding */}
            <img
              src="/agency-logo.png"
              alt={`${AGENCY.name} logo`}
              className="h-11 w-auto object-contain"
            />
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  size="sm"
                  className="h-11 gap-2.5 border border-white/15 bg-white/10 pl-1.5 pr-3 text-brand-foreground hover:bg-white/20"
                />
              }
            >
              <Avatar counsellorId={active?.id} name={active?.name} />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-medium">{active?.name}</span>
                <span className="block text-[10px] font-medium uppercase tracking-wide text-brand-foreground/70">
                  {isOwner ? 'Owner' : 'Counsellor'}
                </span>
              </span>
              <ChevronDown className="size-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{AGENCY.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {AGENCY.counsellors.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => setActiveUserId(c.id)}
                    className="flex items-center gap-2.5"
                  >
                    {COUNSELLOR_AVATARS[c.id] ? (
                      <img
                        src={COUNSELLOR_AVATARS[c.id] || '/placeholder.svg'}
                        alt=""
                        className="size-6 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                        {c.name
                          .split(' ')
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join('')}
                      </span>
                    )}
                    <span className="flex-1">{c.name}</span>
                    <span className="text-xs capitalize text-muted-foreground">{c.role}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button render={<Link href="/new" />} nativeButton={false} size="sm" className="gap-1.5">
            <Plus className="size-4" />
            <span className="hidden sm:inline">New application</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

function UpMark() {
  return (
    <span className="flex items-center">
      <span className="grid size-9 place-items-center rounded-lg bg-[oklch(0.55_0.2_27)] text-base font-black leading-none tracking-tight text-white shadow-sm">
        UP
      </span>
    </span>
  )
}

const COUNSELLOR_AVATARS: Record<string, string> = {
  'c-grace': '/grace-avatar.png',
}

function Avatar({ counsellorId, name }: { counsellorId?: string; name?: string }) {
  const src = counsellorId ? COUNSELLOR_AVATARS[counsellorId] : undefined
  const initials = (name ?? '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  if (src) {
    return (
      <img
        src={src || '/placeholder.svg'}
        alt=""
        className="size-8 shrink-0 rounded-full object-cover ring-2 ring-white/30"
      />
    )
  }
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/20 text-xs font-semibold ring-2 ring-white/20">
      {initials || <CircleUser className="size-4" />}
    </span>
  )
}
