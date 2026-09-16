'use client'

import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'

function fmt(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

// Live count-up since the application was submitted — shows the agent that the
// turnaround is actively being tracked.
export function TrackingTimer({ label = 'Time since submission' }: { label?: string }) {
  const [start] = useState(() => Date.now())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(id)
  }, [start])

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
      <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
        <Timer className="size-5" />
      </span>
      <div className="flex-1">
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span className="inline-block size-1.5 animate-pulse rounded-full bg-success" aria-hidden />
          {label}
        </p>
        <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight">
          {fmt(elapsed)}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-xs text-muted-foreground">Target turnaround</p>
        <p className="text-sm font-medium">2 working days</p>
      </div>
    </div>
  )
}
