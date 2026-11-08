'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, Download, Copy, Send, FileText } from 'lucide-react'
import type { Course, IssuingAgent } from '@/lib/types'
import { formatDate } from '@/lib/format'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export interface LooData {
  studentName: string
  preId: string
  course?: Course
  conditions: string[]
  // Agent-generated conditional offers must not quote fees; admissions
  // confirms pricing on the unconditional offer.
  hideCosts?: boolean
  agent?: IssuingAgent
  studentEmail?: string
  // Study-plan blocks before/after the primary, in order, as one line.
  pathway?: string
  // Programmes applied for in parallel; each gets its own offer.
  alternatives?: string[]
}

const letterDate = () =>
  new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })

// The offer document itself — a branded, printable facsimile.
function LetterOfOfferDocument({ data, draft = false }: { data: LooData; draft?: boolean }) {
  const { studentName, preId, course, conditions } = data
  const conditional = conditions.length > 0
  const hideCosts = data.hideCosts && conditional
  const rows: [string, string][] = [
    ['Programme', course?.programmeName ?? '—'],
    ['Provider', course?.brand ?? '—'],
    ['NZQF level', course?.level ?? '—'],
    [
      'Location',
      course ? (course.delivery === 'online' ? 'Online (studied from home country)' : course.campus) : '—',
    ],
    ['Intake start', course ? formatDate(course.intakeDate) : '—'],
    ['Duration', course ? `${course.durationMonths} months` : '—'],
    ...(hideCosts ? [] : ([['Tuition', course?.priceBundle ?? '—']] as [string, string][])),
    ...(data.pathway ? ([['Intended pathway', data.pathway]] as [string, string][]) : []),
  ]

  return (
    <div className="bg-card text-foreground">
      {draft && (
        <p className="bg-warning/15 px-6 py-1.5 text-center text-xs font-semibold text-foreground">
          Preview — not yet issued. Final reference and date are set when you submit.
        </p>
      )}
      <div className="flex items-center justify-between gap-3 bg-brand px-6 py-4 text-brand-foreground">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-sm font-black leading-none tracking-tight text-primary-foreground">
            UP
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">UP Education</p>
            <p className="text-[11px] text-brand-foreground/70">New Zealand</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">
            {conditional ? 'Conditional Letter of Offer' : 'Letter of Offer'}
          </p>
          <p className="text-[11px] text-brand-foreground/70">Ref {preId}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-6 py-5 text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground">{letterDate()}</p>
        <p>
          Dear <span className="font-medium">{studentName}</span>,
        </p>
        <p className="text-pretty">
          We are pleased to offer you a place in the following programme of study at UP Education.
          {conditional
            ? ' This offer is conditional — please satisfy the conditions listed below to convert it to an unconditional offer.'
            : ' This is an unconditional offer of place.'}
        </p>

        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <tbody>
              {rows.map(([k, v], i) => (
                <tr key={k} className={i % 2 ? 'bg-muted/40' : 'bg-card'}>
                  <td className="w-40 border-b border-border px-3 py-2 text-muted-foreground">
                    {k}
                  </td>
                  <td className="border-b border-border px-3 py-2 font-medium text-pretty">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.alternatives?.map((name) => (
          <p key={name} className="text-xs text-muted-foreground text-pretty">
            A separate offer will be issued for {name}.
          </p>
        ))}

        {conditional && (
          <div>
            <p className="font-medium">Conditions of this offer</p>
            <ol className="mt-1 ml-5 list-decimal space-y-1 text-pretty">
              {conditions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          </div>
        )}

        {hideCosts && (
          <p className="text-pretty text-muted-foreground">
            Tuition fees and payment details will be confirmed on your unconditional Letter of
            Offer.
          </p>
        )}

        <p className="text-pretty text-muted-foreground">
          This offer is subject to UP Education&apos;s terms of enrolment, the provision of genuine
          supporting documentation, and the granting of an appropriate student visa where required.
        </p>

        <div className="mt-2 grid gap-4 border-t border-border pt-3 sm:grid-cols-2">
          <div>
            <p className="font-medium">Admissions Office</p>
            <p className="text-xs text-muted-foreground">UP Education · Auckland, New Zealand</p>
          </div>
          {data.agent && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Issued through your education agent
              </p>
              <p className="font-medium">{data.agent.name}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {data.agent.agency}
                {data.agent.agentCode ? ` · Agent code ${data.agent.agentCode}` : ''}
                <br />
                {[data.agent.email, data.agent.phone].filter(Boolean).join(' · ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Full-size preview of the letter, used before submit (draft) and after issue.
export function LetterOfOfferPreviewDialog({
  data,
  open,
  onOpenChange,
  draft = false,
}: {
  data: LooData
  open: boolean
  onOpenChange: (open: boolean) => void
  draft?: boolean
}) {
  const conditional = data.conditions.length > 0
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border p-4">
          <DialogTitle>{conditional ? 'Conditional Letter of Offer' : 'Letter of Offer'}</DialogTitle>
          <DialogDescription>
            {draft ? 'Preview of the letter that is created when you submit' : `Ref ${data.preId}`}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <LetterOfOfferDocument data={data} draft={draft} />
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-border bg-muted/40 p-4">
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() =>
              toast.success(draft ? 'Draft Letter of Offer downloaded (PDF)' : 'Letter of Offer downloaded (PDF)')
            }
          >
            <Download className="size-3.5" aria-hidden /> {draft ? 'Download draft PDF' : 'Download PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function LetterOfOfferPanel({ data, defaultEmail = true }: { data: LooData; defaultEmail?: boolean }) {
  const [preview, setPreview] = useState(false)
  const [upEmails, setUpEmails] = useState(defaultEmail)
  const conditional = data.conditions.length > 0
  const shareLink = `https://offers.up.education/loo/${data.preId}`

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
          <FileText className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {conditional ? 'Conditional Letter of Offer' : 'Letter of Offer'}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {data.studentName} · {data.course?.programmeName ?? '—'}
          </p>
        </div>
      </div>

      <div className="max-h-64 overflow-hidden">
        {/* Compact live preview of the letter */}
        <div className="pointer-events-none origin-top scale-[0.92]">
          <LetterOfOfferDocument data={data} />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border bg-muted/40 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => toast.success('Letter of Offer downloaded (PDF)')}
          >
            <Download className="size-3.5" /> Download PDF
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setPreview(true)}>
            <Eye className="size-3.5" /> Preview
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              navigator.clipboard?.writeText(shareLink).catch(() => {})
              toast.success('Secure link copied')
            }}
          >
            <Copy className="size-3.5" /> Copy secure link
          </Button>
        </div>
        <div className="flex items-start gap-2.5 rounded-md border border-border bg-card p-3">
          <Checkbox
            id="loo-up-email"
            checked={upEmails}
            onCheckedChange={(v) => {
              setUpEmails(v === true)
              toast(v === true ? 'UP will email the offer to the student' : 'UP won’t email the student')
            }}
            className="mt-0.5"
          />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="loo-up-email" className="text-sm font-medium">
              <Send className="size-3.5 text-primary" aria-hidden />
              UP will email {conditional ? 'Conditional LoO' : 'the Letter of Offer'} to the
              student
            </Label>
            <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
              {upEmails
                ? `Sent from admissions to ${data.studentEmail ?? 'the student’s email on file'}, with you in copy.`
                : 'Off. Nothing is sent to the student, so download the offer or share the secure link yourself.'}
            </p>
          </div>
        </div>
      </div>

      <LetterOfOfferPreviewDialog data={data} open={preview} onOpenChange={setPreview} />
    </div>
  )
}
