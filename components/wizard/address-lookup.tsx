'use client'

import { useRef, useState } from 'react'
import { MapPin, Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Suggestion {
  id: string
  line1: string
  line2: string
  city: string
  country: string
  postcode: string
  label: string
}

interface PhotonFeature {
  properties: {
    osm_id?: number
    name?: string
    housenumber?: string
    street?: string
    district?: string
    locality?: string
    city?: string
    county?: string
    state?: string
    country?: string
    postcode?: string
  }
}

function toSuggestion(f: PhotonFeature, i: number): Suggestion {
  const p = f.properties
  const street = [p.housenumber, p.street].filter(Boolean).join(' ')
  const line1 = street || p.name || ''
  const line2 = street && p.name && p.name !== street ? p.name : p.district || p.locality || ''
  const city = p.city || p.county || p.state || ''
  const label = [line1, line2, city, p.postcode, p.country].filter(Boolean).join(', ')
  return {
    id: `${p.osm_id ?? i}-${i}`,
    line1,
    line2,
    city,
    country: p.country || '',
    postcode: p.postcode || '',
    label,
  }
}

export function AddressLookup({
  prefix,
  title,
  onSelect,
}: {
  prefix: 'cur' | 'perm'
  title: string
  onSelect: (values: Record<string, string>) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const controller = useRef<AbortController | null>(null)

  function search(q: string) {
    setQuery(q)
    if (timer.current) clearTimeout(timer.current)
    if (q.trim().length < 4) {
      setResults([])
      setOpen(false)
      return
    }
    timer.current = setTimeout(async () => {
      controller.current?.abort()
      controller.current = new AbortController()
      setLoading(true)
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=en`,
          { signal: controller.current.signal },
        )
        const json = (await res.json()) as { features: PhotonFeature[] }
        setResults(json.features.map(toSuggestion).filter((s) => s.line1))
        setOpen(true)
      } catch {
        // aborted or offline — keep manual entry available
      } finally {
        setLoading(false)
      }
    }, 350)
  }

  function pick(s: Suggestion) {
    onSelect({
      [`${prefix}_addr1`]: s.line1,
      [`${prefix}_addr2`]: s.line2,
      [`${prefix}_city`]: s.city,
      [`${prefix}_country`]: s.country,
      [`${prefix}_postcode`]: s.postcode,
    })
    setQuery(s.label)
    setOpen(false)
  }

  const id = `${prefix}-lookup`

  return (
    <div className="relative grid gap-1.5 p-2 sm:col-span-2">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="size-3.5" /> {title} — smart lookup
      </Label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Start typing a street address…"
          className="pl-8"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
        />
        {loading && (
          <Loader2 className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute inset-x-2 top-full z-20 mt-1 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              No match — enter the address manually below.
            </li>
          ) : (
            results.map((s) => (
              <li key={s.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(s)}
                  className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-pretty">{s.label}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
