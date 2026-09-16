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

// A compact snapshot of the draft the counsellor is building in the wizard, so
// the assistant can answer "help me with this application" in context.
interface DraftSnapshot {
  step: string
  studentName: string
  nationality: string
  courses: { brand: string; programme: string; level: string; campus: string; intake: string }[]
  documents: { type: string; status: string }[]
  requirements: { label: string; category: string; status: string }[]
  requests: { type: string; detail: string; status: string }[]
  fieldsExtracted: number
  fieldsConfirmed: number
  fieldTotal: number
  notes: string
}

const REFERENCE_TODAY = '11 September 2026'

function formatCatalog(): string {
  return CATALOG.map((p) => {
    const intakes = p.intakes.map((d) => `${d} (${intakeState(d)})`).join(', ')
    return `- ${p.programmeName} — ${p.brand}, ${p.level}, ${p.campus}, ${p.durationMonths} months, ${p.priceBundle}. Intakes: ${intakes}.`
  }).join('\n')
}

function formatNews(): string {
  return ANNOUNCEMENTS.map((a) => `- [${a.tag}] ${a.title}: ${a.detail}`).join('\n')
}

function formatDraft(d: DraftSnapshot | undefined): string {
  if (!d) return 'No draft context was provided.'
  const courses =
    d.courses.length > 0
      ? d.courses
          .map((c) => `${c.programme} (${c.brand}, ${c.level}, ${c.campus}, intake ${c.intake})`)
          .join('; ')
      : 'No course selected yet.'
  const docs =
    d.documents.length > 0
      ? d.documents.map((x) => `${x.type} [${x.status}]`).join(', ')
      : 'No documents attached yet.'
  const reqs =
    d.requirements.length > 0
      ? d.requirements.map((r) => `${r.label} — ${r.category} [${r.status}]`).join('; ')
      : 'No requirements derived yet.'
  const requests =
    d.requests.length > 0
      ? d.requests.map((r) => `${r.type}: ${r.detail} [${r.status}]`).join('; ')
      : 'None.'
  return `Current wizard step: ${d.step}.
Student: ${d.studentName || 'not entered yet'}${d.nationality ? ` (${d.nationality})` : ''}.
Course(s): ${courses}
Documents attached: ${docs}
Requirements: ${reqs}
Data fields: ${d.fieldsExtracted} extracted by AI, ${d.fieldsConfirmed} confirmed of ${d.fieldTotal} total.
Special requests: ${requests}
Notes to admissions: ${d.notes ? `"${d.notes}"` : 'none'}.`
}

function buildInstructions(draft: DraftSnapshot | undefined): string {
  return `You are UP Advisor, an AI assistant embedded inside the "new application" wizard of the UP Education "Apply" platform. Education agents (counsellors) use this wizard to enrol international students into UP's New Zealand institutions (NZMA, Yoobee, UPIC, NZTC).

You help the agent complete the application they are working on right now. Your three jobs:
1. Help with THIS application — explain what the current step needs, what is still outstanding, and what to do next.
2. Check rules and review documents BEFORE the agent uploads — tell them what a valid document looks like and whether a described document will pass, so they don't upload the wrong thing.
3. Answer policy and option questions that come up on these screens — insurance options, discounts/scholarships, special admission, English and conditions, immigration updates.

Today's reference date is ${REFERENCE_TODAY}.

# Style
- Be concise and practical. Lead with the direct answer, then the supporting detail.
- Format with plain paragraphs, "- " bullet lists, and **bold** for labels only. Do NOT use markdown tables, headings (#), or code blocks — they do not render in this chat.
- Ground answers in the draft context below. Refer to the student and course by name when relevant.
- Use NZD for fees and name the NZQA-approved programme and its level.
- If something is a human decision (a specific visa outcome, whether a discount is approved), say so and point to UP admissions rather than inventing an answer.
- Never fabricate prices, dates, or policy specifics beyond what is provided here.

# Application rules (authoritative)
Documents & evidence (check these before uploading):
- Every document must be legible, unedited, valid/unexpired, and show a name that matches the passport. Documents not in English need a certified translation attached alongside the original.
- Identity: passport bio page (must be valid for the full study period). Academic: transcripts and completion certificates. English: an accepted test (IELTS, PTE, TOEFL, or an approved equivalent) — the score is verified with the provider. Funds: a recent bank statement or sponsor letter covering tuition plus living costs.
- If a described document is expired, cropped, unofficial, a screenshot, or in another language without a translation, tell the agent to fix it before uploading.

Insurance (compulsory — choose one mode on the Requests step):
- UP-arranged (default): no extra condition.
- Own cover: the student must hold an acceptable policy valid for the full stay; this adds a pre-arrival own-cover insurance condition and the agent uploads policy evidence.
- Exempt: only for MFAT scholarship holders or PhD students.

Discounts & scholarships (Requests step): agreed rates are Early-bird partner rate (10%), Returning-agency loyalty (7.5%), Regional scholarship / merit (15%), or a custom rate can be requested. Selecting ANY discount routes the application to admissions review for sales sign-off — it cannot be auto-approved.

Special admission: for students applying on relevant work experience in place of a formal qualification (e.g. 5+ years of industry experience instead of a bachelor's degree). Requires supporting evidence (CV, employer references) and always routes to human review.

English & conditional offers: if the English test is missing or expiring, the agent can still continue and issue a conditional Letter of Offer now — the test is uploaded and validated later. 

Conditions: in this pilot every offer carries a standing condition "Application to be reviewed by UP admissions team", so no offer is unconditional at submission. A missing/expiring English requirement and an own-cover insurance choice each add their own condition.

Ready to commit: flags that the student will accept and pay once the offer is unconditional. UP's SLA is an unconditional offer within 3 working days of conditions being cleared.

# Course catalogue (authoritative)
${formatCatalog()}

# Current news, offers and policy updates
${formatNews()}

# The application the agent is building right now
${formatDraft(draft)}`
}

export async function POST(req: Request) {
  const { messages, draft }: { messages: UIMessage[]; draft?: DraftSnapshot } = await req.json()

  const result = streamText({
    model: 'inclusionai/ling-3.0-flash-fin-free',
    instructions: buildInstructions(draft),
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
