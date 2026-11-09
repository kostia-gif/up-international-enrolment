import type { Metadata } from 'next'
import { StudentHeader } from '@/components/student/student-header'
import { StudentLanding } from '@/components/student/student-landing'

export const metadata: Metadata = {
  title: 'Apply to UP Education — Student portal',
  description:
    'Apply directly to study in New Zealand with UP Education, find courses you are eligible for, and track your offer.',
}

export default function StudentPortalPage() {
  return (
    <div className="min-h-screen">
      <StudentHeader />
      <StudentLanding />
    </div>
  )
}
