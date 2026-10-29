'use client'

import { useId, useMemo, useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import {
  ADDRESS_COUNTRIES,
  formatAddress,
  hasAddressIndex,
  searchAddresses,
  type AddressMatch,
} from '@/lib/address-lookup'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export function AddressLookup({
  country,
  onCountryChange,
  onSelect,
}: {
  country: string
  onCountryChange: (country: string) => void
  onSelect: (address: AddressMatch) => void
}) {
  const baseId = useId()
  const listId = `${baseId}-list`
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)

  const results = useMemo(() => searchAddresses(country, query), [country, query])
  const indexed = country ? hasAddressIndex(country) : false
  const showList = open && query.trim().length >= 2

  const choose = (a: AddressMatch) => {
    onSelect(a)
    setPicked(formatAddress(a))
    setQuery('')
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (!showList || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/40 p-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${baseId}-country`} className="text-xs">
            1. Country
          </Label>
          <Select
            value={country || undefined}
            onValueChange={(v) => {
              onCountryChange(v)
              setPicked(null)
              setQuery('')
            }}
          >
            <SelectTrigger id={`${baseId}-country`} className="w-full bg-card">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {ADDRESS_COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex flex-col gap-1.5">
          <Label htmlFor={`${baseId}-search`} className="text-xs">
            2. Find address
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id={`${baseId}-search`}
              role="combobox"
              aria-expanded={showList}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
              autoComplete="off"
              disabled={!country}
              placeholder={country ? 'Start typing street or building' : 'Choose a country first'}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(0)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 120)}
              onKeyDown={onKeyDown}
              className="bg-card pl-8"
            />
          </div>

          {showList && (
            <ul
              id={listId}
              role="listbox"
              className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-md border border-border bg-popover p-1 shadow-md"
            >
              {results.length === 0 ? (
                <li className="px-3 py-2 text-xs text-muted-foreground text-pretty" role="option" aria-selected={false} aria-disabled>
                  {indexed
                    ? 'No matching address. Enter it manually below.'
                    : `Lookup isn't available for ${country} yet. Enter the address manually below.`}
                </li>
              ) : (
                results.map((a, i) => (
                  <li
                    key={formatAddress(a)}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      choose(a)
                    }}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      'flex cursor-pointer items-start gap-2 rounded-sm px-2.5 py-2 text-sm',
                      i === active && 'bg-accent text-accent-foreground',
                    )}
                  >
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-medium leading-tight">{a.line1}</span>
                      <span className="block text-xs text-muted-foreground">
                        {[a.line2, a.city, a.region, a.postcode].filter(Boolean).join(', ')}
                      </span>
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-pretty" aria-live="polite">
        {picked
          ? `Filled from lookup: ${picked}. Check the fields below.`
          : 'Pick the country, then search. Selecting an address fills the fields below, which you can still edit.'}
      </p>
    </div>
  )
}
