import { cn } from '@/lib/utils'

export function NewBadge({ className, label = 'New' }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-success px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-wide text-success-foreground',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-success-foreground/90" aria-hidden />
      {label}
    </span>
  )
}

export function NewCount({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-success px-1.5 text-[10px] font-semibold leading-5 text-success-foreground tabular-nums">
      {count}
      <span className="sr-only"> new</span>
    </span>
  )
}
