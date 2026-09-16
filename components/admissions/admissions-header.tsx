'use client'

import Link from 'next/link'
import { LayoutGrid, ShieldCheck } from 'lucide-react'

// The admissions officer persona. The whole admissions portal is worked as
// Mel, UP's admissions officer — mirrored by senderMeta.up in lib/dashboard.
export const ADMISSIONS_OFFICER = {
  name: 'Mel Harding',
  role: 'Admissions Officer',
  team: 'UP Admissions',
  avatar: '/mel-avatar.png',
}

export function AdmissionsHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-[oklch(0.22_0.06_285)] via-[oklch(0.26_0.07_260)] to-[oklch(0.3_0.08_235)] text-brand-foreground">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <Link href="/admissions" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-[oklch(0.55_0.2_27)] text-base font-black leading-none tracking-tight text-white shadow-sm">
            UP
          </span>
          <span className="hidden items-baseline gap-1.5 sm:flex">
            <span className="text-sm font-semibold tracking-tight">Apply Platform</span>
            <span className="h-3.5 w-px bg-white/25" aria-hidden />
            <span className="inline-flex items-center gap-1 text-xs text-brand-foreground/70">
              <ShieldCheck className="size-3.5" />
              Admissions
            </span>
          </span>
        </Link>

        <Link
          href="/"
          className="hidden items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-foreground/70 transition-colors hover:bg-white/10 hover:text-brand-foreground lg:inline-flex"
        >
          <LayoutGrid className="size-3.5" />
          Switch portal
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-right leading-tight sm:block">
            <span className="block text-sm font-medium">{ADMISSIONS_OFFICER.name}</span>
            <span className="block text-[10px] font-medium uppercase tracking-wide text-brand-foreground/70">
              {ADMISSIONS_OFFICER.role} · {ADMISSIONS_OFFICER.team}
            </span>
          </span>
          <img
            src={ADMISSIONS_OFFICER.avatar || '/placeholder.svg'}
            alt=""
            className="size-9 shrink-0 rounded-full object-cover ring-2 ring-white/30"
          />
        </div>
      </div>
    </header>
  )
}
