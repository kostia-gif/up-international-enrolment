import Link from 'next/link'
import { ArrowLeft, ArrowRight, GraduationCap, Scale, Gift, type LucideIcon } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { ANNOUNCEMENTS, type AnnouncementKind } from '@/lib/news'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'News & offers — UP Apply',
  description: 'New courses, partner offers and policy updates for UP Education agents.',
}

const KIND_STYLE: Record<AnnouncementKind, { icon: LucideIcon; wrap: string; chip: string }> = {
  course: { icon: GraduationCap, wrap: 'bg-primary/10 text-primary', chip: 'bg-primary/10 text-primary' },
  policy: { icon: Scale, wrap: 'bg-info/10 text-info', chip: 'bg-info/10 text-info' },
  offer: { icon: Gift, wrap: 'bg-warning/10 text-warning', chip: 'bg-warning/10 text-warning' },
}

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-[900px] px-4 py-8 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <header className="mt-4">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">News &amp; offers</h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            New programmes, partner offers and policy updates. Ask UP Advisor on the dashboard for
            tailored guidance on any of these.
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-4">
          {ANNOUNCEMENTS.map((a) => {
            const style = KIND_STYLE[a.kind]
            const Icon = style.icon
            return (
              <article
                key={a.id}
                className={cn(
                  'rounded-xl border bg-card p-5',
                  a.urgent ? 'border-warning/40' : 'border-border',
                )}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-lg',
                      style.wrap,
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                          style.chip,
                        )}
                      >
                        {a.tag}
                      </span>
                      {a.urgent && (
                        <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
                          Filling fast
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-balance">{a.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {a.detail}
                    </p>
                    {a.href && a.cta && (
                      <div className="mt-4">
                        <Button
                          render={<Link href={a.href} />}
                          nativeButton={false}
                          size="sm"
                          variant={a.kind === 'course' ? 'default' : 'outline'}
                          className="gap-1.5"
                        >
                          {a.cta}
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
