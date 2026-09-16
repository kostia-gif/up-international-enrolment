'use client'

import { useState, type DragEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// A drag-and-drop target used on outstanding-condition cards. In this prototype
// there is no real upload — dropping a file (or clicking) reports the file name
// so the caller can attach it and clear the condition. Keyboard-accessible via
// the underlying button.
export function ConditionDropzone({
  onFile,
  title,
  hint,
  icon,
  disabled,
  className,
}: {
  onFile: (fileName: string) => void
  title: string
  hint?: string
  icon: ReactNode
  disabled?: boolean
  className?: string
}) {
  const [over, setOver] = useState(false)

  function handleDrop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault()
    setOver(false)
    if (disabled) return
    const dropped = e.dataTransfer.files?.[0]?.name
    onFile(dropped ?? 'score_report.pdf')
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onFile('score_report.pdf')}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      className={cn(
        'group flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-6 text-center transition-colors',
        'hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60',
        over && 'border-primary bg-primary/10',
        className,
      )}
    >
      <span
        className={cn(
          'grid size-9 place-items-center rounded-full bg-muted text-muted-foreground transition-colors',
          over && 'bg-primary/15 text-primary',
        )}
      >
        {icon}
      </span>
      <span className="text-sm font-medium text-foreground text-pretty">{title}</span>
      {hint && <span className="text-xs text-muted-foreground text-pretty">{hint}</span>}
    </button>
  )
}
