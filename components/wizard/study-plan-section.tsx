'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import type { CatalogProgramme } from '@/lib/catalog'
import { MAX_PLAN_BLOCKS, englishIntakeBefore, englishProgramme, monthYear } from '@/lib/study-plan'
import type { PlanRole } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { CoursePicker } from './course-picker'
import { PlanStrip } from './plan-strip'
import { DestinationPicker } from './destination-picker'

interface PendingPick {
  programme: CatalogProgramme
  intake: string
  role: Extract<PlanRole, 'after' | 'alternative'>
}

export function StudyPlanSection() {
  const { plan, setPrimary, addBlock, removeBlock, setDestination } = useWizard()
  const [adding, setAdding] = useState(false)
  const [pending, setPending] = useState<PendingPick | null>(null)

  const primary = plan.blocks.find((b) => b.role === 'primary')
  const english = englishProgramme()
  const englishIndex = plan.blocks.findIndex((b) => b.role === 'before' && b.programme.kind === 'english')
  const englishIntake =
    english && primary && primary.programme.kind !== 'english'
      ? englishIntakeBefore(english, primary.intake)
      : undefined
  const full = plan.blocks.length >= MAX_PLAN_BLOCKS
  const { isStudent } = useWizard()

  const toggleEnglish = (on: boolean) => {
    if (on && english && englishIntake) addBlock(english, englishIntake, 'before')
    if (!on && englishIndex >= 0) removeBlock(englishIndex)
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold">
          {isStudent ? 'What would you like to study?' : 'What is the student applying for?'}
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          {isStudent
            ? 'Pick your programme and start date. You can add an English course before it, or a university degree after a pathway.'
            : 'Pick the programme and intake. Add a destination degree or an English course if the plan needs one.'}
        </p>
      </div>

      {!primary ? (
        <CoursePicker onSelect={(p, intake) => setPrimary(p, intake)} />
      ) : (
        <div className="flex flex-col gap-4">
          <PlanStrip plan={plan} onRemove={removeBlock} />

          {primary.programme.kind === 'pathway' && primary.programme.pathwayUniversity && (
            <DestinationPicker
              key={primary.programme.id}
              university={primary.programme.pathwayUniversity}
              foundationIntake={primary.intake}
              foundationDurationMonths={primary.programme.durationMonths}
              value={primary.destination}
              onChange={setDestination}
            />
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {!full && !adding && !pending && (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <Plus className="size-4" aria-hidden /> Add another programme
              </button>
            )}
            {english && primary.programme.kind !== 'english' && (
              <label
                className={cn(
                  'inline-flex items-center gap-2 text-sm',
                  !englishIntake && englishIndex < 0 && 'opacity-60',
                )}
              >
                <Checkbox
                  checked={englishIndex >= 0}
                  disabled={!englishIntake && englishIndex < 0 || (full && englishIndex < 0)}
                  onCheckedChange={(v) => toggleEnglish(v === true)}
                />
                Needs English first?
                {englishIndex < 0 && (
                  <span className="text-xs text-muted-foreground">
                    {englishIntake
                      ? `${english.programmeName}, ${monthYear(englishIntake)}`
                      : 'No English intake finishes before this start'}
                  </span>
                )}
              </label>
            )}
          </div>

          {adding && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Add another programme</p>
                <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>
                  Cancel
                </Button>
              </div>
              <CoursePicker
                excludeIds={plan.blocks.map((b) => b.programme.id)}
                onSelect={(p, intake) => {
                  setAdding(false)
                  setPending({ programme: p, intake, role: intake > primary.intake ? 'after' : 'alternative' })
                }}
              />
            </div>
          )}

          {pending && (
            <fieldset className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
              <legend className="px-1 text-sm font-medium">
                {pending.programme.programmeName}, {monthYear(pending.intake)}
              </legend>
              <p className="text-sm text-muted-foreground">
                Is this in addition to, or instead of, {primary.programme.programmeName}?
              </p>
              {(['after', 'alternative'] as const).map((role) => (
                <label key={role} className="flex items-start gap-2 text-sm">
                  <input
                    type="radio"
                    name="plan-role"
                    className="mt-1 accent-primary"
                    checked={pending.role === role}
                    onChange={() => setPending({ ...pending, role })}
                  />
                  <span>
                    {role === 'after' ? 'In addition to the first programme (studied after)' : 'Instead of it (a second offer)'}
                  </span>
                </label>
              ))}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    addBlock(pending.programme, pending.intake, pending.role)
                    setPending(null)
                  }}
                >
                  Add to plan
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPending(null)}>
                  Cancel
                </Button>
              </div>
            </fieldset>
          )}
        </div>
      )}
    </section>
  )
}
