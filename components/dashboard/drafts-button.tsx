'use client'

import Link from 'next/link'
import { ArrowRight, FilePen } from 'lucide-react'
import type { Application } from '@/lib/types'
import { shortProgramme } from '@/lib/format'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'

export function DraftsButton({ drafts }: { drafts: Application[] }) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
        <FilePen className="size-3.5" />
        Drafts
        <span className="rounded bg-muted px-1.5 text-[11px] tabular-nums text-foreground">
          {drafts.length}
        </span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Drafts</PopoverTitle>
        </PopoverHeader>
        {drafts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No drafts in progress.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {drafts.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/applications/${d.id}`}
                  className="group flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">{d.studentName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {shortProgramme(d.course.programmeName)} · {d.daysInStage}d
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                    Continue
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}
