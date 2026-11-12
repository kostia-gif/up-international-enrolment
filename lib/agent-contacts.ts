// Agency staff contact details. Kept apart from fixtures so validation rules
// can check them without importing the whole fixture set.
export const AGENT_CONTACTS: Record<string, { email: string; phone: string; agentCode: string }> = {
  'c-grace': { email: 'grace.tan@pacificstudylink.com', phone: '+64 9 555 0141', agentCode: 'PSL-0101' },
  'c-mei': { email: 'mei.lin@pacificstudylink.com', phone: '+64 9 555 0162', agentCode: 'PSL-0114' },
  'c-james': { email: 'james.okoro@pacificstudylink.com', phone: '+64 9 555 0187', agentCode: 'PSL-0122' },
}

// Any address on the agency's own domain counts as an agent email, not just
// the named counsellors above.
export const AGENCY_EMAIL_DOMAINS = ['pacificstudylink.com']

const digits = (s: string) => s.replace(/\D/g, '')

export function isAgentEmail(email: string): boolean {
  const e = email.trim().toLowerCase()
  if (!e) return false
  const domain = e.split('@')[1] ?? ''
  return (
    AGENCY_EMAIL_DOMAINS.includes(domain) ||
    Object.values(AGENT_CONTACTS).some((c) => c.email.toLowerCase() === e)
  )
}

export function isAgentPhone(phone: string): boolean {
  const p = digits(phone)
  return p.length > 0 && Object.values(AGENT_CONTACTS).some((c) => digits(c.phone) === p)
}

export function samePhone(a: string, b: string): boolean {
  const da = digits(a)
  return da.length > 0 && da === digits(b)
}
