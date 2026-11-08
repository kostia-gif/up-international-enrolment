import { CircleDashed, CircleDotDashed } from 'lucide-react'

export function RequestStatusIcon({ requested }: { requested: boolean }) {
  return requested ? (
    <CircleDotDashed className="size-4 shrink-0 text-primary" aria-label="Request added" />
  ) : (
    <CircleDashed className="size-4 shrink-0 text-muted-foreground" aria-label="Not added" />
  )
}
