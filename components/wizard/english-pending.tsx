'use client'

import { CalendarClock, CircleCheck } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import type { Field } from '@/lib/types'

export const ENGLISH_PENDING_KEY = 'english_arranged'
const TEST_KEYS = ['english_test_type', 'english_test_score', 'english_test_date', 'english_test_expiry']

export function hasEnglishResult(fields: Field[]) {
  return TEST_KEYS.some((k) => (fields.find((f) => f.key === k)?.value ?? '').trim() !== '')
}

export function isEnglishPending(fields: Field[]) {
  return fields.find((f) => f.key === ENGLISH_PENDING_KEY)?.value === 'Yes'
}

export function EnglishPending({
  fields,
  onChange,
}: {
  fields: Field[]
  onChange: (pending: boolean) => void
}) {
  if (hasEnglishResult(fields)) {
    const type = fields.find((f) => f.key === 'english_test_type')?.value
    const score = fields.find((f) => f.key === 'english_test_score')?.value
    return (
      <p className="flex items-center gap-1.5 text-xs text-success">
        <CircleCheck className="size-3.5 shrink-0" aria-hidden />
        Pre-filled from the uploaded English test
        {type ? ` (${type}${score ? ` ${score}` : ''})` : ''}. Check the details below.
      </p>
    )
  }

  const pending = isEnglishPending(fields)
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">
        No English test was found in the uploaded documents. Enter the result below, or confirm
        you&apos;ll arrange one.
      </p>
      <label htmlFor="english-pending" className="flex cursor-pointer items-start gap-2.5">
        <Checkbox
          id="english-pending"
          checked={pending}
          onCheckedChange={(v) => onChange(v === true)}
          className="mt-0.5"
        />
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">
            Agent will arrange an English test and provide evidence later
          </span>
          <span className="text-xs leading-relaxed text-muted-foreground">
            The application can continue. The English result becomes a condition of the offer.
          </span>
        </span>
      </label>
      {pending && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-warning">
          <CalendarClock className="size-3.5 shrink-0" aria-hidden />
          English test to follow: added as an outstanding condition
        </p>
      )}
    </div>
  )
}
