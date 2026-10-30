import type { Course, Requirement } from './types'
import { newIdSync } from './id'

export function isTeachingCourse(course: Pick<Course, 'programmeName'>): boolean {
  return /teaching|education/i.test(course.programmeName)
}

// Derive the requirement checklist for the selected course + nationality.
// Every item starts "missing"; documents flip them to "met" in Step 2.
export function deriveRequirements(course: Course | undefined, nationality: string): Requirement[] {
  const reqs: Requirement[] = []
  const add = (label: string, category: Requirement['category'], note?: string) =>
    reqs.push({ id: newIdSync('req'), label, category, status: 'missing', note })

  add('Passport is valid', 'identity')
  add('Expiry after course end date', 'identity')

  if (course?.levelGroup === 'Postgraduate') {
    add('Bachelor degree or equivalent completed', 'academic')
  } else {
    add('Secondary school completion', 'academic')
  }
  add('Minimum entry scores met', 'academic')

  // English must be valid on the programme start date. A missing test becomes
  // a condition on the offer rather than a blocker.
  add('English evidence valid on start date', 'english')

  if (course) add('Programme and intake selected', 'course')

  // Teaching programmes carry Teaching Council vetting and an admission interview.
  if (course && isTeachingCourse(course)) {
    add('Police vetting / criminal record check', 'other', 'Required by the Teaching Council')
    add('Two referee reports', 'other')
    add('Admission interview', 'other', 'Scheduled by the school after documents are checked')
  }

  // Hong Kong / Macau / Taiwan are not "China" — verified on the passport.
  const special = ['Hong Kong', 'Macau', 'Taiwan']
  if (special.includes(nationality)) {
    reqs[0].note = `Nationality is ${nationality}, not China — verify on passport`
  }

  return reqs
}
