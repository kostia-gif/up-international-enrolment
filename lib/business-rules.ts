import { DUPLICATE_PASSPORTS } from './simulate'
import { PURPOSE_MIN_CHARS } from './eligibility'

// Plain-language catalogue of the rules each wizard step applies, for people
// reviewing the POC. Keep in step with the logic it describes.
export type RuleEffect = 'blocks' | 'warns' | 'informs' | 'routes'

export interface BusinessRule {
  id: string
  title: string
  when: string
  then: string
  effect: RuleEffect
}

export interface StepRules {
  step: 1 | 2 | 3 | 4
  title: string
  summary: string
  rules: BusinessRule[]
}

export const EFFECT_LABEL: Record<RuleEffect, string> = {
  blocks: 'Blocks',
  warns: 'Warns, can continue',
  informs: 'Informs',
  routes: 'Routes',
}

const demoPassports = [...DUPLICATE_PASSPORTS].join(', ')

export const STEP_RULES: StepRules[] = [
  {
    step: 1,
    title: 'Student and course',
    summary:
      'Identify the student, stop duplicates early and pick a course and intake that are still open.',
    rules: [
      {
        id: 'S1-01',
        title: 'Student linked to another agent',
        when: 'The passport number matches a student already linked to another agent.',
        then: `The agent cannot continue. They see "This student already exists with another agent" with two options: call their regional manager, or download the change-of-agent form for the student to sign and submit it to the regional manager. Demo passports: ${demoPassports}.`,
        effect: 'blocks',
      },
      {
        id: 'S1-02',
        title: 'Closed intakes',
        when: 'The intake start date has passed.',
        then: 'The intake is shown as closed and cannot be selected.',
        effect: 'blocks',
      },
      {
        id: 'S1-03',
        title: 'Intakes closing soon',
        when: 'The intake starts within 14 days.',
        then: 'The intake is marked "Closing soon" but can still be selected.',
        effect: 'warns',
      },
      {
        id: 'S1-04',
        title: 'Minimum to continue',
        when: 'Given name, family name, a course and an intake are not all entered.',
        then: 'Continue stays disabled.',
        effect: 'blocks',
      },
      {
        id: 'S1-05',
        title: 'Requirements follow the course',
        when: 'A course is selected.',
        then: 'The Step 2 requirements list and English thresholds are set from the course level (Pathway, Vocational, Degree, Postgraduate).',
        effect: 'informs',
      },
    ],
  },
  {
    step: 2,
    title: 'Documents',
    summary:
      'AI reads each document, ticks off the course requirements and calls out anything that falls short. Nothing here blocks: agents can add evidence later.',
    rules: [
      {
        id: 'S2-01',
        title: 'AI reads every upload',
        when: 'A document is dropped in.',
        then: 'AI classifies it, extracts fields for Step 3 and ticks the matching requirement. Continue only waits while files are being read.',
        effect: 'informs',
      },
      {
        id: 'S2-02',
        title: 'English score meets the course minimum',
        when: 'The overall score or any band is below the course threshold (see table below).',
        then: 'The English requirement shows "English score does not meet requirements" with the shortfall.',
        effect: 'warns',
      },
      {
        id: 'S2-03',
        title: 'Bachelor degree for postgraduate study',
        when: 'The course is postgraduate and no bachelor-level qualification is found.',
        then: 'The academic requirement is flagged with the qualification the transcript shows.',
        effect: 'warns',
      },
      {
        id: 'S2-04',
        title: 'Secondary school completed for degree study',
        when: 'The course is degree level and the secondary qualification is not completed.',
        then: 'The academic requirement is flagged.',
        effect: 'warns',
      },
      {
        id: 'S2-05',
        title: 'Minimum transcript average',
        when: 'The transcript average is below the minimum for the course level (see table below).',
        then: 'The minimum entry requirement is flagged with the average found.',
        effect: 'warns',
      },
      {
        id: 'S2-06',
        title: 'Special admissions or RPL prompt',
        when: 'A qualification is missing or does not meet the requirement.',
        then: 'The verdict suggests adding a special condition or RPL evidence in Step 3.',
        effect: 'warns',
      },
      {
        id: 'S2-07',
        title: 'Requirements verdict',
        when: 'All requirements are met / any are outstanding or flagged.',
        then: 'Green "Meets requirements" / amber "Requirements outstanding" listing what to add. The agent can continue either way.',
        effect: 'informs',
      },
      {
        id: 'S2-08',
        title: 'Medical certificate',
        when: 'A medical certificate is uploaded, or AI recognises one in the drop.',
        then: 'It is confirmed as received. It is optional at this stage.',
        effect: 'informs',
      },
      {
        id: 'S2-09',
        title: 'Evidence met dial',
        when: 'Identity, academic, English and course evidence are each met.',
        then: 'Evidence met reaches 100%. Missing, expiring or flagged items count as gaps; an English condition on the offer counts as covered.',
        effect: 'informs',
      },
    ],
  },
  {
    step: 3,
    title: 'Check answers',
    summary:
      'Confirm what AI read, fill the answers only the student knows, and record evidence still to come.',
    rules: [
      {
        id: 'S3-01',
        title: 'Confirm AI-read fields',
        when: 'A field was filled by AI from a document.',
        then: 'It must be confirmed (or corrected) before it counts as complete.',
        effect: 'blocks',
      },
      {
        id: 'S3-02',
        title: 'Name mismatch',
        when: 'A name read from the passport differs from the name typed in Step 1.',
        then: 'The field shows a conflict to resolve before the application is LOO-ready.',
        effect: 'blocks',
      },
      {
        id: 'S3-03',
        title: 'Conditional questions',
        when: 'A question depends on an earlier answer (e.g. NZ visa type only when in New Zealand).',
        then: 'It is only shown and required when the parent answer applies.',
        effect: 'informs',
      },
      {
        id: 'S3-04',
        title: 'Field validation',
        when: 'An email is invalid, a year is not four digits, the emergency contact email matches the student, or a gap end date is before its start.',
        then: 'The field shows an error and does not count as complete.',
        effect: 'blocks',
      },
      {
        id: 'S3-05',
        title: 'Derived answers',
        when: 'Date of birth, intake date and "Currently in New Zealand?" are known.',
        then: 'Under 18 at course start and Onshore / offshore are worked out automatically.',
        effect: 'informs',
      },
      {
        id: 'S3-06',
        title: 'Suggested defaults',
        when: 'A field is empty and a sensible default exists.',
        then: 'Preferred name defaults to given name, main activity to "09 Overseas" for offshore students, and secondary school details from the transcript. Anything the agent types wins.',
        effect: 'informs',
      },
      {
        id: 'S3-07',
        title: 'English test to follow',
        when: 'No English test was read and the agent ticks "Agent will arrange an English test".',
        then: 'Test type and score are hidden and the English test becomes a condition on the offer.',
        effect: 'informs',
      },
      {
        id: 'S3-08',
        title: 'Address lookup',
        when: 'The agent enters the home address.',
        then: 'Country is chosen first, then a search suggests addresses for that country and fills the lines. Manual entry stays available.',
        effect: 'informs',
      },
      {
        id: 'S3-09',
        title: 'Special admissions and RPL',
        when: 'A qualification was flagged in Step 2.',
        then: 'The section under Education history is highlighted and the agent can upload supporting evidence. It is optional.',
        effect: 'warns',
      },
      {
        id: 'S3-11',
        title: 'Gender as on passport',
        when: 'The passport is read.',
        then: 'Gender is taken as shown on the passport. Preferred gender is a separate optional answer and never overrides the passport value.',
        effect: 'informs',
      },
      {
        id: 'S3-12',
        title: 'Neurodiverse learning support',
        when: 'The chosen course is flagged as supporting neurodiverse learners.',
        then: 'Health shows "This course supports dyslexia, ADHD and neurodiverse learning". Every application asks whether the student has dyslexia, ADHD or another neurodiverse condition (details required if yes), then asks about other medical conditions separately.',
        effect: 'informs',
      },
      {
        id: 'S3-10',
        title: 'LOO-ready dial',
        when: 'Evidence is met and every required, applicable field is complete.',
        then: 'LOO-ready reaches 100% and an offer can be generated.',
        effect: 'informs',
      },
    ],
  },
  {
    step: 4,
    title: 'Review and offer',
    summary:
      'Decide which offer the platform can issue now, or whether UP admissions needs to review first.',
    rules: [
      {
        id: 'S4-01',
        title: 'Admissions review route',
        when: 'There is a note to admissions, or the student has a previous visa refusal.',
        then: 'The application goes to UP admissions review instead of auto-issuing.',
        effect: 'routes',
      },
      {
        id: 'S4-02',
        title: 'Low visa risk',
        when: 'The approval rate for the student’s citizenship and course type is high.',
        then: 'Unconditional offer, or conditional if student conditions such as an English test are still open.',
        effect: 'routes',
      },
      {
        id: 'S4-03',
        title: 'Elevated visa risk',
        when: 'The approval rate is in the elevated band.',
        then: 'Conditional offer only, once risk evidence is provided.',
        effect: 'routes',
      },
      {
        id: 'S4-04',
        title: 'High visa risk',
        when: 'The approval rate is in the high-risk band.',
        then: 'No offer from the platform; UP admissions reviews the evidence first.',
        effect: 'blocks',
      },
      {
        id: 'S4-05',
        title: 'Risk evidence',
        when: 'Risk is elevated or high.',
        then: `The agent provides a study purpose of at least ${PURPOSE_MIN_CHARS} characters, addresses any refusals, and confirms funds for first-year tuition plus NZD 20,000 living costs with proof uploaded.`,
        effect: 'blocks',
      },
      {
        id: 'S4-06',
        title: 'Declarations',
        when: 'Any declaration is not accepted.',
        then: 'The application cannot be submitted.',
        effect: 'blocks',
      },
      {
        id: 'S4-07',
        title: 'Fast track',
        when: 'The agent marks the student as ready to commit.',
        then: 'The application is flagged as fast track and it is logged in the activity.',
        effect: 'informs',
      },
      {
        id: 'S4-08',
        title: 'Moving to unconditional',
        when: 'A conditional offer has open conditions.',
        then: 'The dashboard lists only what the agent still has to provide; UP’s own sign-off is not shown.',
        effect: 'informs',
      },
    ],
  },
]
