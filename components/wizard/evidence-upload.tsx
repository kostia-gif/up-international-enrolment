'use client'

import { useRef, type ReactNode } from 'react'
import { Upload } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { delay } from '@/lib/simulate'
import { newIdSync } from '@/lib/id'
import { Button } from '@/components/ui/button'

// Adds real files picked by the agent as documents of a fixed type. The read
// is simulated: each file shows as reviewing, then checked.
export function EvidenceUpload({
  type,
  evidenceKind,
  disabled,
  children,
  variant = 'outline',
}: {
  type: string
  evidenceKind?: string
  disabled?: boolean
  children: ReactNode
  variant?: 'outline' | 'default'
}) {
  const { addDocumentRow, updateDocumentRow } = useWizard()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files) return
    for (const file of Array.from(files)) {
      const id = newIdSync('doc')
      const base = file.name.replace(/\.[^.]+$/, '').slice(0, 12)
      addDocumentRow({
        id,
        type,
        evidenceKind,
        fileName: '',
        originalName: file.name,
        language: 'English',
        status: 'reviewing',
        pages: 1,
        addedAt: new Date().toISOString(),
      })
      await delay(900)
      updateDocumentRow(id, { status: 'checked', fileName: `${type}_${base}.pdf` })
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <Button
        type="button"
        size="sm"
        variant={variant}
        className="gap-1.5"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-3.5" aria-hidden />
        {children}
      </Button>
    </>
  )
}
