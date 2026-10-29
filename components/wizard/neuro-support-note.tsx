import { Sparkles } from 'lucide-react'
import { supportsNeurodiverse } from '@/lib/catalog'

export function NeuroSupportNote({ programmeName }: { programmeName?: string }) {
  if (!supportsNeurodiverse(programmeName)) return null
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-success/30 bg-success/10 p-3">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium">
          This course supports dyslexia, ADHD and neurodiverse learning
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
          {programmeName} offers learning support for neurodiverse students. Tell us below so
          UP can arrange it from day one.
        </p>
      </div>
    </div>
  )
}
