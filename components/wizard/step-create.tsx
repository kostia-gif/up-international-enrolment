'use client'

import { FileText } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StudyPlanSection } from './study-plan-section'

export function StepCreate() {
  const { planComplete, student, setStudent, agentRef, setAgentRef } = useWizard()

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Who is applying?</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            Name the application so you can find it later. The passport confirms the spelling in
            the next step; your own CRM reference is optional.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="given-name">Given name</Label>
            <Input
              id="given-name"
              autoComplete="off"
              value={student.given}
              onChange={(e) => setStudent({ given: e.target.value })}
              placeholder="As in the passport"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="family-name">Family name</Label>
            <Input
              id="family-name"
              autoComplete="off"
              value={student.family}
              onChange={(e) => setStudent({ family: e.target.value })}
              placeholder="As in the passport"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agent-ref">
              Agent ID <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="agent-ref"
              autoComplete="off"
              value={agentRef}
              onChange={(e) => setAgentRef(e.target.value)}
              placeholder="Your CRM reference"
              className="font-mono"
            />
          </div>
        </div>
      </section>

      <StudyPlanSection />

      {planComplete && (
        <section className="flex items-start gap-3 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          <FileText className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="text-pretty">
            Next, drop the passport, transcripts and English test. Each file is read, translated
            if needed and checked against the document requirements for this course.
          </p>
        </section>
      )}
    </div>
  )
}
