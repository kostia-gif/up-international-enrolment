'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { FileUp, Sparkles } from 'lucide-react'
import type { Application, Condition } from '@/lib/types'
import { useStore } from '@/lib/store'
import { outstandingDocs, type OutstandingDoc } from '@/lib/dashboard'
import { ConditionDropzone } from '@/components/detail/condition-dropzone'
import { EnglishValidationDialog } from '@/components/detail/english-validation-dialog'

const isEnglishCondition = (c: Condition) => /english|ielts|pte|toefl/i.test(c.label)

// Inline "add documents" panel revealed on a selected board card. Lets the
// agent resolve outstanding evidence without opening the full application:
// English scores route through the two-step verify flow, everything else
// attaches straight to the requirement.
export function CardDropPanel({ app }: { app: Application }) {
  const { attachRequirementDoc } = useStore()
  const [englishOpen, setEnglishOpen] = useState(false)
  const items = outstandingDocs(app)

  const englishCondition =
    app.conditions.find((c) => c.status !== 'cleared' && isEnglishCondition(c)) ?? null

  function handleAttach(item: OutstandingDoc, fileName: string) {
    const moved = attachRequirementDoc(app.id, item.requirementId, fileName)
    if (moved) {
      toast.success(`${item.label} added — all evidence in, now with admissions`)
    } else {
      toast.success(`${item.label} added to ${app.studentName}'s file`)
    }
  }

  if (items.length === 0) return null

  return (
    <div
      className="mt-2.5 border-t border-border/60 pt-2.5"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Add outstanding documents
      </p>
      <div className="flex flex-col gap-1.5">
        {items.map((item) =>
          item.english ? (
            <ConditionDropzone
              key={item.requirementId}
              onFile={() => setEnglishOpen(true)}
              title="Drop English score to validate"
              hint="AI checks it, then confirms with the provider"
              icon={<Sparkles className="size-4" />}
              className="gap-1 px-3 py-3"
            />
          ) : (
            <ConditionDropzone
              key={item.requirementId}
              onFile={(name) => handleAttach(item, name)}
              title={`Drop ${item.label.toLowerCase()}`}
              hint="Adds to the file and clears this item"
              icon={<FileUp className="size-4" />}
              className="gap-1 px-3 py-3"
            />
          ),
        )}
      </div>

      <EnglishValidationDialog
        app={app}
        condition={englishCondition}
        open={englishOpen}
        onOpenChange={setEnglishOpen}
      />
    </div>
  )
}
