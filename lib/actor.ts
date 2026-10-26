import { Sparkles, User, Building2, type LucideIcon } from 'lucide-react'
import type { EventActor } from './types'

interface ActorMeta {
  label: string
  icon: LucideIcon
  chip: string
}

// Who did a thing, shown on the activity timeline.
export const actorMeta: Record<EventActor, ActorMeta> = {
  ai: { label: 'AI', icon: Sparkles, chip: 'bg-ai/12 text-ai' },
  agent: { label: 'Agent', icon: User, chip: 'bg-muted text-muted-foreground' },
  up: { label: 'UP', icon: Building2, chip: 'bg-info/12 text-info' },
}
