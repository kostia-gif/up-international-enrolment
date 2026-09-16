// Synthetic document facsimiles for the in-app viewer. The prototype has no
// real files, so we render representative "original" and "translated" content
// keyed off the document type and language. This lets an agent open any
// document and compare the source-language scan against its English rendering.
import type { Document } from './types'

export interface PreviewPane {
  heading: string
  dir?: 'ltr' | 'rtl'
  // A page is a titled block of lines; multi-page docs render stacked.
  pages: { title?: string; lines: string[] }[]
}

export interface DocPreview {
  original: PreviewPane
  translated?: PreviewPane
}

// English body per document type — reused as the translated pane for
// non-English originals, and as the sole pane for English documents.
function englishBody(type: string): { title?: string; lines: string[] }[] {
  switch (type) {
    case 'Passport':
      return [
        {
          title: 'Passport — biographical page',
          lines: [
            'Type: P    Country code: —    Passport No: ••••••',
            'Surname / Given names: (as printed)',
            'Nationality: —    Date of birth: —',
            'Sex: —    Place of birth: —',
            'Date of issue: —    Date of expiry: —',
            'Authority: Department of Immigration',
            'P<<SURNAME<<GIVEN<NAMES<<<<<<<<<<<<<<<<<<<<<',
            '••••••<0—<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<06',
          ],
        },
      ]
    case 'Transcript':
      return [
        {
          title: 'Academic transcript',
          lines: [
            'Institution: (secondary school)',
            'Programme: High School Diploma',
            'Year of completion: —',
            '',
            'Subject                     Grade',
            'Mathematics                 A',
            'English                     B+',
            'Physics                     A-',
            'Chemistry                   B',
            'Overall GPA / average: — of —',
            'Award status: Completed',
          ],
        },
      ]
    case 'EnglishTest':
      return [
        {
          title: 'English proficiency — test report form',
          lines: [
            'Test: IELTS Academic / PTE Academic',
            'Candidate ID: —    Test date: —',
            'Listening: —   Reading: —',
            'Writing: —     Speaking: —',
            'Overall band / score: —',
            'Report validity: 2 years from test date',
            'Test centre: authorised centre',
          ],
        },
      ]
    case 'CV':
      return [
        {
          title: 'Curriculum vitae',
          lines: [
            'Profile: prospective international student',
            'Experience: relevant roles and duration listed',
            'Education: prior qualifications listed',
            'Skills: summarised',
            'References: available on request',
          ],
        },
      ]
    case 'Reference':
      return [
        {
          title: 'Reference letter',
          lines: [
            'To whom it may concern,',
            'I confirm my association with the applicant and',
            'recommend them for study. Their conduct and',
            'aptitude were of a consistently high standard.',
            'Signed, (referee name and title)',
          ],
        },
      ]
    case 'FinancialEvidence':
      return [
        {
          title: 'Bank statement — summary',
          lines: [
            'Account holder: sponsor / applicant',
            'Bank: (issuing bank)',
            'Closing balance: sufficient for tuition + living',
            'Statement period: last 3 months',
            'Currency converted to NZD for assessment',
          ],
        },
      ]
    case 'InsuranceEvidence':
      return [
        {
          title: 'Insurance policy — schedule',
          lines: [
            'Policy type: travel & medical',
            'Insured: applicant (and family)',
            'Cover period: full duration of stay',
            'Underwriter: (provider)',
            'Meets NauMai NZ / provider cover standard',
          ],
        },
      ]
    default:
      return [
        {
          title: 'Supporting document',
          lines: ['Supporting evidence attached to this application.'],
        },
      ]
  }
}

// Short, believable native-script snippets so the "original" pane reads as a
// genuine source-language scan rather than Latin placeholder text.
const NATIVE: Record<string, { title: string; lines: string[] }> = {
  Vietnamese: {
    title: 'Bản gốc (Tiếng Việt)',
    lines: [
      'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
      'Học bạ / Bảng điểm trung học phổ thông',
      'Trường: (tên trường)   Năm tốt nghiệp: —',
      'Môn học                     Điểm',
      'Toán                        8.5',
      'Ngữ văn                     7.0',
      'Vật lý                      8.0',
      'Điểm trung bình: — / 10   Xếp loại: Giỏi',
    ],
  },
  Chinese: {
    title: '原件 (中文)',
    lines: [
      '中华人民共和国',
      '普通高级中学 学业成绩单',
      '学校：(学校名称)   毕业年份：—',
      '科目            成绩',
      '数学            优',
      '语文            良',
      '物理            优',
      '平均分：— / 100   等级：优秀',
    ],
  },
  Arabic: {
    title: 'المستند الأصلي (العربية)',
    lines: [
      'المملكة العربية السعودية',
      'كشف الدرجات / الشهادة',
      'المؤسسة: (اسم المعهد)   سنة التخرج: —',
      'المادة            الدرجة',
      'اللغة الإنجليزية      جيد جدًا',
      'إدارة السياحة        امتياز',
      'المعدل التراكمي: — الحالة: مكتمل',
    ],
  },
}

export function getDocPreview(doc: Document): DocPreview {
  const english = englishBody(doc.type)
  const isEnglishSource = /english/i.test(doc.language)

  if (isEnglishSource || !doc.translatedPdf) {
    // English (or untranslated) source — single pane in the source language.
    return {
      original: {
        heading: `Original — ${doc.language}`,
        pages: english,
      },
    }
  }

  // Non-English source with a translation attached.
  const native = NATIVE[doc.language]
  const original: PreviewPane = {
    heading: `Original — ${doc.language}`,
    dir: doc.language === 'Arabic' ? 'rtl' : 'ltr',
    pages: native
      ? [{ title: native.title, lines: native.lines }]
      : [{ title: `Original (${doc.language})`, lines: english[0]?.lines ?? [] }],
  }
  return {
    original,
    translated: {
      heading: 'Translated to English',
      pages: english,
    },
  }
}
