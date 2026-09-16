'use client'

import { useState, type ReactNode } from 'react'
import { Percent, Clock, ShieldCheck, Sparkles, CircleCheck, TriangleAlert } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import type { Request } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SpecialAdmissionPanel } from './special-admission'

const AGREED_DISCOUNTS = [
  { id: 'earlybird', label: 'Early-bird partner rate', pct: '10%' },
  { id: 'loyalty', label: 'Returning-agency loyalty', pct: '7.5%' },
  { id: 'scholarship', label: 'Regional scholarship (merit)', pct: '15%' },
]

function Block({
  icon,
  title,
  description,
  open,
  onToggle,
  children,
}: {
  icon: ReactNode
  title: string
  description: string
  open: boolean
  onToggle: (v: boolean) => void
  children?: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <label className="flex cursor-pointer items-start gap-3 p-4">
        <Checkbox checked={open} onCheckedChange={(v) => onToggle(v === true)} className="mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{icon}</span>
            <span className="text-sm font-medium">{title}</span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground text-pretty">{description}</p>
        </div>
      </label>
      {open && children && <div className="border-t border-border p-4">{children}</div>}
    </section>
  )
}

export function StepRequests() {
  const { requests, upsertRequest, removeRequest, notes, setNotes, courses, requirements } =
    useWizard()

  const englishOutstanding = requirements.some(
    (r) => r.category === 'english' && r.status !== 'met',
  )
  const otherGaps = requirements.filter(
    (r) =>
      r.category !== 'english' &&
      r.category !== 'course' &&
      (r.status === 'missing' || r.status === 'problem'),
  )

  const has = (t: Request['type']) => requests.some((r) => r.type === t)

  // A discount or special-admission request means the offer can't be issued
  // automatically — it routes to admissions review.
  const reviewReasons = [
    has('discount') && 'a discount',
    has('special-admission') && 'special admission',
  ].filter(Boolean) as string[]
  const needsReview = reviewReasons.length > 0

  const [discountId, setDiscountId] = useState('')
  const [customRate, setCustomRate] = useState('')
  const [insuranceMode, setInsuranceMode] = useState('up')
  const [ownReason, setOwnReason] = useState('')

  function toggleDiscount(open: boolean) {
    if (!open) return removeRequest('discount')
    upsertRequest({ type: 'discount', detail: 'Discount pending selection', status: 'pending' })
  }

  function toggleReady(open: boolean) {
    if (!open) return removeRequest('ready-to-commit')
    upsertRequest({
      type: 'ready-to-commit',
      detail: 'Student will accept and pay on unconditional offer.',
      status: 'pending',
    })
  }

  function applyInsurance(mode: string, reason?: string) {
    const detail =
      mode === 'up'
        ? 'UP-arranged (default)'
        : mode === 'own'
          ? `Own cover — ${reason || 'acceptable policy held'}`
          : 'Exempt — MFAT scholarship or PhD'
    upsertRequest({ type: 'insurance', detail, status: 'approved' })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-ai/25 bg-ai/5 p-4">
        <p className="flex items-center gap-1.5 text-sm font-medium text-ai">
          <Sparkles className="size-4" /> AI review
        </p>
        <div className="mt-2 flex flex-col gap-1.5 text-sm text-pretty">
          {otherGaps.length === 0 ? (
            <p className="flex items-start gap-1.5">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" />
              All submitted documents have been reviewed and meet requirements.
            </p>
          ) : (
            <p className="flex items-start gap-1.5">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
              {otherGaps.length} requirement{otherGaps.length === 1 ? '' : 's'} still need
              attention: {otherGaps.map((g) => g.label).join(', ')}.
            </p>
          )}
          {englishOutstanding && (
            <p className="flex items-start gap-1.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-warning" />
              <span>
                We&apos;re still awaiting the English test. You can continue and issue a{' '}
                <strong className="font-medium">conditional Letter of Offer</strong> now — the test
                can be uploaded and validated later.
              </span>
            </p>
          )}
          <p className="mt-1 text-muted-foreground">
            Are there any special admission requests, agreed discounts, or notes for admissions? Add
            them below, or continue straight to submit.
          </p>
        </div>
      </div>

      {needsReview && (
        <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 p-4">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
          <div className="text-sm text-pretty">
            <p className="font-medium text-warning">This application will go to admissions review</p>
            <p className="text-muted-foreground">
              Because you&apos;ve requested {reviewReasons.join(' and ')}, an offer can&apos;t be
              issued automatically on submission. Admissions will review and confirm the offer —
              expect a response within 2 working days.
            </p>
          </div>
        </div>
      )}

      <Block
        icon={<Percent className="size-4" />}
        title="Discount or scholarship"
        description="Selecting any option routes the application to admissions review."
        open={has('discount')}
        onToggle={toggleDiscount}
      >
        <RadioGroup
          value={discountId}
          onValueChange={(v: string) => {
            setDiscountId(v)
            const d = AGREED_DISCOUNTS.find((x) => x.id === v)
            upsertRequest({
              type: 'discount',
              detail: d ? `${d.label} (${d.pct})` : 'Custom rate requested',
              status: 'pending',
            })
          }}
          className="gap-2"
        >
          {AGREED_DISCOUNTS.map((d) => (
            <label key={d.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value={d.id} />
              {d.label} <span className="text-muted-foreground">· {d.pct}</span>
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <RadioGroupItem value="custom" />
            Request a rate
          </label>
        </RadioGroup>
        {discountId === 'custom' && (
          <div className="mt-3 grid gap-1.5">
            <Label htmlFor="rate">Requested rate</Label>
            <Input
              id="rate"
              value={customRate}
              onChange={(e) => {
                setCustomRate(e.target.value)
                upsertRequest({
                  type: 'discount',
                  detail: `Custom rate requested: ${e.target.value}`,
                  status: 'pending',
                })
              }}
              placeholder="e.g. 12% for this cohort"
            />
          </div>
        )}
      </Block>

      <Block
        icon={<Clock className="size-4" />}
        title="Ready to commit"
        description="The student will accept and pay on unconditional offer."
        open={has('ready-to-commit')}
        onToggle={toggleReady}
      >
        <p className="rounded-md bg-muted/50 p-2.5 text-sm text-muted-foreground text-pretty">
          UP&apos;s SLA: unconditional offer within 3 working days of conditions cleared.
        </p>
      </Block>

      <Block
        icon={<Sparkles className="size-4 text-ai" />}
        title="Special admission"
        description="Applying on experience in place of a formal qualification. Routes to human review."
        open={has('special-admission')}
        onToggle={(open) => {
          if (!open) removeRequest('special-admission')
        }}
      >
        <SpecialAdmissionPanel programmeName={courses[0]?.programmeName ?? 'This programme'} />
      </Block>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-start gap-2 p-4">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Insurance</p>
            <p className="mb-3 text-sm text-muted-foreground text-pretty">
              Insurance is compulsory. Choose a cover mode.
            </p>
            <RadioGroup
              value={insuranceMode}
              onValueChange={(v: string) => {
                setInsuranceMode(v)
                applyInsurance(v, ownReason)
              }}
            >
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <RadioGroupItem value="up" /> UP-arranged (default)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <RadioGroupItem value="own" /> Own cover — adds a pre-arrival condition
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <RadioGroupItem value="exempt" /> Exempt — MFAT scholarship or PhD only
              </label>
            </RadioGroup>
            {insuranceMode === 'own' && (
              <div className="mt-3 grid gap-1.5">
                <Label htmlFor="ownreason">Reason and evidence</Label>
                <Input
                  id="ownreason"
                  value={ownReason}
                  onChange={(e) => {
                    setOwnReason(e.target.value)
                    applyInsurance('own', e.target.value)
                  }}
                  placeholder="e.g. travelling with family on an acceptable policy"
                />
                <Button variant="outline" size="sm" className="w-fit">
                  Upload policy evidence (simulate)
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes to admissions
        </Label>
        <p className="mb-2 text-xs text-muted-foreground text-pretty">
          Anything here routes the application to admissions review.
        </p>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional free-text notes"
          rows={3}
        />
      </section>
    </div>
  )
}
