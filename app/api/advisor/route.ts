import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { CATALOG, intakeState } from '@/lib/catalog'
import { ANNOUNCEMENTS } from '@/lib/news'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// A compact, PII-light snapshot of the counsellor's visible pipeline, sent by
// the client so the advisor can answer "what's the status of X" questions.
interface AppSnapshot {
  studentName: string
  brand: string
  programme: string
  stage: string
  route: string
  outstanding: string[]
}

const REFERENCE_TODAY = '10 September 2026'

function formatCatalog(): string {
  return CATALOG.map((p) => {
    const intakes = p.intakes
      .map((d) => `${d} (${intakeState(d)})`)
      .join(', ')
    return `- ${p.programmeName} — ${p.brand}, ${p.level}, ${p.campus}, ${p.durationMonths} months, ${p.priceBundle}. Intakes: ${intakes}.`
  }).join('\n')
}

function formatNews(): string {
  return ANNOUNCEMENTS.map((a) => `- [${a.tag}] ${a.title}: ${a.detail}`).join('\n')
}

function formatPipeline(apps: AppSnapshot[]): string {
  if (apps.length === 0) {
    return 'No applications are currently visible to this counsellor.'
  }
  return apps
    .map((a) => {
      const outstanding =
        a.outstanding.length > 0
          ? `Outstanding: ${a.outstanding.join('; ')}`
          : 'Nothing outstanding.'
      return `- ${a.studentName} — ${a.programme} (${a.brand}), stage "${a.stage}", route "${a.route}". ${outstanding}`
    })
    .join('\n')
}

function buildInstructions(apps: AppSnapshot[]): string {
  return `You are UP Advisor, an AI assistant embedded in the UP Education "Apply" platform used by education agents (counsellors) who enrol international students into UP's New Zealand institutions (NZMA, Yoobee, UPIC, NZTC).

Your job is to help agents with three things:
1. Course guidance — recommend programmes, compare options, explain entry requirements, intakes, duration and fees.
2. Eligibility — assess whether a student profile fits a programme and what evidence is needed (identity, academic, English, funds).
3. Support — answer questions about the status of applications in the agent's pipeline, and about policy or immigration updates.

Today's reference date is ${REFERENCE_TODAY}.

# Style
- Be concise and practical. Prefer short paragraphs and tight bullet lists.
- Format with plain paragraphs, "- " bullet lists, and **bold** for labels only. Do NOT use markdown tables, headings (#), or code blocks — they do not render in this chat.
- Lead with the direct answer, then the supporting detail.
- Use NZD for fees and name the NZQA-approved programme and its level.
- When a course is a good fit, mention the next open intake and that the agent can start an application from the homepage.
- If something is outside what you know (e.g. a specific visa decision, or an application not in the snapshot), say so and suggest raising it with UP admissions rather than inventing an answer.
- Never fabricate application details, prices, dates, or policy specifics beyond what is provided below.

# Course catalogue (authoritative)
${formatCatalog()}

# Current news, offers and policy updates
${formatNews()}

# The agent's current pipeline (their visible applications)
${formatPipeline(apps)}`
}

export async function POST(req: Request) {
  const { messages, applications }: { messages: UIMessage[]; applications?: AppSnapshot[] } =
    await req.json()

  const result = streamText({
    model: 'inclusionai/ling-3.0-flash-fin-free',
    instructions: buildInstructions(applications ?? []),
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
