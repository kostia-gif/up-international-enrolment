import type { Metadata } from 'next'
import { AppHeader } from '@/components/app-header'
import { ExistingStudentPicker } from '@/components/existing-student-picker'

export const metadata: Metadata = {
  title: 'Add application for existing student — UP Enrol POC',
  description: 'Start a new application for a student already on file by copying in their details, answers and documents.',
}

export default function ExistingStudentPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <ExistingStudentPicker />
    </div>
  )
}
