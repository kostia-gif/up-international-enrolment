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

export interface StepRules {
  step: 1 | 2 | 3 | 4 | 5
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
    title: 'Course and intake',
    summary:
      'Pick a course and intake that are still open. The student is identified from the passport in Step 2, which also stops duplicates early.',
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
    summary:
      'Business rules run over what Step 2 read and verified. The result is a traffic light: green proceeds, amber proceeds with action, red is unlikely to proceed. Step 2 itself only reads, translates and checks documents are complete.',
    rules: [
      {
        id: 'S3-01',
        title: 'All documents collected, entry met, low visa risk',
        when: 'Every required document is read, the transcript and English meet the course entry level, and INZ approval for this nationality and course type is 80% or higher.',
        then: 'Green — "Ready to apply". Applications like this have high acceptance; the agent continues to Answers and an offer can be issued straight away.',
        effect: 'informs',
      },
      {
        id: 'S3-02',
        title: 'Documents complete, elevated visa risk',
        when: 'Documents and entry are fine, but INZ approval for this nationality and course type is between 60% and 80%.',
        then: 'Amber — more information will be requested in the application: reason for study, financial evidence (bank statements or sponsor), and any study gaps or previous refusals. A conditional offer is still possible.',
        effect: 'warns',
        automation: 'Lookup on nationality × course level against the INZ Student Visa decision dataset, refreshed monthly.',
      },
      {
        id: 'S3-03',
        title: 'Some documents missing, entry met so far',
        when: 'What has been read meets the entry level, but one or more required documents (typically English) are not uploaded.',
        then: 'Green — "Ready for a conditional offer". The missing items are listed with "upload when collected" and become conditions on the offer. The agent may create a conditional offer if their account allows it.',
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
        title: 'High visa risk',
        when: 'INZ approval for this nationality and course type is below 60%.',
        then: 'Amber with a strong warning — the agent can proceed, but admissions reviews statement of purpose, proof of funds and home-country ties before any offer. If the qualification also falls short the overall result is red.',
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
    summary:
      'Decide which offer the platform can issue now, or whether UP admissions needs to review first.',
    rules: [
      {
        id: 'S5-01',
        title: 'Admissions review route',
        when: 'There is a note to admissions, or the student has a previous visa refusal.',
        then: 'The application goes to UP admissions review instead of auto-issuing.',
        effect: 'routes',
      },
      {
        id: 'S5-02',
        title: 'Low visa risk',
        when: 'The approval rate for the student’s citizenship and course type is high.',
        then: 'Unconditional offer, or conditional if student conditions such as an English test are still open.',
        effect: 'routes',
      },
      {
        id: 'S5-03',
        title: 'Elevated visa risk',
        when: 'The approval rate is in the elevated band.',
        then: 'Conditional offer only, once risk evidence is provided.',
        effect: 'routes',
      },
      {
        id: 'S5-04',
        title: 'High visa risk',
        when: 'The approval rate is in the high-risk band.',
        then: 'No offer from the platform; UP admissions reviews the evidence first.',
        effect: 'blocks',
      },
      {
        id: 'S5-05',
        title: 'Risk evidence',
        when: 'Risk is elevated or high.',
        then: `The agent provides a study purpose of at least ${PURPOSE_MIN_CHARS} characters, addresses any refusals, and confirms funds for first-year tuition plus NZD 20,000 living costs with proof uploaded.`,
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
        then: 'The approval rate for that combination sets the risk band (low, elevated, high), which drives S4-02 to S4-04.',
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
