'use client'

import { useEffect, useState } from 'react'

function format(ms: number): string {
  const totalMin = Math.max(0, Math.floor(ms / 60000))
  const days = Math.floor(totalMin / 1440)
  const hrs = Math.floor((totalMin % 1440) / 60)
  const mins = totalMin % 60
  if (days > 0) return `${days}d ${hrs}h`
  if (hrs > 0) return `${hrs}h ${mins}m`
  return `${mins}m`
}

// Live time since the application was created. Renders nothing until mounted so
// the server and first client paint match (avoids a Date.now() hydration gap),
// then ticks every minute to show the case is being tracked.
export function ElapsedTracker({ iso, suffix = ' in progress' }: { iso: string; suffix?: string }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(t)
  }, [])

  const start = new Date(iso).getTime()
  const label = now === null ? '—' : `${format(now - start)}${suffix}`

  return <span suppressHydrationWarning>{label}</span>
}
