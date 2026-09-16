import type { Course, Requirement } from './types'
import { newIdSync } from './id'

// Derive the requirement checklist for the selected course(s) + nationality.
// Every item starts "missing"; documents flip them to "met" in Step 2.
export function deriveRequirements(
  courses: Course[],
  nationality: string,
): Requirement[] {
  const reqs: Requirement[] = []
  const add = (
    label: string,
    category: Requirement['category'],
    note?: string,
  ) => reqs.push({ id: newIdSync('req'), label, category, status: 'missing', note })

  const levels = courses.map((c) => c.levelGroup)

  // Identity — always
  add('Passport is valid', 'identity')
  add('Expiry after course end date', 'identity')

  // Academic — the highest level in the selection sets the entry qualification
  if (levels.includes('Postgraduate')) {
    add('Bachelor degree or equivalent completed', 'academic')
  } else {
    add('Secondary school completion', 'academic')
  }
  add('Minimum entry scores met', 'academic')

  // English — always, must be valid on the programme start date. Left
  // outstanding for the pilot when no test is provided (awaiting evidence).
  add('English evidence valid on start date', 'english')

  // Other
  add('Genuine intent (CV or statement) reviewed', 'other')

  // Nationality note (Hong Kong / Macau / Taiwan are not "China") — verified
  // against the passport identity item.
  const special = ['Hong Kong', 'Macau', 'Taiwan']
  if (special.includes(nationality)) {
    reqs[0].note = `Nationality is ${nationality}, not China — verify on passport`
  }

  return reqs
}
