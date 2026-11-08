import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PageBand({
  title,
  eyebrow,
  meta,
  actions,
  className,
  innerClassName,
}: {
  title: ReactNode
  eyebrow?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  className?: string
  innerClassName?: string
}) {
  return (
    <section className={cn('bg-primary text-primary-foreground', className)}>
      <div
        className={cn(
          'mx-auto flex flex-wrap items-end justify-between gap-4 px-4 pb-8 pt-7 md:px-6',
          innerClassName,
        )}
      >
        <div className="flex min-w-0 flex-col gap-2">
          {eyebrow && <div className="text-sm text-primary-foreground/85">{eyebrow}</div>}
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">{title}</h1>
          {meta && <div className="text-sm text-primary-foreground/85">{meta}</div>}
          <span aria-hidden className="mt-2 h-1.5 w-24 bg-up-red" />
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </section>
  )
}
