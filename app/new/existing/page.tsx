import type { Metadata } from 'next'
import { AppHeader } from '@/components/app-header'
import { ExistingStudentPicker } from '@/components/existing-student-picker'

export const metadata: Metadata = {
  title: 'Add application for existing student — UP Enrol POC',
  description: 'Start a new application for a student already on file, carrying over their identity and academic history.',
}

export default function ExistingStudentPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <ExistingStudentPicker />
    </div>
  )
}
