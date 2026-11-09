'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader, Mail, MessageSquareText } from 'lucide-react'
import { useStore } from '@/lib/store'
import {
  DEMO_STUDENT_LOGINS,
  maskEmail,
  maskPhone,
  newOneTimeCode,
  studentEmailOf,
  studentMobileOf,
} from '@/lib/student'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Method = 'email' | 'sms'
const CODE_LENGTH = 6

// Passwordless sign-in: the student enters the email on their application and
// gets a one-time code by email or text.
export function StudentLogin() {
  const { applications, signInStudent } = useStore()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<Method>('email')
  const [phase, setPhase] = useState<'email' | 'code'>('email')
  const [expected, setExpected] = useState('')
  const [entered, setEntered] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const normalised = email.trim().toLowerCase()
  const match = applications.find((a) => studentEmailOf(a) === normalised)
  const mobile = match ? studentMobileOf(match) : ''
  const destination = method === 'sms' && mobile ? maskPhone(mobile) : maskEmail(normalised)

  function sendCode(e?: FormEvent) {
    e?.preventDefault()
    if (!normalised) return
    if (!match) {
      setError("We couldn't find an application with that email. Check the spelling, or start a new application.")
      return
    }
    setError(null)
    setSending(true)
    setTimeout(() => {
      setExpected(newOneTimeCode())
      setEntered('')
      setPhase('code')
      setSending(false)
    }, 700)
  }

  function verify(value: string) {
    if (!match) return
    if (value === expected) {
      signInStudent({ email: normalised, appId: match.id })
      router.push('/student/application')
    } else {
      setError("That code doesn't match. Check the latest message and try again.")
    }
  }

  if (phase === 'code') {
    return (
      <div className="flex flex-col gap-6">
        <button
          type="button"
          onClick={() => {
            setPhase('email')
            setError(null)
          }}
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden /> Use a different email
        </button>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Enter your code</h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            We {method === 'sms' ? 'texted' : 'emailed'} a {CODE_LENGTH}-digit code to{' '}
            <span className="font-medium text-foreground">{destination}</span>. It expires in 10
            minutes.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            verify(entered)
          }}
          className="flex flex-col gap-4 border border-border bg-card p-5"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="otp">One-time code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={CODE_LENGTH}
              value={entered}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'otp-error' : undefined}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH)
                setEntered(digits)
                setError(null)
                if (digits.length === CODE_LENGTH) verify(digits)
              }}
              className="h-12 text-center font-mono text-xl tracking-[0.5em]"
            />
            {error && (
              <p id="otp-error" role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
          <Button type="submit" size="lg" disabled={entered.length !== CODE_LENGTH}>
            Sign in
          </Button>
          <button
            type="button"
            onClick={() => sendCode()}
            className="text-sm font-medium text-primary underline underline-offset-4 hover:text-secondary-foreground"
          >
            Send a new code
          </button>
        </form>

        <p className="border border-dashed border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Demo only: your code is{' '}
          <span className="font-mono font-semibold tracking-widest text-foreground">{expected}</span>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight">Sign in to your application</h1>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          No password needed. Enter the email on your application and we&apos;ll send you a
          one-time code.
        </p>
      </div>

      <form onSubmit={sendCode} className="flex flex-col gap-4 border border-border bg-card p-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="student-email">Email</Label>
          <Input
            id="student-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'email-error' : undefined}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
          />
          {error && (
            <p id="email-error" role="alert" className="text-sm text-destructive text-pretty">
              {error}
            </p>
          )}
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-sm font-medium">Send my code by</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { key: 'email', label: 'Email', icon: Mail },
                { key: 'sms', label: 'Text message', icon: MessageSquareText },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <label
                key={key}
                className={cn(
                  'flex cursor-pointer items-center gap-2 border px-3 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                  method === key ? 'border-primary bg-secondary text-secondary-foreground' : 'border-border hover:border-primary/40',
                )}
              >
                <input
                  type="radio"
                  name="method"
                  value={key}
                  checked={method === key}
                  onChange={() => setMethod(key)}
                  className="sr-only"
                />
                <Icon className="size-4" aria-hidden />
                {label}
              </label>
            ))}
          </div>
          {method === 'sms' && (
            <p className="text-xs text-muted-foreground">Sent to the mobile number on your application.</p>
          )}
        </fieldset>

        <Button type="submit" size="lg" disabled={!normalised || sending} className="gap-2">
          {sending && <Loader className="size-4 animate-spin" aria-hidden />}
          Send code
        </Button>
      </form>

      <section aria-labelledby="demo-heading" className="flex flex-col gap-2">
        <h2 id="demo-heading" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Demo students
        </h2>
        <ul className="flex flex-col divide-y divide-border border border-border bg-card">
          {DEMO_STUDENT_LOGINS.map((d) => (
            <li key={d.email}>
              <button
                type="button"
                onClick={() => {
                  setEmail(d.email)
                  setError(null)
                }}
                className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition-colors hover:bg-muted/60"
              >
                <span className="text-sm font-medium">{d.name}</span>
                <span className="text-xs text-muted-foreground">
                  {d.email} · {d.state}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-muted-foreground">
        Haven&apos;t applied yet?{' '}
        <Link href="/student" className="font-medium text-primary underline underline-offset-4">
          Start an application
        </Link>
      </p>
    </div>
  )
}
