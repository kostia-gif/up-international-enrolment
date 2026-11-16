'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { KeyRound, Lock, UserRound } from 'lucide-react'
import type { AgentProfile } from '@/lib/agent-profiles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ProfileDetails({ profile }: { profile: AgentProfile }) {
  const [phone, setPhone] = useState(profile.phone)
  const dirty = phone.trim() !== profile.phone

  return (
    <section
      aria-labelledby="profile-heading"
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <header className="flex items-center justify-between gap-2">
        <h2 id="profile-heading" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <UserRound className="size-4 text-muted-foreground" aria-hidden />
          Manage profile
        </h2>
        <span className="text-xs text-muted-foreground">Synced from Dynamics 365</span>
      </header>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          toast.success('Profile updated')
        }}
      >
        <ReadOnlyField id="profile-name" label="Name" value={profile.name} />
        <ReadOnlyField id="profile-agency" label="Agency" value={profile.agency} />
        <ReadOnlyField id="profile-email" label="Login email" value={profile.email} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-phone">Phone</Label>
          <Input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
          <Button type="submit" size="sm" disabled={!dirty}>
            Save changes
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            render={<Link href="/login?mode=reset" />}
            nativeButton={false}
          >
            <KeyRound className="size-3.5" aria-hidden />
            Change password
          </Button>
        </div>
      </form>

      <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
        Your account and permissions are set up by UP from your agent record. Contact your UP
        relationship manager to change your name, email or agency.
      </p>
    </section>
  )
}

function ReadOnlyField({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5">
        {label}
        <Lock className="size-3 text-muted-foreground" aria-label="Set by UP" />
      </Label>
      <Input id={id} value={value} readOnly className="bg-muted/50 text-muted-foreground" />
    </div>
  )
}
