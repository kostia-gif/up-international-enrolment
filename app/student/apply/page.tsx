'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { WizardProvider } from '@/lib/wizard'
import { WizardShell } from '@/components/wizard/wizard-shell'
import { StudentHeader } from '@/components/student/student-header'

// The same wizard agents use, driven by the student. ?start=discover opens the
// "show me what I can apply for" route; ?course=<id> arrives from a course page.
function StudentApplication() {
  const params = useSearchParams()
  const start = params.get('start') === 'discover' ? 'discover' : 'course'
  const course = params.get('course')
  return (
    <WizardProvider
      key={`${start}-${course ?? ''}`}
      audience="student"
      initialEntryMode={start}
      seedProgrammeId={course}
    >
      <WizardShell />
    </WizardProvider>
  )
}

export default function StudentApplyPage() {
  return (
    <div className="min-h-screen">
      <StudentHeader />
      <Suspense fallback={null}>
        <StudentApplication />
      </Suspense>
    </div>
  )
}
