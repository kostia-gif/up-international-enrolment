'use client'

import { useState } from 'react'
import { FileSignature } from 'lucide-react'
import type { Application } from '@/lib/types'
import { LetterOfOfferPanel } from '@/components/letter-of-offer'
import { NewBadge } from '@/components/new-badge'
import { isNewOffer, OFFER_KIND_LABEL, offerLetters } from '@/lib/documents'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export function OfferLetters({ app, viewedAt }: { app: Application; viewedAt?: string }) {
  const letters = offerLetters(app)
  const latest = letters.at(-1)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  if (!latest) return null

  const selected = letters.find((l) => l.id === selectedId) ?? latest
  const newest = [...letters].reverse()

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">Letter of Offer</h2>
        {letters.length > 1 && (
          <p className="text-xs text-muted-foreground">
            {letters.length} versions · showing {selected.id === latest.id ? 'latest' : `v${letters.indexOf(selected) + 1}`}
          </p>
        )}
      </div>

      <LetterOfOfferPanel
        key={selected.id}
        data={{
          studentName: app.studentName,
          preId: app.preId,
          course: app.course,
          conditions: selected.conditions,
          hideCosts: !selected.includesPricing,
          agent: app.issuingAgent,
        }}
      />

      {letters.length > 1 && (
        <ol className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
          {newest.map((l) => {
            const version = letters.indexOf(l) + 1
            const isLatest = l.id === latest.id
            const active = l.id === selected.id
            return (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(l.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60',
                    active && 'bg-muted/60',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 grid size-7 shrink-0 place-items-center rounded-md text-[11px] font-semibold',
                      isLatest ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    v{version}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
                      {OFFER_KIND_LABEL[l.kind]}
                      {isLatest && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          Latest
                        </span>
                      )}
                      {isNewOffer(l, viewedAt) && <NewBadge />}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {formatDate(l.issuedAt)} · {l.issuedBy}
                      {l.conditions.length > 0 && ` · ${l.conditions.length} condition${l.conditions.length === 1 ? '' : 's'}`}
                    </span>
                    {l.note && <span className="mt-0.5 block text-xs text-muted-foreground text-pretty">{l.note}</span>}
                  </span>
                  <FileSignature
                    className={cn('mt-1 size-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')}
                    aria-hidden
                  />
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
