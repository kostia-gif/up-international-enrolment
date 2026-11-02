'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, ChevronDown, CircleUser, Menu, Route, ShieldCheck, Users } from 'lucide-react'
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
import { cn } from '@/lib/utils'

// Agents UP has marked as trusted (Gold tier). Shown as a gold shield on the
// account switcher so staff can see at a glance who they are dealing with.
const GOLD_TIER_AGENTS = new Set(['c-grace'])

export function AppHeader() {
  const { activeUserId, setActiveUserId, isOwner } = useStore()
  const active = AGENCY.counsellors.find((c) => c.id === activeUserId)
  const pathname = usePathname()
  const isGold = GOLD_TIER_AGENTS.has(activeUserId)

  const navItems = [
    { href: '/admissions', label: 'Intl Admissions', icon: ShieldCheck },
    { href: `/agents/${activeUserId}`, label: 'Agents', icon: Users, match: '/agents' },
    { href: '/journeys', label: 'Journeys', icon: Route },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-[oklch(0.2_0.05_270)] via-brand to-[oklch(0.28_0.07_230)] text-brand-foreground shadow-md">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-9 text-brand-foreground hover:bg-white/10 hover:text-brand-foreground"
                aria-label="Open navigation"
              />
            }
          >
            <Menu className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Navigate</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/" />} className="gap-2.5">
                <span className="grid size-5 place-items-center rounded bg-[oklch(0.55_0.2_27)] text-[9px] font-black text-white">
                  UP
                </span>
                Dashboard
              </DropdownMenuItem>
              {navItems.map(({ href, label, icon: Icon, match }) => {
                const current = pathname.startsWith(match ?? href)
                return (
                  <DropdownMenuItem
                    key={href}
                    render={<Link href={href} />}
                    className={cn('gap-2.5', current && 'bg-accent')}
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    {label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/" className="flex items-center gap-2.5">
          <UpMark />
          <span className="hidden items-baseline gap-1.5 sm:flex">
            <span className="text-sm font-semibold tracking-tight">UP Enrol POC</span>
            {active && (
              <>
                <span className="h-3.5 w-px bg-white/25" aria-hidden />
                <span className="text-xs text-brand-foreground/70">{active.name}</span>
              </>
            )}
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {/* Name opens the agent profile; the chevron switches the active agent. */}
          <div className="flex h-10 items-stretch rounded-full border border-white/15 bg-white/10 text-brand-foreground">
            <Link
              href={`/agents/${activeUserId}`}
              className="flex items-center gap-2.5 rounded-l-full py-1 pl-1 pr-3 transition-colors hover:bg-white/15"
              title="View agent profile"
            >
              <Avatar counsellorId={active?.id} name={active?.name} gold={isGold} />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-medium">{active?.name}</span>
                <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-brand-foreground/70">
                  {isOwner ? 'Owner' : 'Counsellor'}
                  {isGold && (
                    <>
                      <span aria-hidden>·</span>
                      <span className="text-[oklch(0.85_0.14_85)]">Gold tier</span>
                    </>
                  )}
                </span>
              </span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex items-center rounded-r-full border-l border-white/15 px-2 transition-colors hover:bg-white/15"
                    aria-label="Switch agent"
                  />
                }
              >
                <ChevronDown className="size-3.5 opacity-70" />
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{AGENCY.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={`/agents/${activeUserId}`} />} className="gap-2.5">
                  <Users className="size-4 text-muted-foreground" />
                  View {active?.name.split(' ')[0]}&apos;s profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Switch agent
                </DropdownMenuLabel>
                {AGENCY.counsellors.map((c) => {
                  const gold = GOLD_TIER_AGENTS.has(c.id)
                  return (
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
                      <span className="flex flex-1 items-center gap-1.5">
                        {c.name}
                        {gold && (
                          <ShieldCheck
                            className="size-3.5 text-[oklch(0.72_0.15_80)]"
                            aria-label="Gold tier trusted agent"
                          />
                        )}
                      </span>
                      <span className="text-xs capitalize text-muted-foreground">{c.role}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            render={<Link href="/new" />}
            nativeButton={false}
            className="h-10 gap-2 px-4 text-sm font-semibold shadow-md shadow-black/20"
          >
            <Plus className="size-4.5" strokeWidth={2.5} />
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
      <span className="grid size-8 place-items-center rounded-lg bg-[oklch(0.55_0.2_27)] text-sm font-black leading-none tracking-tight text-white shadow-sm">
        UP
      </span>
    </span>
  )
}

const COUNSELLOR_AVATARS: Record<string, string> = {
  'c-grace': '/grace-avatar.png',
}

function GoldBadge() {
  return (
    <span
      className="absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-[oklch(0.78_0.16_80)] ring-2 ring-[oklch(0.24_0.05_262)]"
      title="Gold tier — trusted agent"
    >
      <ShieldCheck className="size-2.5 text-[oklch(0.25_0.05_60)]" strokeWidth={3} aria-hidden />
      <span className="sr-only">Gold tier trusted agent</span>
    </span>
  )
}

function Avatar({
  counsellorId,
  name,
  gold,
}: {
  counsellorId?: string
  name?: string
  gold?: boolean
}) {
  const src = counsellorId ? COUNSELLOR_AVATARS[counsellorId] : undefined
  const initials = (name ?? '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  return (
    <span className="relative shrink-0">
      {src ? (
        <img
          src={src || '/placeholder.svg'}
          alt=""
          className={cn(
            'size-8 rounded-full object-cover ring-2',
            gold ? 'ring-[oklch(0.78_0.16_80)]' : 'ring-white/30',
          )}
        />
      ) : (
        <span
          className={cn(
            'grid size-8 place-items-center rounded-full bg-white/20 text-xs font-semibold ring-2',
            gold ? 'ring-[oklch(0.78_0.16_80)]' : 'ring-white/20',
          )}
        >
          {initials || <CircleUser className="size-4" />}
        </span>
      )}
      {gold && <GoldBadge />}
    </span>
  )
}
