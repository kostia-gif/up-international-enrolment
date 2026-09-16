// News, offers and policy updates surfaced on the homepage and used as
// knowledge by the UP Advisor. All content is mock data for the prototype.

export type AnnouncementKind = 'course' | 'offer' | 'policy'

export interface Announcement {
  id: string
  kind: AnnouncementKind
  tag: string
  title: string
  blurb: string // short copy shown on the homepage card
  detail: string // longer body the advisor and the news page draw on
  urgent?: boolean
  href?: string
  cta?: string
  // A prompt the UP Advisor can answer directly about this item.
  ask?: string
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'applied-ai-masters',
    kind: 'course',
    tag: 'New programme',
    title: 'Master of Applied AI now open',
    blurb:
      'Yoobee’s new Master of Applied Artificial Intelligence (Level 9) is live — the September intake is filling fast.',
    detail:
      'The Master of Applied Artificial Intelligence (Level 9, NZQA-approved) is an 18-month postgraduate programme delivered on the Auckland campus by Yoobee, priced at NZD 39,900. It covers applied machine learning, generative AI systems, MLOps and an industry capstone. Entry requires a recognised bachelor’s degree (any discipline) plus IELTS 6.5 (or equivalent); applicants without a degree can be considered on 5+ years of relevant industry experience via special admission. Graduates qualify for post-study work rights. The September 2026 intake is close to capacity — February and July 2027 intakes are also open.',
    urgent: true,
    href: '/new',
    cta: 'Start an application',
    ask: 'Tell me about the new Master of Applied AI',
  },
  {
    id: 'migration-2027',
    kind: 'policy',
    tag: 'Immigration update',
    title: 'Post-study work visa changes for 2027',
    blurb:
      'New settings extend post-study work rights for Level 7+ graduates and tighten evidence for lower-level pathways.',
    detail:
      'From the 2027 intakes, the updated immigration settings extend post-study work visa eligibility to three years for graduates of degree-level (Level 7) and higher programmes, including the new Master of Applied AI. Sub-degree pathway and vocational students (Levels 4–6) keep a shorter, programme-linked work entitlement and now face stricter genuine-student and financial-evidence checks at the visa stage. Practical impact for agents: encourage students aiming for long-term work outcomes toward Level 7+ programmes, and make sure funds and English evidence are captured early for pathway applicants to avoid visa delays. These rules affect the visa stage only — UP admissions decisions and conditional offers are unchanged.',
    href: '/news',
    cta: 'Read the briefing',
    ask: 'Explain the new migration law and how it affects my students',
  },
  {
    id: 'feb-2027-scholarship',
    kind: 'offer',
    tag: 'Partner offer',
    title: 'Early-bird scholarship — Feb 2027',
    blurb:
      'NZD 2,000 tuition scholarship for eligible students who commit to a February 2027 intake before 30 November.',
    detail:
      'Students who accept and pay a deposit for any February 2027 intake before 30 November 2026 receive a NZD 2,000 tuition scholarship, applied to their first-semester fees. It stacks with agent commission and applies across NZMA, Yoobee, UPIC and NZTC programmes. Raise it as a "ready to commit" request on the application so UP admissions can attach the scholarship to the offer.',
    href: '/news',
    cta: 'See eligible courses',
    ask: 'Which courses have February 2027 intakes still open?',
  },
]

export function announcementById(id: string): Announcement | undefined {
  return ANNOUNCEMENTS.find((a) => a.id === id)
}
