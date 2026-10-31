import { DUPLICATE_PASSPORTS } from './simulate'
import { PURPOSE_MIN_CHARS } from './eligibility'

// Plain-language catalogue of the rules each wizard step applies, for people
// reviewing the POC. Keep in step with the logic it describes.
export type RuleEffect = 'blocks' | 'warns' | 'informs' | 'routes'

// 'poc' = working in this prototype; 'planned' = specified for the AI /
// integration build and not yet simulated.
export type RuleStatus = 'poc' | 'planned'

export interface BusinessRule {
  id: string
  title: string
  when: string
  then: string
  effect: RuleEffect
  status?: RuleStatus
  // How AI or an external service does the check: model, API and data used.
  automation?: string
}

export const STATUS_LABEL: Record<RuleStatus, string> = {
  poc: 'Live in POC',
  planned: 'Planned',
}

// One row in the per-step dependency matrix. `rules` lists the rule IDs
// that consume it so reviewers can trace a data source or API to a decision.
export interface DependencyItem {
  name: string
  detail: string
  rules?: string[]
  status?: RuleStatus
}

export interface StepDependencies {
  // Reference data the decisions are made from (INZ stats, course rules…)
  data: DependencyItem[]
  // The decisions the step takes with that data
  decisions: DependencyItem[]
  // Third-party services called
  externalApis: DependencyItem[]
  // UP systems and services called
  internalApis: DependencyItem[]
}

export interface StepRules {
  // 'dashboard' covers the pipeline board, task list and assistant outside the wizard.
  step: 'dashboard' | 1 | 2 | 3 | 4 | 5
  title: string
  summary: string
  dependencies: StepDependencies
  rules: BusinessRule[]
}

