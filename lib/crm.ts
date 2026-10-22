import type { Application } from './types'

// The record pushed to Dynamics 365. Field names are placeholders for the
// delivery partner to map onto the real UP entity schema.
export interface CrmApplicationPayload {
  up_preid: string
  up_agentid: string
  up_agencyid: string
  up_agentreference: string | null
  up_givenname: string
  up_familyname: string
  up_dateofbirth: string
  up_nationality: string
  up_passportnumber: string
  up_passportexpiry: string
  up_email: string
  up_mobile: string
  up_highestqualification: string
  up_institution: string
  up_institutioncountry: string
  up_studyendyear: string
  up_qualificationcompleted: string
  up_englishtesttype: string | null
  up_englishtestscore: string | null
  up_englishtestdate: string | null
  up_englishtestexpiry: string | null
  up_englishverifiedby: string | null
  up_brand: string
  up_programmename: string
  up_nzqalevel: string
  up_campus: string
  up_intakedate: string
  up_pricebundle: string
  up_route: 'auto' | 'review'
  up_stage: string
  up_offerconditions: { up_label: string; up_owner: string; up_status: string }[]
  up_documents: {
    up_type: string
    up_filename: string
    up_language: string
    up_translated: boolean
  }[]
  up_notetoadmissions: string | null
  up_pushedat: string
}

export function toCrmPayload(app: Application, pushedAt: string): CrmApplicationPayload {
  const v = (key: string) => app.fields.find((f) => f.key === key)?.value ?? ''
  const opt = (key: string) => v(key) || null
  const englishDoc = app.documents.find((d) => d.type === 'EnglishTest' && d.verifiedBy)

  return {
    up_preid: app.preId,
    up_agentid: app.agentId,
    up_agencyid: app.agencyId,
    up_agentreference: app.agentRef || null,
    up_givenname: v('given_name'),
    up_familyname: v('family_name'),
    up_dateofbirth: v('dob'),
    up_nationality: v('nationality'),
    up_passportnumber: v('passport_number'),
    up_passportexpiry: v('passport_expiry'),
    up_email: v('email'),
    up_mobile: v('mobile'),
    up_highestqualification: v('highest_qual'),
    up_institution: v('institution'),
    up_institutioncountry: v('institution_country'),
    up_studyendyear: v('study_end'),
    up_qualificationcompleted: v('qual_completed'),
    up_englishtesttype: opt('english_test_type'),
    up_englishtestscore: opt('english_test_score'),
    up_englishtestdate: opt('english_test_date'),
    up_englishtestexpiry: opt('english_test_expiry'),
    up_englishverifiedby: englishDoc?.verifiedBy ?? null,
    up_brand: app.course.brand,
    up_programmename: app.course.programmeName,
    up_nzqalevel: app.course.level,
    up_campus: app.course.campus,
    up_intakedate: app.course.intakeDate,
    up_pricebundle: app.course.priceBundle,
    up_route: app.route,
    up_stage: app.stage,
    up_offerconditions: app.conditions.map((c) => ({
      up_label: c.label,
      up_owner: c.owner,
      up_status: c.status,
    })),
    up_documents: app.documents
      .filter((d) => d.status === 'checked')
      .map((d) => ({
        up_type: d.type,
        up_filename: d.fileName || d.originalName,
        up_language: d.language,
        up_translated: !!d.translatedPdf,
      })),
    up_notetoadmissions: app.notesToAdmissions?.trim() || null,
    up_pushedat: pushedAt,
  }
}

// Stamp the application with a fresh CRM push.
export function withCrmPush(app: Application, ts = new Date().toISOString()): Application {
  return { ...app, crmPushedAt: ts, crmPayload: toCrmPayload(app, ts) }
}
