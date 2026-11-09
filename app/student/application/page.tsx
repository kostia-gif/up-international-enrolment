'use client'

import Link from 'next/link'
import { KeyRound } from 'lucide-react'
import { useStore } from '@/lib/store'
import { StudentHeader } from '@/components/student/student-header'
import { StudentApplicationView } from '@/components/student/student-application'
import { Button } from '@/components/ui/button'

export default function StudentApplicationPage() {
  const { studentSession, getApplication } = useStore()
  const app = studentSession ? getApplication(studentSession.appId) : undefined

  return (
    <div className="min-h-screen">
      <StudentHeader />
      {app ? (
        <StudentApplicationView app={app} />
      ) : (
        <main className="mx-auto flex max-w-md flex-col items-start gap-4 px-4 py-16">
          <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary">
            <KeyRound className="size-5" aria-hidden />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Sign in to see your application</h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            We&apos;ll send a one-time code to the email or mobile on your application.
          </p>
          <Button render={<Link href="/student/login" />} nativeButton={false}>
            Sign in
          </Button>
        </main>
      )}
    </div>
  )
}