export const DEPENDENCY_LABEL: Record<keyof StepDependencies, { title: string; hint: string }> = {
  data: { title: 'Data required', hint: 'Reference data the decisions are made from' },
  decisions: { title: 'Business rule decisions', hint: 'What the platform decides with that data' },
  externalApis: { title: 'External APIs', hint: 'Third-party services called' },
  internalApis: { title: 'Internal APIs', hint: 'UP systems and services called' },
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
    step: 'dashboard',
    title: 'Dashboard',
    summary:
      'The agent’s pipeline: which applications they can see, which stage each sits in, who the next action is waiting on, what the assistant can do, and how business cards become prospects.',
    dependencies: {
      data: [
        {
          name: 'Applications and stages',
          detail: 'Draft, Submitted, Conditional offer, Unconditional, Payment & visa — plus days in stage, conditions, requirements and holds.',
          rules: ['D-02', 'D-03', 'D-04'],
        },
        {
          name: 'Agent identity and role',
          detail: 'Signed-in agent, agency owner flag, status and rights.',
          rules: ['D-01', 'D-11'],
        },
        {
          name: 'Admissions events',
          detail: 'Unseen updates, CRM document holds and duplicate-student holds pushed from UP.',
          rules: ['D-04', 'D-05', 'D-06'],
        },
        {
          name: 'INZ refusal band',
          detail: 'Reused from Step 3 to surface high-risk files missing financial evidence.',
          rules: ['D-06', 'D-10'],
        },
        {
          name: 'Payment and visa state',
          detail: 'Invoice state and student visa state (not lodged / lodged / approved) for Payment & visa files.',
          rules: ['D-03', 'D-07'],
        },
      ],
      decisions: [
        { name: 'Visibility', detail: 'Agents see their own files; agency owners see every file in the agency.', rules: ['D-01'] },
        { name: 'Stage column', detail: 'Stage is set by the latest event; Payment & visa is a read-only Phase 2 preview.', rules: ['D-02', 'D-07'] },
        { name: 'Waiting on you / UP / INZ', detail: 'Ownership of the next action, derived from stage, holds, open conditions and visa state.', rules: ['D-03'] },
        { name: 'Top tasks ordering', detail: 'High refusal risk without funds → unseen updates → uploads and conditions → drafts.', rules: ['D-06'] },
        { name: 'Drop a document to clear a requirement', detail: 'Only outstanding requirements are offered; English first, then academic, other, identity.', rules: ['D-08'] },
        { name: 'Assistant guard-rails', detail: 'Answers only from tools over the agent’s own data; eligibility tests use the same engine as Step 3.', rules: ['D-09', 'D-10'] },
        { name: 'Business card → prospect', detail: 'Card is read, student is checked for an existing link, then a draft is pre-filled.', rules: ['D-11'] },
      ],
      externalApis: [
        { name: 'LLM via AI Gateway', detail: 'Assistant chat and business-card extraction; never writes application data itself.', rules: ['D-09', 'D-11'] },
        { name: 'INZ statistics', detail: 'Same refusal-rate feed as Steps 3 and 5.', rules: ['D-06', 'D-10'], status: 'planned' },
      ],
      internalApis: [
        { name: 'Applications service (Dynamics 365)', detail: 'List and read applications scoped to the agent or agency, with stage, conditions and events.', rules: ['D-01', 'D-02', 'D-04'], status: 'planned' },
        { name: 'Agent permissions', detail: 'Agent vs agency-owner scope, status and rights.', rules: ['D-01'] },
        { name: 'Admissions updates feed', detail: 'Unseen updates, CRM holds and duplicate holds; marks updates seen when opened.', rules: ['D-04', 'D-05'], status: 'planned' },
        { name: 'Document store', detail: 'Accept dropped files against an outstanding requirement and re-run Step 2 checks.', rules: ['D-08'] },
        { name: 'Student lookup (Dynamics 365)', detail: 'Existing-link check for business-card prospects, as in S1-01.', rules: ['D-11'], status: 'planned' },
        { name: 'Finance & visa status', detail: 'Invoice and visa state for Payment & visa files.', rules: ['D-07'], status: 'planned' },
      ],
    },
    rules: [
      {
        id: 'D-01',
        title: 'Who sees which applications',
        when: 'The dashboard loads for a signed-in agent.',
        then: 'Agents see only applications they created. Agency owners see every application across their agency. Nobody sees another agency’s students.',
        effect: 'blocks',
        status: 'poc',
      },
      {
        id: 'D-02',
        title: 'Pipeline columns',
        when: 'An application has a stage.',
        then: 'Drafts sit in their own tray above the board. Submitted, Conditional offer and Unconditional are live columns. Days in stage is counted from the last stage change.',
        effect: 'informs',
        status: 'poc',
      },
      {
        id: 'D-03',
        title: 'Waiting on you, UP or INZ',
        when: 'A card is rendered.',
        then: 'Duplicate hold → With UP. Draft or Unconditional → Waiting on you. Payment & visa: unpaid → you, visa lodged → INZ, visa not approved → you, otherwise UP. Otherwise a CRM document hold or any open condition owned by the agent or student → you; else With UP.',
        effect: 'informs',
        status: 'poc',
      },
      {
        id: 'D-04',
        title: 'Unseen updates',
        when: 'UP admissions records an update the agent has not opened.',
        then: 'The card shows an update badge and “Review update” appears in top tasks. Opening the application marks it seen.',
        effect: 'informs',
        status: 'poc',
      },
      {
        id: 'D-05',
        title: 'CRM document hold',
        when: 'Admissions requests documents on a submitted file.',
        then: 'The file stays in its column with a hold chip and moves to Waiting on you until the document is dropped or uploaded.',
        effect: 'routes',
        status: 'poc',
      },
      {
        id: 'D-06',
        title: 'Top tasks ordering',
        when: 'The assistant or task list summarises what to do next.',
        then: 'Payment & visa files are excluded. Priority 0: high INZ refusal risk with no financial evidence. 1: unseen admissions update. 2: outstanding uploads, open conditions, unconditional offer to send. 3: finish a draft. Only files waiting on the agent produce upload / condition / draft tasks.',
        effect: 'informs',
        status: 'poc',
      },
      {
        id: 'D-07',
        title: 'Payment & visa is Phase 2',
        when: 'An application reaches Unconditional and beyond.',
        then: 'The Payment & visa column is shown greyed out as a preview with invoice and visa chips. It is not interactive in the POC.',
        effect: 'blocks',
        status: 'planned',
      },
      {
        id: 'D-08',
        title: 'Drop a document from the board',
        when: 'A selected card has outstanding requirements.',
        then: 'A drop panel lists them in priority order (English, academic, other, identity). A dropped file is read with the same Step 2 checks and, if accepted, clears the requirement and adds an event.',
        effect: 'informs',
        status: 'poc',
      },
      {
        id: 'D-09',
        title: 'Assistant answers only from data',
        when: 'The agent asks the assistant a question.',
        then: 'The model must use tools (top tasks, check applications, test eligibility) over the agent’s visible applications. It never invents application data and cannot change a file.',
        effect: 'informs',
        status: 'poc',
      },
      {
        id: 'D-10',
        title: 'Assistant eligibility test',
        when: 'The agent asks “can a student from X do course Y?”',
        then: 'The same engine as Step 3 runs: entry rules, INZ refusal band (low / potential / high) and the offer outcome, including whether visa evidence is optional or mandatory.',
        effect: 'blocks',
        status: 'poc',
      },
      {
        id: 'D-11',
        title: 'Business card to prospect',
        when: 'The agent drops a business card or photo of contact details.',
        then: 'Name, email, phone and country are extracted and shown for confirmation. The S1-01 existing-student check runs before a draft is pre-filled; a linked student stops the flow.',
        effect: 'informs',
        status: 'poc',
      },
    ],
  },
  {
    step: 1,
    title: 'Course and intake',
    summary:
      'Pick a course and intake that are still open. The student is identified from the passport in Step 2, which also stops duplicates early.',
    dependencies: {
      data: [
        {
          name: 'Course catalogue',
          detail: 'Course code, title, NZQF level, duration, course type (Pathway / Vocational / Degree / Postgraduate), teaching-programme and neurodiverse-support flags.',
          rules: ['S1-05'],
        },
        {
          name: 'Intake calendar',
          detail: 'Start dates per course, the 14-day "closing soon" window and intake capacity.',
          rules: ['S1-02', 'S1-03'],
        },
        {
          name: 'Agent profile',
          detail: 'Status (Active / Probation / Suspended / Disabled) and the rights held.',
          rules: ['S1-00'],
        },
        {
          name: 'Existing student links',
          detail: 'Passport number, date of birth and name against students already linked to an agent.',
          rules: ['S1-01'],
        },
      ],
      decisions: [
        { name: 'Agent may start an application', detail: 'Only Active and Probation agents can begin a new file.', rules: ['S1-00'] },
        { name: 'Intake is selectable', detail: 'Closed intakes are blocked; closing-soon intakes warn.', rules: ['S1-02', 'S1-03'] },
        { name: 'Requirements set from course', detail: 'Course type selects the Step 2 document list and English / grade thresholds.', rules: ['S1-05'] },
        { name: 'Duplicate student route', detail: 'Student linked to another agent → stop, offer change-of-agent form or regional manager.', rules: ['S1-01'] },
      ],
      externalApis: [],
      internalApis: [
        { name: 'Course & intake service', detail: 'Read courses and open intakes (source of truth: UP academic calendar).', rules: ['S1-02', 'S1-03', 'S1-05'] },
        { name: 'Agent permissions', detail: 'Read the signed-in agent’s status and rights.', rules: ['S1-00'] },
        { name: 'Student lookup (Dynamics 365)', detail: 'Match passport + DOB, fuzzy name, return “linked to another agent” without naming them.', rules: ['S1-01'], status: 'planned' },
      ],
    },
    rules: [
      {
        id: 'S1-01',
        title: 'Student linked to another agent',
        when: 'The passport number matches a student already linked to another agent.',
        then: `The agent cannot continue. They see "This student already exists with another agent" with two options: call their regional manager, or download the change-of-agent form for the student to sign and submit it to the regional manager. Demo passports: ${demoPassports}.`,
        effect: 'blocks',
        automation:
          'Lookup on passport number + date of birth against Dynamics 365 contacts. Fuzzy name match (transliteration-aware) catches re-typed passports. The other agent’s name is never shown, only that a link exists.',
      },
      {
        id: 'S1-00',
        title: 'Agent account must allow new applications',
        when: 'The signed-in agent’s status is Suspended or Disabled.',
        then: 'They cannot submit a new application. Step 4 shows the reason and points them to their regional manager.',
        effect: 'blocks',
        automation: 'Agent status read from the UP agent profile (managed under Agents).',
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
    dependencies: {
      data: [
        {
          name: 'Required documents by course type',
          detail: 'Passport, transcript, English test, plus teaching-programme extras (police vetting, referees).',
          rules: ['S2-07', 'S2-09'],
        },
        {
          name: 'English thresholds',
          detail: 'IELTS / PTE / TOEFL / Duolingo overall and band minimums per course level (see table below).',
          rules: ['S2-02', 'S2-13'],
        },
        {
          name: 'Academic entry rules',
          detail: 'Minimum qualification level and transcript average per course level; bachelor required for postgraduate.',
          rules: ['S2-03', 'S2-04', 'S2-05'],
        },
        {
          name: 'Qualification recognition tables',
          detail: 'Overseas institution and qualification → NZ level mapping; grade-scale conversions to a percentage.',
          rules: ['S2-14'],
        },
        {
          name: 'Course end date',
          detail: 'Intake start + duration + 3 months, for passport validity.',
          rules: ['S2-11'],
        },
      ],
      decisions: [
        { name: 'Document accepted or re-upload', detail: 'Readable, correct type, MRZ checksum passes → ticks the requirement; otherwise re-upload with reason.', rules: ['S2-01', 'S2-10', 'S2-16'] },
        { name: 'Meets / does not meet entry', detail: 'English score, qualification level and average checked against the course rule.', rules: ['S2-02', 'S2-03', 'S2-04', 'S2-05'] },
        { name: 'Expiring documents', detail: 'Passport shorter than course + 3 months, or English test older than 2 years at intake → “Expiring”, English becomes an offer condition.', rules: ['S2-11', 'S2-13'] },
        { name: 'Same-person check', detail: 'Name / DOB conflicts across documents are surfaced; transliteration variants allowed.', rules: ['S2-15'] },
        { name: 'Special admissions / RPL prompt', detail: 'Missing or failed qualification → suggest RPL or special admission evidence in Step 4.', rules: ['S2-06'] },
      ],
      externalApis: [
        { name: 'English test verification', detail: 'IELTS Results Service, PTE Score Report, ETS TOEFL Data Manager, Duolingo verification — match scores, name and DOB.', rules: ['S2-12'], status: 'planned' },
        { name: 'Document AI (OCR + classification)', detail: 'Read passport MRZ, transcripts and test reports; return fields with confidence and page source.', rules: ['S2-01', 'S2-10', 'S2-14'] },
        { name: 'Qualification recognition (NZQA / Ecctis)', detail: 'Confirm overseas qualification level where the internal table has no match.', rules: ['S2-14'], status: 'planned' },
      ],
      internalApis: [
        { name: 'Entry rules service', detail: 'English thresholds and minimum grades per course level.', rules: ['S2-02', 'S2-05'] },
        { name: 'Document store', detail: 'Upload, virus scan, store with page references for S4-14 traceability.', rules: ['S2-01'] },
        { name: 'Admissions queue', detail: 'Hand off “Could not verify” and unrecognised-institution cases.', rules: ['S2-12', 'S2-14'], status: 'planned' },
      ],
    },
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
        title: 'Requirements line on Ready to submit',
        when: 'Identity, academic, English and course requirements are each met.',
        then: 'The Requirements line turns green. Missing, expiring or flagged items are listed as outstanding; an English condition on the offer counts as covered.',
        effect: 'informs',
      },
      {
        id: 'S2-10',
        title: 'AI passport review',
        when: 'A passport is uploaded.',
        then: 'AI reads the photo page, checks the machine-readable zone (MRZ) and fills name, date of birth, gender, citizenship, passport number and expiry. A failed MRZ checksum, cropped page or low-confidence read is flagged for re-upload.',
        effect: 'warns',
        status: 'poc',
        automation:
          'Vision model extracts fields with a confidence per field; MRZ check digits are validated in code. Fields under 90% confidence are shown as "Check" in Step 3. Planned: tamper and photo-substitution detection.',
      },
      {
        id: 'S2-11',
        title: 'Passport valid for the length of the course',
        when: 'Passport expiry is before the course end date plus 3 months (intake start + course duration).',
        then: 'The passport requirement is marked "Expiring" with the shortfall in months. The agent can continue, but the student must renew before the visa application.',
        effect: 'warns',
        status: 'planned',
        automation:
          'Course end = intake start + course duration (months) from the course catalogue. INZ requires the passport to be valid 3 months past the intended departure date.',
      },
      {
        id: 'S2-12',
        title: 'English test result verified with the test provider',
        when: 'An IELTS, PTE, TOEFL or Duolingo result is uploaded.',
        then: 'The result is checked against the provider. If the scores, name or date of birth don’t match, the requirement is flagged "Could not verify" and goes to admissions. If verified, it shows a "Verified with provider" badge.',
        effect: 'warns',
        status: 'planned',
        automation:
          'IELTS TRF Verification Service (TRF number), Pearson PTE score verification (score report code), ETS TOEFL institutional score feed, Duolingo results portal. AI reads the reference number from the certificate to call the API.',
      },
      {
        id: 'S2-13',
        title: 'English test valid on the course start date',
        when: 'The test date is more than 2 years before intake start.',
        then: 'The English requirement is marked "Expiring" and an English test condition is added to the offer.',
        effect: 'warns',
        status: 'planned',
        automation: 'Test date read by AI from the certificate; expiry = test date + 2 years.',
      },
      {
        id: 'S2-14',
        title: 'Transcript and qualification recognition',
        when: 'An academic transcript or certificate is uploaded.',
        then: 'AI identifies the institution, qualification and level, converts the average to a percentage and maps it to the NZ level. Unrecognised institutions are flagged for admissions.',
        effect: 'warns',
        status: 'planned',
        automation:
          'Country grading scales (e.g. GPA 4.0, CGPA 10, percentage) converted in code. Institution and level checked against NZQA International Qualifications recognition lists.',
      },
      {
        id: 'S2-15',
        title: 'Same person across documents',
        when: 'Name or date of birth differs between passport, transcript and English test.',
        then: 'The mismatch is shown on the requirement and as a conflict in Step 3. Known transliteration differences are allowed.',
        effect: 'warns',
        status: 'planned',
        automation: 'Fuzzy match on normalised names (diacritics removed, order-insensitive) plus exact date of birth.',
      },
      {
        id: 'S2-16',
        title: 'Document quality',
        when: 'A page is blurry, cut off, password-protected or not the document expected.',
        then: 'The file is marked "Re-upload needed" with the reason; it doesn’t tick any requirement.',
        effect: 'warns',
        status: 'planned',
        automation: 'Image quality score and document-type classifier run before extraction.',
      },
    ],
  },
  {
    step: 3,
    title: 'Assessment',
    dependencies: {
      data: [
        {
          name: 'INZ student visa refusal rates',
          detail: 'Refusal % by citizenship × course type. Bands: low under 20%, potential 20–60%, high 60% and over.',
          rules: ['S3-01', 'S3-02', 'S3-05', 'S3-06'],
        },
        {
          name: 'Agent profile',
          detail: 'Status (Active / Probation / Suspended / Disabled) and conditional-offer right, re-read at assessment time.',
          rules: ['S3-00', 'S3-03'],
        },
        {
          name: 'Existing-student match',
          detail: 'Result of the passport match against students linked to other agents (from Step 2).',
          rules: ['S3-0A'],
        },
        {
          name: 'Step 2 outcomes',
          detail: 'Which requirements are met, outstanding, expiring or rejected, plus extracted qualification and English scores.',
          rules: ['S3-03', 'S3-04', 'S3-07', 'S3-09'],
        },
        {
          name: 'Course entry rules',
          detail: 'Same thresholds as Step 2, applied here as the assessment verdict.',
          rules: ['S3-04', 'S3-07'],
        },
        {
          name: 'Alternative course map',
          detail: 'Pathway and lower-level courses that accept the qualification shown.',
          rules: ['S3-04', 'S3-06'],
        },
        {
          name: 'Teaching Council requirements',
          detail: 'Police vetting, two referees and interview for teaching programmes.',
          rules: ['S3-08'],
        },
      ],
      decisions: [
        { name: 'Hard stops', detail: 'Suspended / disabled agent or student linked to another agent → red, cannot continue past Step 3.', rules: ['S3-00', 'S3-0A'] },
        { name: 'Overall verdict', detail: 'Green ready / green conditional / amber / red from documents + entry + refusal band.', rules: ['S3-01', 'S3-02', 'S3-03', 'S3-04', 'S3-05', 'S3-06'] },
        { name: 'Refusal-risk band and evidence level', detail: 'Low → no evidence; potential → evidence optional, soft wording; high → evidence mandatory, admissions reviews first.', rules: ['S3-01', 'S3-02', 'S3-05'] },
        { name: 'Agent conditional LoO allowed', detail: 'Only when entry is met, refusal risk is not high, and the agent holds the right (see S5-09). Missing documents become conditions.', rules: ['S3-03'] },
        { name: 'Entry shortfall route', detail: 'Qualification or English below rule → RPL / special admission in Step 4, or switch to a suggested course.', rules: ['S3-04', 'S3-07'] },
      ],
      externalApis: [
        { name: 'INZ statistics', detail: 'Published student visa decision data (MBIE / INZ open data), refreshed monthly and cached.', rules: ['S3-01', 'S3-02', 'S3-05'], status: 'planned' },
      ],
      internalApis: [
        { name: 'Assessment engine', detail: 'Combines Step 2 results, entry rules and refusal band into the verdict and actions.', rules: ['S3-01', 'S3-02', 'S3-03', 'S3-04', 'S3-05', 'S3-06', 'S3-07'] },
        { name: 'Course recommendations', detail: 'Return alternative courses for a qualification level and field.', rules: ['S3-04', 'S3-06'] },
        { name: 'Agent permissions', detail: 'Account status and whether this agent may submit or create a conditional offer.', rules: ['S3-00', 'S3-03'] },
        { name: 'Student lookup (Dynamics 365)', detail: 'Existing-link result reused from Step 2; re-queried if the passport changed.', rules: ['S3-0A'], status: 'planned' },
      ],
    },
    summary:
      'Business rules run over what Step 2 read and verified. The result is a traffic light: green proceeds, amber proceeds with action, red is unlikely to proceed. Step 2 itself only reads, translates and checks documents are complete.',
    rules: [
      {
        id: 'S3-00',
        title: 'Agent account re-checked at assessment',
        when: 'The assessment runs.',
        then: 'Suspended or Disabled → red “Cannot continue”, Continue is disabled and the agent is pointed to their regional manager. Probation → amber, the file continues but admissions reviews before any offer. Active → green, with a note on whether the conditional-offer right is held.',
        effect: 'blocks',
        status: 'poc',
      },
      {
        id: 'S3-0A',
        title: 'Existing-student check surfaced at assessment',
        when: 'The assessment runs after the passport was matched in Step 2.',
        then: 'Linked to another agent → red “Cannot continue” with the change-of-agent steps; Continue is disabled. Clear → green. Not yet run (no passport) → amber asking for the passport.',
        effect: 'blocks',
        status: 'poc',
      },
      {
        id: 'S3-01',
        title: 'All documents collected, entry met, low visa risk',
        when: 'Every required document is read, the transcript and English meet the course entry level, and the INZ refusal rate for this nationality and course type is under 20%.',
        then: 'Green — "Ready to apply". Applications like this have a low refusal rate; the agent continues to Answers and an offer can be issued straight away.',
        effect: 'informs',
      },
      {
        id: 'S3-02',
        title: 'Documents complete, potential INZ refusal risk',
        when: 'Documents and entry are fine, but the INZ refusal rate for this nationality and course type is between 20% and 60%.',
        then: 'Amber, soft wording — "potential INZ refusal risk". The application proceeds as normal; reason for study, financial evidence and any study gaps or previous refusals are offered as optional evidence in Review and strengthen the file if provided.',
        effect: 'warns',
        automation: 'Lookup on nationality × course level against the INZ Student Visa decision dataset, refreshed monthly.',
      },
      {
        id: 'S3-03',
        title: 'Some documents missing, entry met so far',
        when: 'What has been read meets the entry level, but one or more required documents (typically English) are not uploaded.',
        then: 'Green — "Ready for a conditional offer". The missing items are listed with "upload when collected" and become conditions on the offer. The agent may create a conditional offer if their account allows it and the INZ refusal risk is not high.',
        effect: 'informs',
      },
      {
        id: 'S3-04',
        title: 'Qualification does not meet the entry level',
        when: 'The transcript shows a qualification below what the course requires (e.g. high school for a Masters) or a grade under the course minimum.',
        then: 'Amber — to continue, the agent adds RPL / work-experience evidence or a special admission request in Answers. Alternative courses that fit the qualification are suggested; switching keeps the documents already read.',
        effect: 'warns',
      },
      {
        id: 'S3-05',
        title: 'High INZ refusal risk',
        when: 'The INZ refusal rate for this nationality and course type is 60% or higher.',
        then: 'Amber with a strong warning — the agent can proceed, but visa evidence (statement of purpose, proof of funds, home-country ties) is mandatory and admissions reviews it before any offer. If the qualification also falls short the overall result is red.',
        effect: 'routes',
      },
      {
        id: 'S3-06',
        title: 'Qualification gap and high visa risk',
        when: 'Both S3-04 and S3-05 apply.',
        then: 'Red — "Unlikely to proceed". The agent is pointed at pathway and alternative courses and told admissions will review before any offer.',
        effect: 'routes',
      },
      {
        id: 'S3-07',
        title: 'English score below the requirement',
        when: 'A verified English result does not meet the course rule (overall or any band).',
        then: 'Amber — re-sit, or consider a pathway course that includes academic English. Shown here, not in Step 2, so document reading stays separate from assessment.',
        effect: 'warns',
      },
      {
        id: 'S3-08',
        title: 'Teaching programme — additional checks',
        when: 'The course is a teaching or education programme.',
        then: 'Amber — police vetting and two referee reports are required by the Teaching Council, and the school interviews every applicant before an offer. Outstanding items are listed; the interview is scheduled once documents are complete.',
        effect: 'warns',
        status: 'planned',
      },
      {
        id: 'S3-09',
        title: 'Rejected files carried forward',
        when: 'A file was rejected in Step 2 (unreadable, incomplete, no stamp or signature).',
        then: 'The documents check lists it as needing replacement and links back to Step 2, where the fix is shown next to the file.',
        effect: 'informs',
      },
    ],
  },
  {
    step: 4,
    title: 'Answers',
    dependencies: {
      data: [
        {
          name: 'Application form schema',
          detail: 'Questions, required flags, conditional parents and validation rules.',
          rules: ['S4-03', 'S4-04', 'S4-10'],
        },
        {
          name: 'AI-extracted fields with sources',
          detail: 'Values read from documents in Step 2 with document and page reference.',
          rules: ['S4-01', 'S4-02', 'S4-06', 'S4-11', 'S4-14'],
        },
        {
          name: 'Intake date and date of birth',
          detail: 'Drive under-18 and onshore / offshore derivations.',
          rules: ['S4-05', 'S4-13'],
        },
        {
          name: 'Course flags',
          detail: 'Neurodiverse-support flag for the Health section.',
          rules: ['S4-12'],
        },
        {
          name: 'Reference lists',
          detail: 'Countries, main-activity codes, visa types, address formats per country.',
          rules: ['S4-06', 'S4-08'],
        },
      ],
      decisions: [
        { name: 'Answer counts as complete', detail: 'AI-filled values must be confirmed; validation must pass; conflicts resolved.', rules: ['S4-01', 'S4-02', 'S4-04'] },
        { name: 'Which questions apply', detail: 'Conditional and derived questions shown only when the parent answer applies.', rules: ['S4-03', 'S4-05'] },
        { name: 'Under-18 safeguards', detail: 'Guardian and approved accommodation required when under 18 at intake.', rules: ['S4-13'] },
        { name: 'Offer conditions added', detail: '“Agent will arrange English test” adds an English condition.', rules: ['S4-07'] },
        { name: 'Ready to submit', detail: 'Requirements met and every applicable required answer complete.', rules: ['S4-10'] },
      ],
      externalApis: [
        { name: 'Address lookup', detail: 'Country-scoped address autocomplete (e.g. Google Places / Loqate); manual entry remains.', rules: ['S4-08'] },
        { name: 'Email validation', detail: 'Syntax and deliverability check on student and emergency contact emails.', rules: ['S4-04'], status: 'planned' },
      ],
      internalApis: [
        { name: 'Form schema service', detail: 'Questions, conditional logic and validation per course / intake.', rules: ['S4-03', 'S4-04'] },
        { name: 'Extraction results', detail: 'AI values with confidence and source links for confirmation.', rules: ['S4-01', 'S4-14'] },
        { name: 'Special admissions / RPL evidence', detail: 'Upload and attach supporting evidence to the application.', rules: ['S4-09'] },
      ],
    },
    summary:
      'Three buckets in order: resolve conflicts, confirm what AI read, then complete the answers the documents cannot provide.',
    rules: [
      {
        id: 'S4-01',
        title: 'Confirm AI-read fields',
        when: 'A field was filled by AI from a document.',
        then: 'It must be confirmed (or corrected) before it counts as complete.',
        effect: 'blocks',
      },
      {
        id: 'S4-02',
        title: 'Name mismatch',
        when: 'A name read from the passport differs from a name already typed by the agent.',
        then: 'The field appears in the Conflicts bucket with both values; the agent picks one before the application is ready to submit.',
        effect: 'blocks',
      },
      {
        id: 'S4-03',
        title: 'Conditional questions',
        when: 'A question depends on an earlier answer (e.g. NZ visa type only when in New Zealand).',
        then: 'It is only shown and required when the parent answer applies.',
        effect: 'informs',
      },
      {
        id: 'S4-04',
        title: 'Field validation',
        when: 'An email is invalid, a year is not four digits, the emergency contact email matches the student, or a gap end date is before its start.',
        then: 'The field shows an error and does not count as complete.',
        effect: 'blocks',
      },
      {
        id: 'S4-05',
        title: 'Derived answers',
        when: 'Date of birth, intake date and "Currently in New Zealand?" are known.',
        then: 'Under 18 at course start and Onshore / offshore are worked out automatically.',
        effect: 'informs',
      },
      {
        id: 'S4-06',
        title: 'Suggested defaults',
        when: 'A field is empty and a sensible default exists.',
        then: 'Preferred name defaults to given name, main activity to "09 Overseas" for offshore students, and secondary school details from the transcript. Anything the agent types wins.',
        effect: 'informs',
      },
      {
        id: 'S4-07',
        title: 'English test to follow',
        when: 'No English test was read and the agent ticks "Agent will arrange an English test".',
        then: 'Test type and score are hidden and the English test becomes a condition on the offer.',
        effect: 'informs',
      },
      {
        id: 'S4-08',
        title: 'Address lookup',
        when: 'The agent enters the home address.',
        then: 'Country is chosen first, then a search suggests addresses for that country and fills the lines. Manual entry stays available.',
        effect: 'informs',
      },
      {
        id: 'S4-09',
        title: 'Special admissions and RPL',
        when: 'A qualification was flagged in Step 2.',
        then: 'The section under Education history is highlighted and the agent can upload supporting evidence. It is optional.',
        effect: 'warns',
      },
      {
        id: 'S4-11',
        title: 'Gender as on passport',
        when: 'The passport is read.',
        then: 'Gender is taken as shown on the passport. Preferred gender is a separate optional answer and never overrides the passport value.',
        effect: 'informs',
      },
      {
        id: 'S4-12',
        title: 'Neurodiverse learning support',
        when: 'The chosen course is flagged as supporting neurodiverse learners.',
        then: 'Health shows "This course supports dyslexia, ADHD and neurodiverse learning". Every application asks whether the student has dyslexia, ADHD or another neurodiverse condition (details required if yes), then asks about other medical conditions separately.',
        effect: 'informs',
      },
      {
        id: 'S4-13',
        title: 'Under 18 at course start',
        when: 'The student will be under 18 on the intake start date.',
        then: 'Guardian details and approved accommodation (homestay or caregiver) become required, and the declaration on accommodation applies.',
        effect: 'blocks',
        status: 'planned',
        automation: 'Age worked out from date of birth (passport) and intake start date.',
      },
      {
        id: 'S4-14',
        title: 'AI-suggested answers need a source',
        when: 'AI fills or suggests any answer.',
        then: 'The answer links to the document and page it came from. Suggestions without a source are not allowed.',
        effect: 'informs',
        status: 'poc',
      },
      {
        id: 'S4-10',
        title: 'Ready to submit',
        when: 'Requirements are met and every required, applicable answer is complete.',
        then: 'The checklist reads "Ready to submit" and an offer can be generated.',
        effect: 'informs',
      },
    ],
  },
  {
    step: 5,
    title: 'Review and offer',
    dependencies: {
      data: [
        {
          name: 'INZ refusal band',
          detail: 'From Step 3: low / potential / high for the student’s citizenship × course type.',
          rules: ['S5-02', 'S5-03', 'S5-04', 'S5-15'],
        },
        {
          name: 'Agent profile and rights',
          detail: 'Status, “Create conditional offer” right, scholarship rights held.',
          rules: ['S5-09', 'S5-10', 'S5-11', 'S5-12'],
        },
        {
          name: 'Living-cost and tuition figures',
          detail: 'INZ living-cost requirement (NZD 20,000) plus first-year tuition for the course.',
          rules: ['S5-05', 'S5-16'],
        },
        {
          name: 'Open conditions',
          detail: 'English test, outstanding documents, student conditions from Steps 2–4.',
          rules: ['S5-02', 'S5-08'],
        },
        {
          name: 'Offer letter templates',
          detail: 'Agent-issued (no pricing) and UP-issued (pricing and scholarships) variants.',
          rules: ['S5-13', 'S5-14'],
        },
      ],
      decisions: [
        { name: 'Route: auto-issue or admissions review', detail: 'Admissions note, previous refusal, high refusal risk, probation or no offer right → UP review.', rules: ['S5-01', 'S5-04', 'S5-09', 'S5-10'] },
        { name: 'Agent conditional LoO allowed', detail: 'Active agent with the right, refusal risk low or potential, declarations accepted → conditional LoO with open conditions only, no pricing. Unconditional when no conditions remain.', rules: ['S5-02', 'S5-03', 'S5-06', 'S5-09', 'S5-13'] },
        { name: 'Visa evidence requirement', detail: 'High → mandatory before submit; potential → optional, never blocks; low → not shown.', rules: ['S5-03', 'S5-04', 'S5-05'] },
        { name: 'Proof of funds verdict', detail: 'Holder matches, under 28 days old, balance ≥ tuition + NZD 20,000.', rules: ['S5-16'] },
        { name: 'Scholarship request', detail: 'Only scholarships the agent holds rights for; logged for UP approval.', rules: ['S5-12'] },
        { name: 'Fast track flag', detail: 'Student ready to commit → flagged and logged.', rules: ['S5-07'] },
      ],
      externalApis: [
        { name: 'INZ statistics', detail: 'Same refusal-rate feed as Step 3.', rules: ['S5-15'], status: 'planned' },
        { name: 'Bank statement AI / open banking', detail: 'Read statement holder, date and balance; optional direct verification where the bank supports it.', rules: ['S5-16'], status: 'planned' },
        { name: 'Email delivery', detail: 'Send the offer letter to the student when “UP emails the offer” is on.', rules: ['S5-14'] },
      ],
      internalApis: [
        { name: 'Agent permissions', detail: 'Status, conditional-offer right and scholarship rights for the signed-in agent.', rules: ['S5-09', 'S5-10', 'S5-11', 'S5-12'] },
        { name: 'Offer generation', detail: 'Create conditional / unconditional LoO from the template with conditions, no pricing for agent-issued.', rules: ['S5-02', 'S5-13'] },
        { name: 'Admissions queue', detail: 'Submit for UP review with evidence, note and reason for routing.', rules: ['S5-01', 'S5-04', 'S5-10'] },
        { name: 'Pricing & scholarships', detail: 'Tuition for the course and approved scholarships, applied only by UP admissions.', rules: ['S5-12', 'S5-13'] },
        { name: 'Activity log', detail: 'Record fast track, scholarship requests and offer events.', rules: ['S5-07', 'S5-12'] },
      ],
    },
    summary:
      'Decide which offer the platform can issue now, or whether UP admissions needs to review first.',
    rules: [
      {
        id: 'S5-01',
        title: 'Admissions review route',
        when: 'There is a note to admissions, the student has a previous visa refusal, or the INZ refusal risk is high.',
        then: 'The application goes to UP admissions review instead of auto-issuing. Potential refusal risk on its own does not route to review.',
        effect: 'routes',
      },
      {
        id: 'S5-02',
        title: 'Low visa risk',
        when: 'The INZ refusal rate for the student’s citizenship and course type is under 20%.',
        then: 'Unconditional offer, or conditional if student conditions such as an English test are still open.',
        effect: 'routes',
      },
      {
        id: 'S5-03',
        title: 'Potential INZ refusal risk',
        when: 'The refusal rate is between 20% and 60%.',
        then: 'Same offer outcome as low risk. The visa risk evidence section is shown as optional and never blocks submission.',
        effect: 'routes',
      },
      {
        id: 'S5-04',
        title: 'High INZ refusal risk',
        when: 'The refusal rate is 60% or higher.',
        then: 'No offer from the platform; visa risk evidence is mandatory and UP admissions reviews it first.',
        effect: 'blocks',
      },
      {
        id: 'S5-05',
        title: 'Risk evidence',
        when: 'Risk is high (mandatory) or potential (optional).',
        then: `The agent provides a study purpose of at least ${PURPOSE_MIN_CHARS} characters, addresses any refusals, and confirms funds for first-year tuition plus NZD 20,000 living costs with proof uploaded. Only high risk blocks submission until complete.`,
        effect: 'blocks',
      },
      {
        id: 'S5-06',
        title: 'Declarations',
        when: 'Any declaration is not accepted.',
        then: 'The application cannot be submitted.',
        effect: 'blocks',
      },
      {
        id: 'S5-07',
        title: 'Fast track',
        when: 'The agent marks the student as ready to commit.',
        then: 'The application is flagged as fast track and it is logged in the activity.',
        effect: 'informs',
      },
      {
        id: 'S5-08',
        title: 'Moving to unconditional',
        when: 'A conditional offer has open conditions.',
        then: 'The dashboard lists only what the agent still has to provide; UP’s own sign-off is not shown.',
        effect: 'informs',
      },
      {
        id: 'S5-09',
        title: 'Who can create a conditional offer',
        when: 'The agent is Active and has the "Create conditional offer" right on their profile.',
        then: 'They can generate a conditional offer from the platform (if the visa risk and readiness rules allow). Without the right, the application goes to UP, who create the offer.',
        effect: 'routes',
        automation: 'Right set by UP under Agents → profile → Conditional offer.',
      },
      {
        id: 'S5-10',
        title: 'Agents on probation',
        when: 'The agent’s status is Probation.',
        then: 'They can submit, but no offer is generated from their account; every application goes to UP for review.',
        effect: 'routes',
      },
      {
        id: 'S5-11',
        title: 'Suspended or disabled agents',
        when: 'The agent’s status is Suspended or Disabled.',
        then: 'Submit is disabled with the reason. Applications already in progress continue with UP.',
        effect: 'blocks',
      },
      {
        id: 'S5-12',
        title: 'Requesting a scholarship',
        when: 'The agent has scholarship rights (e.g. Regional, Early-bird, Academic merit).',
        then: 'They can request any scholarship they hold for this student, with an optional reason. The request is logged on the application for UP admissions to approve. Agents without rights see none and are pointed to their regional manager.',
        effect: 'informs',
        automation: 'Planned: AI pre-checks eligibility (e.g. campus for Regional, GPA 3.5+ for Academic merit) and shows a hint before submit.',
      },
      {
        id: 'S5-13',
        title: 'No pricing on self-issued offers',
        when: 'An agent generates a conditional offer themselves.',
        then: 'The letter has no pricing or scholarships. Pricing and approved scholarships only appear on a conditional or unconditional offer created by the UP admissions team after review.',
        effect: 'informs',
      },
      {
        id: 'S5-14',
        title: 'UP emails the offer to the student',
        when: 'A conditional offer is generated.',
        then: '"UP emails the offer to the student" is on by default. The agent can turn it off and send it themselves.',
        effect: 'informs',
      },
      {
        id: 'S5-15',
        title: 'Visa risk from INZ data',
        when: 'Citizenship and course type are known.',
        then: 'The INZ refusal rate for that combination sets the band — low under 20%, potential 20–60%, high 60% and over — which drives S5-02 to S5-04.',
        effect: 'routes',
        automation: 'Immigration New Zealand student visa decision data by nationality and course level, refreshed quarterly.',
      },
      {
        id: 'S5-16',
        title: 'Proof of funds check',
        when: 'A bank statement is uploaded as risk evidence.',
        then: 'AI checks the account holder matches the student or a declared sponsor, the statement is under 28 days old, and the balance covers first-year tuition plus NZD 20,000. Shortfalls are flagged to the agent.',
        effect: 'warns',
        status: 'planned',
        automation: 'Vision model extracts holder, date, currency and closing balance; currency converted to NZD at the day’s rate.',
      },
    ],
  },
]
