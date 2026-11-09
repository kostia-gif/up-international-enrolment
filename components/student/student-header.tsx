'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftRight, LogOut } from 'lucide-react'
import { useStore } from '@/lib/store'
import { UpMark } from '@/components/app-header'
import { Button } from '@/components/ui/button'

export function StudentHeader() {
  const { studentSession, getApplication, signOutStudent } = useStore()
  const router = useRouter()
  const app = studentSession ? getApplication(studentSession.appId) : undefined

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card text-foreground">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <Link href="/student" className="flex items-center gap-2.5">
          <UpMark />
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight">UP Education</span>
            <span className="text-xs text-muted-foreground">Student portal</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {/* POC only: lets a demo switch back to the agent side. */}
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
            className="hidden gap-1.5 text-muted-foreground sm:inline-flex"
          >
            <ArrowLeftRight className="size-3.5" aria-hidden />
            Agent portal
          </Button>
          {app ? (
            <>
              <Link
                href="/student/application"
                className="flex h-10 items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {app.studentName
                    .split(' ')
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <span className="hidden sm:inline">{app.studentName}</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                onClick={() => {
                  signOutStudent()
                  router.push('/student')
                }}
              >
                <LogOut className="size-4" aria-hidden />
              </Button>
            </>
          ) : (
            <Button variant="outline" render={<Link href="/student/login" />} nativeButton={false}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
