import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  tool,
  type UIMessage,
} from 'ai'
import { z } from 'zod'
import type { AssistantContext } from '@/lib/assistant'
import { INZ_DATA_LABEL, KNOWN_COUNTRIES, OFFER_OUTCOME_LABEL, RISK_TIPS, testProspect } from '@/lib/eligibility'

export const maxDuration = 30

const MAX_APPS = 80

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: AssistantContext } = await req.json()

  const apps = (context?.applications ?? []).slice(0, MAX_APPS)
  const focus = apps.find((a) => a.id === context?.focusAppId)

  const system = `You are the UP Education enrolment assistant for an international education agent in New Zealand.
You help the agent prioritise work, review their existing applications and test whether prospective students are likely to get a NZ student visa.

Rules:
- Be concise and practical. Use short paragraphs or "- " bullet lists. No markdown headings, tables or bold.
- Never invent application data. Use the tools to look things up.
- For existing applications use checkApplications (optionally filtered by student name). For priorities use getTopTasks.
- To test a prospective student, gather these parameters conversationally, asking for at most two missing items at a time: country of citizenship, course or course type (Pathway, Vocational, Degree, Postgraduate), proof of funds available, study gap in years, previous visa refusals, English requirement met. Country and course type are required; once you have them you may run testEligibility and note which optional answers would sharpen the result.
- Map courses to a type: foundation or pathway programmes = Pathway; certificates and diplomas up to level 6 = Vocational; bachelor degrees = Degree; graduate diplomas, postgraduate and masters = Postgraduate.
- After a tool result, explain what it means and give 2 to 4 concrete next steps. When risk is medium (potential refusal risk, evidence optional) or high (evidence mandatory), draw on these tips: ${RISK_TIPS.map((t) => `${t.title}: ${t.detail}`).join(' | ')}
- Approval rates are ${INZ_DATA_LABEL}. Say so if asked where figures come from. Countries with specific data: ${KNOWN_COUNTRIES.join(', ')}.
- The agent is ${focus ? `currently focused on ${focus.student} (${focus.programme}).` : 'looking at their whole pipeline.'}
- There are ${apps.length} applications in the current view.`

  const result = streamText({
    model: 'openai/gpt-4.1-mini',
    system,
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(5),
    tools: {
      getTopTasks: tool({
        description: "Get the agent's highest-priority tasks across their applications.",
        inputSchema: z.object({}),
        execute: async () => ({ tasks: context?.topTasks ?? [] }),
      }),
      checkApplications: tool({
        description:
          'Check visa eligibility and outstanding items for existing applications. Optionally filter by student name or only return flagged applications.',
        inputSchema: z.object({
          studentName: z.string().optional().describe('Full or partial student name'),
          flaggedOnly: z.boolean().optional().describe('Only return applications with warnings'),
        }),
        execute: async ({ studentName, flaggedOnly }) => {
          const name = studentName?.trim().toLowerCase()
          const matches = apps.filter(
            (a) =>
              (!name || a.student.toLowerCase().includes(name)) && (!flaggedOnly || a.worst !== 'ok'),
          )
          return { count: matches.length, applications: matches.slice(0, 12) }
        },
      }),
      testEligibility: tool({
        description: 'Test visa eligibility and the offer outcome for a prospective (hypothetical) student.',
        inputSchema: z.object({
          nationality: z.string().describe('Country of citizenship, e.g. India'),
          courseType: z.enum(['Pathway', 'Vocational', 'Degree', 'Postgraduate']),
          programme: z.string().optional().describe('Course name if the agent mentioned one'),
          proofOfFunds: z.boolean().optional(),
          studyGapYears: z.number().min(0).max(30).optional(),
          previousRefusal: z.boolean().optional(),
          englishMet: z.boolean().optional(),
        }),
        execute: async (profile) => {
          const r = testProspect(profile)
          return { ...r, outcomeLabel: OFFER_OUTCOME_LABEL[r.outcome] }
        },
      }),
    },
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
