'use client'

import { Sparkles, ShieldCheck, CircleCheck, Eye, Lock } from 'lucide-react'
import type { Field } from '@/lib/types'
import { specFor } from '@/lib/field-specs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

function SourceMarker({
  field,
  docName,
  onViewDoc,
}: {
  field: Field
  docName?: string
  onViewDoc?: () => void
}) {
  if (field.source === 'up') {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        UP
      </span>
    )
  }
  if (field.kind === 'derived') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
        <Lock className="size-3" /> Calculated
      </span>
    )
  }
  if (field.source !== 'ai') return null
  const Icon = field.status === 'confirmed' ? CircleCheck : field.status === 'verified' ? ShieldCheck : Sparkles
  const tone =
    field.status === 'confirmed' || field.status === 'verified'
      ? 'text-success'
      : field.status === 'conflict'
        ? 'text-warning'
        : 'text-ai'
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={onViewDoc}
            className={cn(
              'inline-flex items-center gap-1 rounded px-1 text-[10px] font-medium',
              tone,
              onViewDoc && 'hover:bg-muted',
            )}
          />
        }
      >
        <Icon className="size-3" />
        {field.confidence != null && `${Math.round(field.confidence * 100)}%`}
        {onViewDoc && <Eye className="size-3 opacity-60" aria-hidden />}
      </TooltipTrigger>
      <TooltipContent>
        <span>
          From {docName ?? 'document'}
          {field.sourcePage ? `, page ${field.sourcePage}` : ''}
          {field.confidence != null ? ` · ${Math.round(field.confidence * 100)}% confidence` : ''}
          {onViewDoc ? ' · click to view' : ''}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

function Segmented({
  id,
  value,
  options,
  onChange,
  invalid,
}: {
  id: string
  value: string
  options: string[]
  onChange: (v: string) => void
  invalid?: boolean
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      aria-invalid={invalid}
      className="inline-flex w-fit rounded-md border border-input bg-background p-0.5"
    >
      {options.map((o) => {
        const on = value === o
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(on ? '' : o)}
            className={cn(
              'h-7 rounded px-3 text-sm transition-colors',
              on ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

export function FieldRow({
  field,
  docName,
  onChange,
  highlight,
  error,
  onViewDoc,
}: {
  field: Field
  docName?: string
  onChange: (value: string) => void
  highlight?: boolean
  error?: string | null
  onViewDoc?: () => void
}) {
  const spec = specFor(field.key)
  const locked = field.source === 'up' || field.kind === 'derived'
  const invalid = !!error
  const describedBy =
    [
      field.conflictNote && `${field.key}-conflict`,
      error && `${field.key}-error`,
      (field.hint || spec.note) && `${field.key}-hint`,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  let control: React.ReactNode
  if (spec.input === 'checkbox') {
    control = (
      <label className="flex items-center gap-2 text-sm">
        <input
          id={field.key}
          type="checkbox"
          checked={field.value === 'Yes'}
          onChange={(e) => onChange(e.target.checked ? 'Yes' : 'No')}
          className="size-4 accent-primary"
        />
        {field.label}
      </label>
    )
  } else if (!locked && (spec.input === 'yesno' || spec.input === 'segmented')) {
    control = (
      <Segmented
        id={field.key}
        value={field.value}
        options={spec.input === 'yesno' ? ['Yes', 'No'] : (spec.options ?? [])}
        onChange={onChange}
        invalid={invalid}
      />
    )
  } else if (!locked && spec.input === 'select') {
    control = (
      <select
        id={field.key}
        value={field.value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm"
      >
        <option value="">Select…</option>
        {(spec.options ?? []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
        {field.value && !spec.options?.includes(field.value) && (
          <option value={field.value}>{field.value}</option>
        )}
      </select>
    )
  } else {
    const type =
      spec.input === 'email' ? 'email' : spec.input === 'tel' ? 'tel' : spec.input === 'date' ? 'date' : 'text'
    control = (
      <Input
        id={field.key}
        type={type}
        inputMode={spec.input === 'year' ? 'numeric' : undefined}
        maxLength={spec.input === 'year' ? 4 : undefined}
        placeholder={spec.placeholder ?? (spec.input === 'year' ? 'YYYY' : undefined)}
        value={field.value}
        onChange={(e) => onChange(e.target.value)}
        disabled={locked}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={cn('h-8', locked && 'bg-muted/50')}
      />
    )
  }

  return (
    <div
      className={cn(
        'grid content-start gap-1.5 rounded-md p-2',
        highlight && 'bg-destructive/5 ring-1 ring-destructive/20',
      )}
    >
      {spec.input !== 'checkbox' && (
        <div className="flex items-center justify-between gap-2">
          <Label id={`${field.key}-label`} htmlFor={field.key} className="text-xs text-muted-foreground">
            {field.label}
            {field.required && !locked && <span className="ml-0.5 text-destructive">*</span>}
          </Label>
          <SourceMarker field={field} docName={docName} onViewDoc={onViewDoc} />
        </div>
      )}
      {control}
      {field.status === 'conflict' && field.conflictNote && (
        <div className="flex flex-col gap-1.5">
          <p id={`${field.key}-conflict`} className="text-xs text-foreground text-pretty">
            {field.conflictNote}
          </p>
          {field.conflictAlt && (
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onChange(field.value)}
                className="rounded border border-input bg-background px-2 py-1 text-xs hover:bg-muted"
              >
                Use passport: <span className="font-medium">{field.value}</span>
              </button>
              <button
                type="button"
                onClick={() => onChange(field.conflictAlt ?? '')}
                className="rounded border border-input bg-background px-2 py-1 text-xs hover:bg-muted"
              >
                Use typed: <span className="font-medium">{field.conflictAlt}</span>
              </button>
            </div>
          )}
        </div>
      )}
      {error && (
        <p id={`${field.key}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
      {(field.hint || spec.note) && !error && (
        <p id={`${field.key}-hint`} className="text-xs text-muted-foreground text-pretty">
          {field.hint ? `Suggested: ${field.hint}` : spec.note}
        </p>
      )}
    </div>
  )
}
