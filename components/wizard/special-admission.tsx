'use client'

import { useState } from 'react'
import { Sparkles, CircleCheck, CircleDashed, Info } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

// One-item-at-a-time guided case for special admission. The AI states the
// alternative this programme accepts, tracks what is uploaded against it, and
// asks for the next missing item.
const CHECKLIST = [
  { key: 'experience', label: '3+ years relevant professional experience' },
  { key: 'reference1', label: 'First professional reference (manager)' },
  { key: 'reference2', label: 'Second professional reference' },
  { key: 'summary', label: 'Role summary and responsibilities' },
]

export function SpecialAdmissionPanel({ programmeName }: { programmeName: string }) {
  const { upsertRequest, requests } = useWizard()
  const existing = requests.find((r) => r.type === 'special-admission')
  const [done, setDone] = useState<Record<string, boolean>>(
    existing
      ? { experience: true, reference1: true, summary: true }
      : {},
  )
  const [years, setYears] = useState(existing?.caseFile?.experienceYears?.toString() ?? '')
  const [summary, setSummary] = useState(existing?.caseFile?.summary ?? '')

  const nextItem = CHECKLIST.find((c) => !done[c.key])
  const allDone = !nextItem

  function markDone(key: string) {
    setDone((d) => ({ ...d, [key]: true }))
  }

  function submitCase() {
    upsertRequest({
      type: 'special-admission',
      detail: `Applying on ${years || 'N'} years professional experience in place of a formal qualification.`,
      status: 'pending',
      caseFile: {
        experienceYears: Number(years) || 0,
        roleLevel: 'Provided in summary',
        references: ['Reference 1 (uploaded)', 'Reference 2 (uploaded)'],
        summary: summary || 'Case summary provided by agent.',
      },
    })
    toast.success('Special admission case attached', {
      description: 'This routes the application to human review.',
    })
  }

  return (
    <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
      <div className="mb-3 flex items-start gap-2">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-ai" />
        <div>
          <p className="text-sm font-medium">Special admission</p>
          <p className="text-sm text-muted-foreground text-pretty">
            {programmeName} accepts <strong>3+ years in a supervisory role plus two references</strong>{' '}
            in place of a formal qualification.
          </p>
        </div>
      </div>

      <div className="mb-3 flex items-start gap-2 rounded-md border border-border bg-card p-2.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        <p className="text-pretty">
          Similar profiles for this programme were typically admitted with 4 years&apos; experience and a
          manager reference.
        </p>
      </div>

      <ul className="mb-4 flex flex-col gap-2">
        {CHECKLIST.map((c) => (
          <li key={c.key} className="flex items-center gap-2 text-sm">
            {done[c.key] ? (
              <CircleCheck className="size-4 text-success" />
            ) : (
              <CircleDashed className="size-4 text-muted-foreground" />
            )}
            <span className={done[c.key] ? 'text-foreground' : 'text-muted-foreground'}>
              {c.label}
            </span>
          </li>
        ))}
      </ul>

      {!allDone && (
        <div className="rounded-md border border-border bg-card p-3">
          <p className="mb-2 text-sm font-medium">Next: {nextItem?.label}</p>
          {nextItem?.key === 'experience' && (
            <div className="flex items-end gap-2">
              <div className="grid flex-1 gap-1.5">
                <Label htmlFor="years">Years of experience</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="e.g. 4"
                />
              </div>
              <Button size="sm" disabled={!years} onClick={() => markDone('experience')}>
                Add
              </Button>
            </div>
          )}
          {nextItem?.key === 'summary' && (
            <div className="grid gap-2">
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describe the role, seniority and responsibilities."
                rows={3}
              />
              <Button size="sm" disabled={!summary} onClick={() => markDone('summary')} className="w-fit">
                Add summary
              </Button>
            </div>
          )}
          {(nextItem?.key === 'reference1' || nextItem?.key === 'reference2') && (
            <Button size="sm" variant="outline" onClick={() => markDone(nextItem.key)}>
              Upload reference (simulate)
            </Button>
          )}
        </div>
      )}

      {allDone && (
        <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/5 p-3">
          <p className="text-sm text-pretty">
            Case complete. This will be attached as a special-admission request and routed to human
            review.
          </p>
          <Button size="sm" onClick={submitCase} disabled={!!existing}>
            {existing ? 'Attached' : 'Attach case'}
          </Button>
        </div>
      )}
    </div>
  )
}
