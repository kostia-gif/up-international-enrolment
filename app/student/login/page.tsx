import type { Metadata } from 'next'
import { StudentHeader } from '@/components/student/student-header'
import { StudentLogin } from '@/components/student/student-login'

export const metadata: Metadata = {
  title: 'Sign in — UP Education student portal',
  description: 'Sign in with a one-time code to see your UP Education application and offer.',
}

export default function StudentLoginPage() {
  return (
    <div className="min-h-screen">
      <StudentHeader />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
        <StudentLogin />
      </main>
    </div>
  )
}
