'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, Download, Share2, Copy, Send, FileText } from 'lucide-react'
import type { Course } from '@/lib/types'
import { formatDate } from '@/lib/format'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LooData {
  studentName: string
  preId: string
  course?: Course
  conditions: string[]
  bundle?: Course[]
}

const letterDate = () =>
  new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })

// The offer document itself — a branded, printable facsimile.
function LetterOfOfferDocument({ data }: { data: LooData }) {
  const { studentName, preId, course, conditions, bundle } = data
  const conditional = conditions.length > 0
  const rows: [string, string][] = [
    ['Programme', course?.programmeName ?? '—'],
    ['Provider', course?.brand ?? '—'],
    ['NZQF level', course?.level ?? '—'],
    ['Campus', course?.campus ?? '—'],
    ['Intake start', course ? formatDate(course.intakeDate) : '—'],
    ['Duration', course ? `${course.durationMonths} months` : '—'],
    ['Tuition', course?.priceBundle ?? '—'],
  ]

  return (
    <div className="bg-white text-foreground">
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
                <tr key={k} className={i % 2 ? 'bg-muted/40' : 'bg-white'}>
                  <td className="w-40 border-b border-border px-3 py-2 text-muted-foreground">
                    {k}
                  </td>
                  <td className="border-b border-border px-3 py-2 font-medium text-pretty">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bundle && bundle.length > 1 && (
          <p className="text-xs text-muted-foreground text-pretty">
            Bundle enrolment: {bundle.map((b) => b.programmeName).join(' → ')}.
          </p>
        )}

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

        <p className="text-pretty text-muted-foreground">
          This offer is subject to UP Education&apos;s terms of enrolment, the provision of genuine
          supporting documentation, and the granting of an appropriate student visa where required.
        </p>

        <div className="mt-2 border-t border-border pt-3">
          <p className="font-medium">Admissions Office</p>
          <p className="text-xs text-muted-foreground">UP Education · Auckland, New Zealand</p>
        </div>
      </div>
    </div>
  )
}

export function LetterOfOfferPanel({ data }: { data: LooData }) {
  const [preview, setPreview] = useState(false)
  const [share, setShare] = useState(false)
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

      <div className="flex flex-wrap gap-2 border-t border-border bg-muted/40 px-4 py-3">
        <Button size="sm" className="gap-1.5" onClick={() => setPreview(true)}>
          <Eye className="size-3.5" /> Preview
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => toast.success('Letter of Offer downloaded (PDF)')}
        >
          <Download className="size-3.5" /> Download
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShare(true)}>
          <Share2 className="size-3.5" /> Share
        </Button>
      </div>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-border p-4">
            <DialogTitle>
              {conditional ? 'Conditional Letter of Offer' : 'Letter of Offer'}
            </DialogTitle>
            <DialogDescription>Ref {data.preId} · preview</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto">
            <LetterOfOfferDocument data={data} />
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-border bg-muted/40 p-4">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => toast.success('Letter of Offer downloaded (PDF)')}
            >
              <Download className="size-3.5" /> Download PDF
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setPreview(false)
                setShare(true)
              }}
            >
              <Share2 className="size-3.5" /> Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={share} onOpenChange={setShare}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Letter of Offer</DialogTitle>
            <DialogDescription>
              Send the offer to {data.studentName} or copy a secure link.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="loo-link">Secure link</Label>
              <div className="flex gap-2">
                <Input id="loo-link" readOnly value={shareLink} className="font-mono text-xs" />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Copy link"
                  onClick={() => {
                    navigator.clipboard?.writeText(shareLink).catch(() => {})
                    toast.success('Link copied to clipboard')
                  }}
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>
            <form
              className="grid gap-1.5"
              onSubmit={(e) => {
                e.preventDefault()
                setShare(false)
                toast.success(`Offer emailed to ${data.studentName}`)
              }}
            >
              <Label htmlFor="loo-email">Email to student</Label>
              <div className="flex gap-2">
                <Input
                  id="loo-email"
                  type="email"
                  required
                  placeholder="student@example.com"
                  className="flex-1"
                />
                <Button type="submit" className="gap-1.5">
                  <Send className="size-4" /> Send
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
