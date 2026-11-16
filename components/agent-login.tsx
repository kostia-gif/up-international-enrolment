'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CircleCheck } from 'lucide-react'
import { UpMark } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Mode = 'signin' | 'reset' | 'sent'

export function AgentLogin({ initialMode }: { initialMode: 'signin' | 'reset' }) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('grace.tan@pacificstudylink.com')
  const [password, setPassword] = useState('demo-password')

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2.5">
          <UpMark />
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight">UP Enrol</span>
            <span className="text-xs text-muted-foreground">Agent portal</span>
          </span>
        </div>

        <section className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
          {mode === 'sent' ? (
            <div className="flex flex-col gap-3">
              <CircleCheck className="size-6 text-success" aria-hidden />
              <h1 className="text-lg font-semibold">Check your email</h1>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                If {email || 'that email'} has a UP Enrol account, we&apos;ve sent a link to reset
                your password.
              </p>
              <Button variant="outline" onClick={() => setMode('signin')}>
                Back to sign in
              </Button>
            </div>
          ) : mode === 'reset' ? (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                setMode('sent')
              }}
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-semibold">Reset your password</h1>
                <p className="text-sm text-muted-foreground text-pretty">
                  Enter your login email and we&apos;ll send you a reset link.
                </p>
              </div>
              <EmailField value={email} onChange={setEmail} />
              <Button type="submit">Send reset link</Button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                router.push('/')
              }}
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-semibold">Sign in</h1>
                <p className="text-sm text-muted-foreground text-pretty">
                  For pilot agents. Your account is set up by UP.
                </p>
              </div>
              <EmailField value={email} onChange={setEmail} />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="login-password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Forgotten password?
                  </button>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit">Sign in</Button>
            </form>
          )}
        </section>

        <p className="text-center text-xs leading-relaxed text-muted-foreground text-pretty">
          Not on the pilot? Keep submitting through Enroller.{' '}
          <Link href="/" className="underline underline-offset-4 hover:text-foreground">
            Demo dashboard
          </Link>
        </p>
      </div>
    </main>
  )
}

function EmailField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="login-email">Email</Label>
      <Input
        id="login-email"
        type="email"
        required
        autoComplete="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
