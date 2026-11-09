import Link from 'next/link'
import { ArrowRight, BookOpen, KeyRound, Link2, ScanSearch } from 'lucide-react'
import { CATALOG } from '@/lib/catalog'
import { Button } from '@/components/ui/button'

// Stand-ins for the "Apply now" button on public course pages, which link
// into the portal with the course already chosen.
const COURSE_PAGE_LINKS = ['yoobee-software-7', 'nzma-cookery-4', 'upic-foundation']
  .map((id) => CATALOG.find((p) => p.id === id))
  .filter((p): p is (typeof CATALOG)[number] => Boolean(p))

const STARTS = [
  {
    href: '/student/apply?start=course',
    icon: BookOpen,
    title: 'I know which course I want',
    detail: 'Search our programmes, choose a start date and apply.',
    cta: 'Choose a course',
  },
  {
    href: '/student/apply?start=discover',
    icon: ScanSearch,
    title: 'Show me what I can apply for',
    detail:
      'Upload your passport, transcripts and English test. We read them and list the courses you meet the entry for.',
    cta: 'Upload documents',
  },
]

export function StudentLanding() {
  return (
    <main>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img
          src="/images/student-portal-hero.png"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-3 px-4 pt-14 pb-16 md:px-6 md:pt-20 md:pb-24">
          <p className="text-sm font-semibold text-primary-foreground/90">
            NZMA · Yoobee · UP International College · NZ Teaching College
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance md:text-5xl">
            Apply to study in New Zealand
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-primary-foreground/90 text-pretty">
            Apply to UP Education directly. Your documents are read and checked as you upload them,
            and you can follow your application and accept your offer online.
          </p>
          <span aria-hidden className="mt-3 h-1.5 w-24 bg-up-red" />
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 md:px-6">
        <section aria-labelledby="start-heading" className="flex flex-col gap-4">
          <h2 id="start-heading" className="text-xl font-semibold">
            Start your application
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {STARTS.map(({ href, icon: Icon, title, detail, cta }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-4 border border-border bg-card p-6 transition-colors hover:border-primary"
              >
                <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="text-lg font-semibold">{title}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground text-pretty">{detail}</span>
                </span>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section aria-labelledby="course-page-heading" className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 id="course-page-heading" className="flex items-center gap-2 text-base font-semibold">
                <Link2 className="size-4 text-muted-foreground" aria-hidden />
                Coming from a course page
              </h2>
              <p className="text-sm text-muted-foreground text-pretty">
                &quot;Apply now&quot; on a course page opens your application with that course
                already chosen. Try one:
              </p>
            </div>
            <ul className="flex flex-col divide-y divide-border border border-border bg-card">
              {COURSE_PAGE_LINKS.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/student/apply?course=${p.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-sm font-medium text-pretty">{p.programmeName}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.brand} · {p.campus} · {p.priceBundle}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-primary">Apply now</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="signin-heading"
            className="flex flex-col gap-4 self-start border border-border bg-card p-6"
          >
            <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary">
              <KeyRound className="size-5" aria-hidden />
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 id="signin-heading" className="text-lg font-semibold">
                Already applied?
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                Sign in with a one-time code to see what&apos;s outstanding, download your Letter
                of Offer and accept it online. No password needed.
              </p>
            </div>
            <Button render={<Link href="/student/login" />} nativeButton={false} className="w-fit gap-1.5">
              Sign in <ArrowRight className="size-4" aria-hidden />
            </Button>
          </section>
        </div>
      </div>
    </main>
  )
}
