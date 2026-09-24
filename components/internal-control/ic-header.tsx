'use client'

import Link from 'next/link'
import { LayoutGrid, ScanSearch } from 'lucide-react'

// The Internal Control auditor persona. Internal Control is deliberately
// separate from the admissions processing team.
export const IC_AUDITOR = {
  name: 'Priya Nair',
  role: 'Internal Control Auditor',
  team: 'UP Internal Control',
}

const NAV = [
  { label: 'Dashboard', href: '/internal-control' },
  { label: 'Applications', href: '/admissions' },
  { label: 'Students', href: '/internal-control' },
  { label: 'Internal Control', href: '/internal-control', active: true },
  { label: 'Reports', href: '/internal-control' },
  { label: 'Settings', href: '/internal-control' },
]

export function IcHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-[oklch(0.26_0.06_300)] via-[oklch(0.28_0.08_285)] to-[oklch(0.32_0.09_260)] text-brand-foreground">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <Link href="/internal-control" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-[oklch(0.55_0.2_27)] text-base font-black leading-none tracking-tight text-white shadow-sm">
            UP
          </span>
          <span className="hidden items-baseline gap-1.5 sm:flex">
            <span className="text-sm font-semibold tracking-tight">Apply Platform</span>
            <span className="h-3.5 w-px bg-white/25" aria-hidden />
            <span className="inline-flex items-center gap-1 text-xs text-brand-foreground/70">
              <ScanSearch className="size-3.5" />
              Internal Control
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={
                item.active
                  ? 'rounded-md bg-white/15 px-2.5 py-1.5 text-xs font-medium text-brand-foreground'
                  : 'rounded-md px-2.5 py-1.5 text-xs font-medium text-brand-foreground/65 transition-colors hover:bg-white/10 hover:text-brand-foreground'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/"
            className="hidden items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-foreground/70 transition-colors hover:bg-white/10 hover:text-brand-foreground lg:inline-flex"
          >
            <LayoutGrid className="size-3.5" />
            Switch portal
          </Link>
          <span className="hidden text-right leading-tight sm:block">
            <span className="block text-sm font-medium">{IC_AUDITOR.name}</span>
            <span className="block text-[10px] font-medium uppercase tracking-wide text-brand-foreground/70">
              {IC_AUDITOR.role}
            </span>
          </span>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/20 text-xs font-semibold ring-2 ring-white/30">
            PN
          </span>
        </div>
      </div>
    </header>
  )
}
