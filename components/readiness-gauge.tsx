import { cn } from '@/lib/utils'
import type { Application } from '@/lib/types'
import {
  computeReadiness,
  evidenceProgress,
  fieldsProgress,
} from '@/lib/readiness'

function Dial({
  value,
  label,
  caption,
  done,
  tone,
  size = 72,
}: {
  value: number // 0..100
  label: string
  caption: string
  done: boolean
  tone: 'success' | 'ai'
  size?: number
}) {
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  const color = done
    ? 'var(--success)'
    : tone === 'ai'
      ? 'var(--ai)'
      : 'var(--muted-foreground)'
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums"
          style={{ color }}
        >
          {value}%
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground text-pretty">{caption}</p>
      </div>
    </div>
  )
}

export function ReadinessGauges({
  app,
  className,
}: {
  app: Application
  className?: string
}) {
  const readiness = computeReadiness(app)
  const ev = evidenceProgress(app)
  const evValue = Math.round((ev.done / ev.total) * 100)
  const looValue = fieldsProgress(app)

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Dial
        value={evValue}
        done={readiness.evidenceMet}
        tone="success"
        label="Evidence met"
        caption={
          readiness.evidenceMet
            ? 'Minimum evidence verified'
            : `${ev.done} of ${ev.total} evidence areas`
        }
      />
      <Dial
        value={looValue}
        done={readiness.looReady}
        tone="ai"
        label="LOO-ready"
        caption={
          readiness.looReady
            ? 'Ready to generate offer'
            : `${readiness.fieldsDone} of ${readiness.fieldsTotal} fields`
        }
      />
    </div>
  )
}
