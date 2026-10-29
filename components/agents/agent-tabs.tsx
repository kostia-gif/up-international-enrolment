import Link from 'next/link'
import { listAgentProfiles } from '@/lib/agent-profiles'
import { StatusDot } from '@/components/agents/agent-controls'
import { cn } from '@/lib/utils'

export function AgentTabs({ activeId }: { activeId: string }) {
  const agents = listAgentProfiles()
  return (
    <nav aria-label="Agents">
      <ul className="flex flex-wrap gap-2">
        {agents.map((a) => {
          const active = a.id === activeId
          return (
            <li key={a.id}>
              <Link
                href={`/agents/${a.id}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:bg-muted',
                )}
              >
                <StatusDot status={a.status} />
                {a.name}
                <span className={cn('text-xs', active ? 'opacity-80' : 'text-muted-foreground')}>{a.status}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
