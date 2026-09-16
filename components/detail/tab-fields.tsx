'use client'

import { useMemo } from 'react'
import { toast } from 'sonner'
import { CircleAlert } from 'lucide-react'
import type { Application } from '@/lib/types'
import { FIELD_SECTIONS } from '@/lib/blank-fields'
import { useStore } from '@/lib/store'
import { FieldRow } from '@/components/wizard/field-row'
import { Button } from '@/components/ui/button'

export function TabFields({ app }: { app: Application }) {
  const { setFieldValue, confirmAllAiFields } = useStore()

  const docName = (id?: string) => {
    const d = app.documents.find((x) => x.id === id)
    return d?.fileName || d?.originalName
  }

  const pendingAi = useMemo(
    () => app.fields.filter((f) => f.source === 'ai' && f.status === 'ai').length,
    [app.fields],
  )
  const conflicts = useMemo(
    () => app.fields.filter((f) => f.status === 'conflict'),
    [app.fields],
  )

  return (
    <div className="flex flex-col gap-6">
      {conflicts.length > 0 && (
        <section className="rounded-lg border border-destructive/25 bg-destructive/5 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-destructive">
            <CircleAlert className="size-4" /> Conflicts to resolve
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {conflicts.map((f) => (
              <FieldRow
                key={f.key}
                field={f}
                docName={docName(f.sourceDoc)}
                onChange={(v) => setFieldValue(app.id, f.key, v)}
                highlight
              />
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3">
        <div>
          <p className="text-sm font-medium">Confirm AI-populated fields</p>
          <p className="text-xs text-muted-foreground">
            {pendingAi > 0 ? `${pendingAi} field(s) awaiting confirmation` : 'All AI fields confirmed'}
          </p>
        </div>
        <Button
          size="sm"
          disabled={pendingAi === 0}
          onClick={() => {
            confirmAllAiFields(app.id)
            toast.success('AI fields confirmed')
          }}
        >
          Confirm all AI fields
        </Button>
      </div>

      {FIELD_SECTIONS.map((section) => {
        const sectionFields = app.fields.filter((f) => f.section === section)
        if (sectionFields.length === 0) return null
        return (
          <section key={section}>
            <h3 className="mb-2 text-sm font-semibold">{section}</h3>
            <div className="grid gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-2">
              {sectionFields.map((f) => (
                <FieldRow
                  key={f.key}
                  field={f}
                  docName={docName(f.sourceDoc)}
                  onChange={(v) => setFieldValue(app.id, f.key, v)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
