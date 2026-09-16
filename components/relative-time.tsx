'use client'

import { useEffect, useState } from 'react'
import { formatDateTime, relativeTime } from '@/lib/format'

interface RelativeTimeProps {
  iso: string
  className?: string
  as?: 'time' | 'span'
}

// Relative time depends on the current clock, so computing it during SSR and
// again on the client produces a hydration mismatch (e.g. "13d ago" vs "12d
// ago"). We render a deterministic absolute timestamp on first paint — identical
// on server and client — then swap to the live relative label after mount.
export function RelativeTime({ iso, className, as = 'span' }: RelativeTimeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const label = mounted ? relativeTime(iso) : formatDateTime(iso)
  const title = formatDateTime(iso)

  if (as === 'time') {
    return (
      <time className={className} title={title} suppressHydrationWarning>
        {label}
      </time>
    )
  }
  return (
    <span className={className} title={title} suppressHydrationWarning>
      {label}
    </span>
  )
}
