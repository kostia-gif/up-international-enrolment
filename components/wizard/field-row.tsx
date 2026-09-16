'use client'

import { Sparkles, ShieldCheck, CircleCheck } from 'lucide-react'
import type { Field } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

function SourceMarker({ field, docName }: { field: Field; docName?: string }) {
  if (field.source === 'up') {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        UP
      </span>
    )
  }
  if (field.source !== 'ai') return null
  const Icon = field.status === 'confirmed' ? CircleCheck : field.status === 'verified' ? ShieldCheck : Sparkles
  const tone =
    field.status === 'confirmed' || field.status === 'verified'
      ? 'text-success'
      : field.status === 'conflict'
        ? 'text-destructive'
        : 'text-ai'
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            className={cn('inline-flex items-center gap-1 text-[10px] font-medium', tone)}
          />
        }
      >
        <Icon className="size-3" />
        {field.confidence != null && `${Math.round(field.confidence * 100)}%`}
      </TooltipTrigger>
      <TooltipContent>
        <span>
          From {docName ?? 'document'}
          {field.sourcePage ? `, page ${field.sourcePage}` : ''}
          {field.confidence != null ? ` · ${Math.round(field.confidence * 100)}% confidence` : ''}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

export function FieldRow({
  field,
  docName,
  onChange,
  highlight,
}: {
  field: Field
  docName?: string
  onChange: (value: string) => void
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'grid gap-1.5 rounded-md p-2',
        highlight && 'bg-destructive/5 ring-1 ring-destructive/20',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={field.key} className="text-xs text-muted-foreground">
          {field.label}
          {field.required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        <SourceMarker field={field} docName={docName} />
      </div>
      <Input
        id={field.key}
        value={field.value}
        onChange={(e) => onChange(e.target.value)}
        disabled={field.source === 'up'}
        aria-invalid={field.status === 'conflict'}
        className={cn('h-8', field.source === 'up' && 'bg-muted/50')}
      />
    </div>
  )
}
