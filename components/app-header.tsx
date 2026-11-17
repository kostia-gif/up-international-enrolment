'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Plus,
  ChevronDown,
  CircleUser,
  GraduationCap,
  Menu,
  Route,
  ShieldCheck,
  Users,
  UserRoundPlus,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { isTrustedAgency } from '@/lib/agent-profiles'
import { Button } from '@/components/ui/button'
import { AskAi } from '@/components/ask-ai'
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

export function AppHeader() {
  const { activeUserId, setActiveUserId, isOwner, agency } = useStore()
  const active = agency.counsellors.find((c) => c.id === activeUserId)
  const pathname = usePathname()
  // Trust sits with the agency, not the individual agent.
  const trusted = isTrustedAgency(agency)

  const navItems = [
    { href: '/admissions', label: 'Intl Admissions', icon: ShieldCheck },
    { href: `/agents/${activeUserId}`, label: 'Agents', icon: Users, match: '/agents' },
    { href: '/journeys', label: 'Journeys', icon: Route },
    { href: '/student', label: 'Student direct', icon: GraduationCap },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card text-foreground">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-9 text-foreground"
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
                <span className="grid size-5 place-items-center rounded-sm bg-up-red text-[9px] font-black text-primary-foreground">
                  UP
                </span>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/new" />} className="gap-2.5">
                <Plus className="size-4 text-muted-foreground" />
                New application
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/new/existing" />} className="gap-2.5">
                <UserRoundPlus className="size-4 text-muted-foreground" />
                Add for existing student
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
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-base font-semibold tracking-tight">UP Education</span>
            <span className="text-xs text-muted-foreground">Application Portal</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <AskAi />
          {/* Name opens the agent profile; the chevron switches the active agent. */}
          <div className="flex h-11 items-stretch rounded-full border border-border bg-card text-foreground">
            <Link
              href={`/agents/${activeUserId}`}
              className="flex items-center gap-2.5 rounded-l-full py-1 pl-1.5 pr-3 transition-colors hover:bg-muted"
              title="View agent profile"
            >
              <Avatar counsellorId={active?.id} name={active?.name} />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-semibold">{active?.name}</span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  {agency.name} · {isOwner ? 'Owner' : 'Counsellor'}
                  {trusted && (
                    <>
                      <span aria-hidden>·</span>
                      <ShieldCheck className="size-3 text-success" aria-hidden />
                      <span className="text-success">Trusted agency</span>
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
                    className="flex items-center rounded-r-full border-l border-border px-2.5 transition-colors hover:bg-muted"
                    aria-label="Switch agent"
                  />
                }
              >
                <ChevronDown className="size-3.5 opacity-70" />
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{agency.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={`/agents/${activeUserId}`} />} className="gap-2.5">
                  <Users className="size-4 text-muted-foreground" />
                  View {active?.name.split(' ')[0]}&apos;s profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Switch agent
                </DropdownMenuLabel>
                {agency.counsellors.map((c) => (
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
          </div>

        </div>
      </div>
    </header>
  )
}

export function UpMark() {
  return (
    <span className="flex items-center">
      <span className="grid size-9 place-items-center rounded-sm bg-up-red text-sm font-black leading-none tracking-tight text-primary-foreground">
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

  return (
    <span className="relative shrink-0">
      {src ? (
        <img src={src || '/placeholder.svg'} alt="" className="size-8 rounded-full object-cover ring-2 ring-border" />
      ) : (
        <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground ring-2 ring-card">
          {initials || <CircleUser className="size-4" />}
        </span>
      )}
    </span>
  )
}
