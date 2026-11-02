// Generated from the UPIC Partner Degree Products export (2 Nov 2026).
// 881 CRM products: UoA 839, AUT 24, VUW 18.
// Note: 3 CRM rows spell "Bachelor of Engineering (Hon)"; normalised to "(Honours)" in `degrees` only — `name` keeps the CRM spelling.
// UoA products are degree (+ optional conjoint degree) x major. AUT/VUW are flat programme names.

export type PathwayUniversity = 'UoA' | 'AUT' | 'VUW'

export interface Destination {
  id: string // CRM product ID — this is what gets written to Dynamics
  university: PathwayUniversity
  degrees: string[] // one degree, or two for a conjoint
  major: string | null
  name: string // CRM product name, as exported
}

export const DESTINATIONS: Destination[] = [
  {
    "id": "AUT112 - 2024 new",
    "university": "AUT",
    "degrees": [
      "Bachelor of Health Science (Midwifery)"
    ],
    "major": null,
    "name": "Bachelor of Health Science (Midwifery)"
  },
  {
    "id": "AUT125",
    "university": "AUT",
    "degrees": [
      "Bachelor of Construction"
    ],
    "major": null,
    "name": "Bachelor of Construction"
  },
  {
    "id": "AUT100",
    "university": "AUT",
    "degrees": [
      "Bachelor of Creative Technologies"
    ],
    "major": null,
    "name": "Bachelor of Creative Technologies"
  },
  {
    "id": "AUT101",
    "university": "AUT",
    "degrees": [
      "Bachelor of Education [Specialty] Teaching"
    ],
    "major": null,
    "name": "Bachelor of Education [Specialty] Teaching"
  },
  {
    "id": "AUT102",
    "university": "AUT",
    "degrees": [
      "Bachelor of Medical Laboratory Science (BMLS)"
    ],
    "major": null,
    "name": "Bachelor of Medical Laboratory Science (BMLS)"
  },
  {
    "id": "AUT103",
    "university": "AUT",
    "degrees": [
      "Bachelor of Arts (BA)"
    ],
    "major": null,
    "name": "Bachelor of Arts (BA)"
  },
  {
    "id": "AUT104",
    "university": "AUT",
    "degrees": [
      "Bachelor of Architecture and Future Environments"
    ],
    "major": null,
    "name": "Bachelor of Architecture and Future Environments"
  },
  {
    "id": "AUT105",
    "university": "AUT",
    "degrees": [
      "Bachelor of Communication Studies"
    ],
    "major": null,
    "name": "Bachelor of Communication Studies"
  },
  {
    "id": "AUT106",
    "university": "AUT",
    "degrees": [
      "Bachelor of Business (BBus)"
    ],
    "major": null,
    "name": "Bachelor of Business (BBus)"
  },
  {
    "id": "AUT107",
    "university": "AUT",
    "degrees": [
      "Bachelor of Engineering (Hons)"
    ],
    "major": null,
    "name": "Bachelor of Engineering (Hons)"
  },
  {
    "id": "AUT108",
    "university": "AUT",
    "degrees": [
      "Bachelor of Engineering Technology"
    ],
    "major": null,
    "name": "Bachelor of Engineering Technology"
  },
  {
    "id": "AUT109",
    "university": "AUT",
    "degrees": [
      "Bachelor of Health Science (Nursing)"
    ],
    "major": null,
    "name": "Bachelor of Health Science (Nursing)"
  },
  {
    "id": "AUT110",
    "university": "AUT",
    "degrees": [
      "Bachelor of Health Science-Occupational Therapy"
    ],
    "major": null,
    "name": "Bachelor of Health Science-Occupational Therapy"
  },
  {
    "id": "AUT111",
    "university": "AUT",
    "degrees": [
      "Bachelor of Health Science-Oral Health"
    ],
    "major": null,
    "name": "Bachelor of Health Science-Oral Health"
  },
  {
    "id": "AUT113",
    "university": "AUT",
    "degrees": [
      "Bachelor of Health Science -Physiotherapy"
    ],
    "major": null,
    "name": "Bachelor of Health Science -Physiotherapy"
  },
  {
    "id": "AUT114",
    "university": "AUT",
    "degrees": [
      "Bachelor of Health Science-Podiatry"
    ],
    "major": null,
    "name": "Bachelor of Health Science-Podiatry"
  },
  {
    "id": "AUT116",
    "university": "AUT",
    "degrees": [
      "Bachelor of Health Science"
    ],
    "major": null,
    "name": "Bachelor of Health Science"
  },
  {
    "id": "AUT117",
    "university": "AUT",
    "degrees": [
      "Bachelor of Science (BSc)"
    ],
    "major": null,
    "name": "Bachelor of Science (BSc)"
  },
  {
    "id": "AUT118",
    "university": "AUT",
    "degrees": [
      "Bachelor of Computer and Information Sciences"
    ],
    "major": null,
    "name": "Bachelor of Computer and Information Sciences"
  },
  {
    "id": "AUT119",
    "university": "AUT",
    "degrees": [
      "Bachelor of Design"
    ],
    "major": null,
    "name": "Bachelor of Design"
  },
  {
    "id": "AUT120",
    "university": "AUT",
    "degrees": [
      "Bachelor of International Hospitality Management"
    ],
    "major": null,
    "name": "Bachelor of International Hospitality Management"
  },
  {
    "id": "AUT122",
    "university": "AUT",
    "degrees": [
      "Bachelor of Laws (LLB)"
    ],
    "major": null,
    "name": "Bachelor of Laws (LLB)"
  },
  {
    "id": "AUT123",
    "university": "AUT",
    "degrees": [
      "Bachelor of Sport, Exercise and Health"
    ],
    "major": null,
    "name": "Bachelor of Sport, Exercise and Health"
  },
  {
    "id": "AUT124",
    "university": "AUT",
    "degrees": [
      "Bachelor of Visual Arts"
    ],
    "major": null,
    "name": "Bachelor of Visual Arts"
  },
  {
    "id": "AESS-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Applied Exercise and Sports Science (Specialisation)",
    "name": "Bachelor of Science-Applied Exercise and Sports Science (Specialisation)"
  },
  {
    "id": "PSYC-BPSY_BPSY_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Psychology"
    ],
    "major": null,
    "name": "Bachelor of Psychology"
  },
  {
    "id": "FINA-BFBA_BABF_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Fine Arts"
    ],
    "major": "Fine Arts",
    "name": "Bachelor of Arts / Bachelor of Fine Arts Conjoint-Fine Arts"
  },
  {
    "id": "TESO-BEDTL_BEDTL_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Education"
    ],
    "major": "(Teaching English to Speakers of Other Languages)",
    "name": "Bachelor of Education - (Teaching English to Speakers of Other Languages)"
  },
  {
    "id": "DRMA-BAMAJ_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Drama",
    "name": "Bachelor of Arts-Drama"
  },
  {
    "id": "ACCN-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Accounting",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Accounting"
  },
  {
    "id": "ACCN-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Accounting",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Accounting"
  },
  {
    "id": "ACCN-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Accounting",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Accounting"
  },
  {
    "id": "ACCN-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Accounting",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Accounting"
  },
  {
    "id": "ACCN-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Accounting",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education Conjoint-Accounting"
  },
  {
    "id": "ACCN-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Accounting",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Accounting"
  },
  {
    "id": "ACCN-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Accounting",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Accounting"
  },
  {
    "id": "ACCN-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Accounting",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Accounting"
  },
  {
    "id": "ACCN-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Accounting",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Accounting"
  },
  {
    "id": "ACCN-BCLB_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "Accounting",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-Accounting"
  },
  {
    "id": "ACCN-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Accounting",
    "name": "Bachelor of Commerce-Accounting"
  },
  {
    "id": "ACEN-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Academic English",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: Academic English"
  },
  {
    "id": "ACEN-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Academic English",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: Academic English"
  },
  {
    "id": "ACEN-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: Academic English",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: Academic English"
  },
  {
    "id": "ACEN-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: Academic English",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: Academic English"
  },
  {
    "id": "ACEN-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Academic English",
    "name": "Bachelor of Global Studies-BGlobalSt Language: Academic English"
  },
  {
    "id": "AESL-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Academic English Studies & Linguistics",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Academic English Studies & Linguistics"
  },
  {
    "id": "AESL-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Academic English Studies & Linguistics",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Academic English Studies & Linguistics"
  },
  {
    "id": "AESL-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Academic English Studies & Linguistics",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Academic English Studies & Linguistics"
  },
  {
    "id": "AESL-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Academic English Studies & Linguistics",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Academic English Studies & Linguistics"
  },
  {
    "id": "AESL-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Academic English Studies & Linguistics",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Academic English Studies & Linguistics"
  },
  {
    "id": "AESL-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Academic English Studies & Linguistics",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Academic English Studies & Linguistics"
  },
  {
    "id": "AESL-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Academic English Studies & Linguistics",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Academic English Studies & Linguistics"
  },
  {
    "id": "AESL-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Academic English Studies & Linguistics",
    "name": "Bachelor of Arts-Academic English Studies & Linguistics"
  },
  {
    "id": "ANTH-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Anthropology",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Anthropology"
  },
  {
    "id": "ANTH-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Anthropology",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Anthropology"
  },
  {
    "id": "ANTH-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Anthropology",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Anthropology"
  },
  {
    "id": "ANTH-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Anthropology",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Anthropology"
  },
  {
    "id": "ANTH-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Anthropology",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Anthropology"
  },
  {
    "id": "ANTH-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Anthropology",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Anthropology"
  },
  {
    "id": "ANTH-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Anthropology",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Anthropology"
  },
  {
    "id": "ANTH-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Anthropology - Research 360 points",
    "name": "Bachelor of Arts-Anthropology - Research 360 points"
  },
  {
    "id": "ANTS-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Anthropological Science",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Anthropological Science"
  },
  {
    "id": "ANTS-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Anthropological Science",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Anthropological Science"
  },
  {
    "id": "ANTS-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Anthropological Science",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Anthropological Science"
  },
  {
    "id": "ANTS-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Anthropological Science",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Anthropological Science"
  },
  {
    "id": "ANTS-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Anthropological Science",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Anthropological Science"
  },
  {
    "id": "ANTS-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Anthropological Science",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Anthropological Science"
  },
  {
    "id": "ANTS-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Anthropological Science",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Anthropological Science"
  },
  {
    "id": "ANTS-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Anthropological Science",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Anthropological Science"
  },
  {
    "id": "ANTS-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Anthropological Science",
    "name": "Bachelor of Science-Anthropological Science"
  },
  {
    "id": "ANTS-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Anthropological Science",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Anthropological Science"
  },
  {
    "id": "APHY-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Applied Physics",
    "name": "Bachelor of Advanced Science (Honours)-Applied Physics"
  },
  {
    "id": "ARCH-BAS_BAS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Architectural Studies"
    ],
    "major": "Architecture",
    "name": "Bachelor of Architectural Studies-Architecture"
  },
  {
    "id": "ARTH-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Art History",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Art History"
  },
  {
    "id": "ARTH-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Art History",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Art History"
  },
  {
    "id": "ARTH-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Art History",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Art History"
  },
  {
    "id": "ARTH-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Art History",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Art History"
  },
  {
    "id": "ARTH-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Art History",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Art History"
  },
  {
    "id": "ARTH-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Art History",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Art History"
  },
  {
    "id": "ARTH-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Art History",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Art History"
  },
  {
    "id": "ARTH-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Art History",
    "name": "Bachelor of Arts-Art History"
  },
  {
    "id": "ASNS-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Asian Studies",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Asian Studies"
  },
  {
    "id": "ASNS-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Asian Studies",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Asian Studies"
  },
  {
    "id": "ASNS-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Asian Studies",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Asian Studies"
  },
  {
    "id": "ASNS-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Asian Studies",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Asian Studies"
  },
  {
    "id": "ASNS-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Asian Studies",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Asian Studies"
  },
  {
    "id": "ASNS-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Asian Studies",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Asian Studies"
  },
  {
    "id": "ASNS-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Asian Studies",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Asian Studies"
  },
  {
    "id": "ASNS-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Asian Studies",
    "name": "Bachelor of Arts-Asian Studies"
  },
  {
    "id": "BIOS-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Biological Sciences",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Biological Sciences"
  },
  {
    "id": "BIOS-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Biological Sciences",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Biological Sciences"
  },
  {
    "id": "BIOS-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Biological Sciences",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Biological Sciences"
  },
  {
    "id": "BIOS-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Biological Sciences",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Biological Sciences"
  },
  {
    "id": "BIOS-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Biological Sciences",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Biological Sciences"
  },
  {
    "id": "BIOS-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Biological Sciences",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Biological Sciences"
  },
  {
    "id": "BIOS-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Biological Sciences",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Biological Sciences"
  },
  {
    "id": "BIOS-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Biological Sciences",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Biological Sciences"
  },
  {
    "id": "BIOS-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Biological Sciences",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Biological Sciences"
  },
  {
    "id": "BIOM-BBS_BBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Biomedical Science"
    ],
    "major": null,
    "name": "Bachelor of Biomedical Science"
  },
  {
    "id": "BUAN-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Business Analytics"
  },
  {
    "id": "BUAN-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Business Analytics"
  },
  {
    "id": "BUAN-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Business Analytics"
  },
  {
    "id": "BUAN-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Business Analytics"
  },
  {
    "id": "BUAN-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education Conjoint-Business Analytics"
  },
  {
    "id": "BUAN-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Business Analytics"
  },
  {
    "id": "BUAN-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Business Analytics"
  },
  {
    "id": "BUAN-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Business Analytics"
  },
  {
    "id": "BUAN-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Business Analytics"
  },
  {
    "id": "BUAN-BCLB_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-Business Analytics"
  },
  {
    "id": "BUAN-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Business Analytics",
    "name": "Bachelor of Commerce-Business Analytics"
  },
  {
    "id": "CHEM-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Advanced Science (Honours)-Chemistry"
  },
  {
    "id": "CHEM-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Chemistry"
  },
  {
    "id": "CHEM-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Chemistry"
  },
  {
    "id": "CHEM-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Chemistry"
  },
  {
    "id": "CHEM-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Chemistry"
  },
  {
    "id": "CHEM-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Chemistry"
  },
  {
    "id": "CHEM-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Chemistry"
  },
  {
    "id": "CHEM-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Chemistry"
  },
  {
    "id": "CHEM-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Chemistry"
  },
  {
    "id": "CHEM-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Science-Chemistry"
  },
  {
    "id": "CHEM-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Chemistry",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Chemistry"
  },
  {
    "id": "CHIN-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Chinese",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Chinese"
  },
  {
    "id": "CHIN-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Chinese",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Chinese"
  },
  {
    "id": "CHIN-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Chinese",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Chinese"
  },
  {
    "id": "CHIN-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Chinese",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Chinese"
  },
  {
    "id": "CHIN-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Chinese",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Chinese"
  },
  {
    "id": "CHIN-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Chinese",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Chinese"
  },
  {
    "id": "CHIN-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Chinese",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Chinese"
  },
  {
    "id": "CHIN-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Chinese",
    "name": "Bachelor of Arts-Chinese"
  },
  {
    "id": "CHIN-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Chinese",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: Chinese"
  },
  {
    "id": "CHIN-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Chinese",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: Chinese"
  },
  {
    "id": "CHIN-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: Chinese",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: Chinese"
  },
  {
    "id": "CHIN-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: Chinese",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: Chinese"
  },
  {
    "id": "CHIN-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Chinese",
    "name": "Bachelor of Global Studies-BGlobalSt Language: Chinese"
  },
  {
    "id": "CLAN-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Classical Studies & Ancient History",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Classical Studies & Ancient History"
  },
  {
    "id": "CLAN-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Classical Studies & Ancient History",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Classical Studies & Ancient History"
  },
  {
    "id": "CLAN-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Classical Studies & Ancient History",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Classical Studies & Ancient History"
  },
  {
    "id": "CLAN-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Classical Studies & Ancient History",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Classical Studies & Ancient History"
  },
  {
    "id": "CLAN-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Classical Studies & Ancient History",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Classical Studies & Ancient History"
  },
  {
    "id": "CLAN-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Classical Studies & Ancient History",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Classical Studies & Ancient History"
  },
  {
    "id": "CLAN-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Classical Studies & Ancient History",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Classical Studies & Ancient History"
  },
  {
    "id": "CLAN-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Classical Studies & Ancient History",
    "name": "Bachelor of Arts-Classical Studies & Ancient History"
  },
  {
    "id": "COBI-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Computational Biology",
    "name": "Bachelor of Advanced Science (Honours)-Computational Biology"
  },
  {
    "id": "COMM-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Commercial Law",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Commercial Law"
  },
  {
    "id": "COMM-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Commercial Law",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Commercial Law"
  },
  {
    "id": "COMM-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Commercial Law",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Commercial Law"
  },
  {
    "id": "COMM-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Commercial Law",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Commercial Law"
  },
  {
    "id": "COMM-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Commercial Law",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education Conjoint-Commercial Law"
  },
  {
    "id": "COMM-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Commercial Law",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Commercial Law"
  },
  {
    "id": "COMM-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Commercial Law",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Commercial Law"
  },
  {
    "id": "COMM-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Commercial Law",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Commercial Law"
  },
  {
    "id": "COMM-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Commercial Law",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Commercial Law"
  },
  {
    "id": "COMM-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Commercial Law",
    "name": "Bachelor of Commerce-Commercial Law"
  },
  {
    "id": "COMP-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Advanced Science (Honours)-Computer Science"
  },
  {
    "id": "COMP-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Computer Science"
  },
  {
    "id": "COMP-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Computer Science"
  },
  {
    "id": "COMP-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Computer Science"
  },
  {
    "id": "COMP-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Computer Science"
  },
  {
    "id": "COMP-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Computer Science"
  },
  {
    "id": "COMP-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Computer Science"
  },
  {
    "id": "COMP-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Computer Science"
  },
  {
    "id": "COMP-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Computer Science"
  },
  {
    "id": "COMP-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Science-Computer Science"
  },
  {
    "id": "COMP-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Computer Science",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Computer Science"
  },
  {
    "id": "COMU-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Communication",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Communication"
  },
  {
    "id": "COMU-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Communication",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Communication"
  },
  {
    "id": "COMU-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Communication",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Communication"
  },
  {
    "id": "COMU-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Communication",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Communication"
  },
  {
    "id": "COMU-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Communication",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Communication"
  },
  {
    "id": "COMU-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Communication",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Communication"
  },
  {
    "id": "COMU-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Communication (Major)",
    "name": "Bachelor of Arts-Communication (Major)"
  },
  {
    "id": "COOK-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Cook Islands M?ori",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: Cook Islands M?ori"
  },
  {
    "id": "COOK-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Cook Islands M?ori",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: Cook Islands M?ori"
  },
  {
    "id": "COOK-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: Cook Islands M?ori",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: Cook Islands M?ori"
  },
  {
    "id": "COOK-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: Cook Islands M?ori",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: Cook Islands M?ori"
  },
  {
    "id": "COOK-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Cook Islands M?ori",
    "name": "Bachelor of Global Studies-BGlobalSt Language: Cook Islands M?ori"
  },
  {
    "id": "CPCL-BMBA_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Classical",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Creative Practice: Classical"
  },
  {
    "id": "CPCL-BMBC_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Classical",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Creative Practice: Classical"
  },
  {
    "id": "CPCL-BMBEH_BEHBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Classical",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Music Conjoint-Creative Practice: Classical"
  },
  {
    "id": "CPCL-BMBS_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Creative Practice: Classical",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Creative Practice: Classical"
  },
  {
    "id": "CPCL-BMLB_BMLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Laws"
    ],
    "major": "Creative Practice: Classical",
    "name": "Bachelor of Music / Bachelor of Laws Conjoint-Creative Practice: Classical"
  },
  {
    "id": "PER-BMUS_BMUS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music"
    ],
    "major": "Performance",
    "name": "Bachelor of Music-Performance"
  },
  {
    "id": "CPCO-BMBA_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Composition",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Creative Practice: Composition"
  },
  {
    "id": "CPCO-BMBC_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Composition",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Creative Practice: Composition"
  },
  {
    "id": "CPCO-BMBEH_BEHBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Composition",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Music Conjoint-Creative Practice: Composition"
  },
  {
    "id": "CPCO-BMBS_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Creative Practice: Composition",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Creative Practice: Composition"
  },
  {
    "id": "CPCO-BMLB_BMLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Laws"
    ],
    "major": "Creative Practice: Composition",
    "name": "Bachelor of Music / Bachelor of Laws Conjoint-Creative Practice: Composition"
  },
  {
    "id": "CPS-BMUS_BMUS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music"
    ],
    "major": "Composition",
    "name": "Bachelor of Music - Composition"
  },
  {
    "id": "CPJZ-BMBA_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Jazz",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Creative Practice: Jazz"
  },
  {
    "id": "CPJZ-BMBC_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Jazz",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Creative Practice: Jazz"
  },
  {
    "id": "CPJZ-BMBEH_BEHBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Jazz",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Music Conjoint-Creative Practice: Jazz"
  },
  {
    "id": "CPJZ-BMBS_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Creative Practice: Jazz",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Creative Practice: Jazz"
  },
  {
    "id": "CPJZ-BMLB_BMLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Laws"
    ],
    "major": "Creative Practice: Jazz",
    "name": "Bachelor of Music / Bachelor of Laws Conjoint-Creative Practice: Jazz"
  },
  {
    "id": "JAZ-BMUS_BMUS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music"
    ],
    "major": "Jazz",
    "name": "Bachelor of Music - Jazz"
  },
  {
    "id": "CPPO-BMBA_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Popular Music",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Creative Practice: Popular Music"
  },
  {
    "id": "CPPO-BMBC_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Popular Music",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Creative Practice: Popular Music"
  },
  {
    "id": "CPPO-BMBEH_BEHBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Music"
    ],
    "major": "Creative Practice: Popular Music",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Music Conjoint-Creative Practice: Popular Music"
  },
  {
    "id": "CPPO-BMBS_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Creative Practice: Popular Music",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Creative Practice: Popular Music"
  },
  {
    "id": "CPPO-BMLB_BMLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Laws"
    ],
    "major": "Creative Practice: Popular Music",
    "name": "Bachelor of Music / Bachelor of Laws Conjoint-Creative Practice: Popular Music"
  },
  {
    "id": "SONG-BMUS_BMUS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music"
    ],
    "major": "Songcraft & Music Production",
    "name": "Bachelor of Music-Songcraft & Music Production"
  },
  {
    "id": "CRIM-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Criminology",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Criminology"
  },
  {
    "id": "CRIM-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Criminology",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Criminology"
  },
  {
    "id": "CRIM-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Criminology",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Criminology"
  },
  {
    "id": "CRIM-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Criminology",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Criminology"
  },
  {
    "id": "CRIM-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Criminology",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Criminology"
  },
  {
    "id": "CRIM-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Criminology",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Criminology"
  },
  {
    "id": "CRIM-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Criminology",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Criminology"
  },
  {
    "id": "CRIM-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Criminology",
    "name": "Bachelor of Arts-Criminology"
  },
  {
    "id": "DANC-BDANS_BDANS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Dance Studies"
    ],
    "major": "Dance",
    "name": "Bachelor of Dance Studies-Dance"
  },
  {
    "id": "DATS-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Data Science (Specialisation)",
    "name": "Bachelor of Science-Data Science (Specialisation)"
  },
  {
    "id": "DESI-BDBA_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Design",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Design"
  },
  {
    "id": "DESI-BDBC_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Design",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Design"
  },
  {
    "id": "DESI-BDBEH_BDBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Design",
    "name": "Bachelor of Design / Bachelor of Engineering (Honours) Conjoint-Design"
  },
  {
    "id": "DESI-BDBS_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Design",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Design"
  },
  {
    "id": "DESI-BDES_BDES_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design"
    ],
    "major": "Design",
    "name": "Bachelor of Design-Design"
  },
  {
    "id": "EASC-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Earth Sciences",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Earth Sciences"
  },
  {
    "id": "EASC-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Earth Sciences",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Earth Sciences"
  },
  {
    "id": "EASC-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Earth Sciences",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Earth Sciences"
  },
  {
    "id": "EASC-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Earth Sciences",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Earth Sciences"
  },
  {
    "id": "EASC-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Earth Sciences",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Earth Sciences"
  },
  {
    "id": "EASC-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Earth Sciences",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Earth Sciences"
  },
  {
    "id": "EASC-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Earth Sciences",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Earth Sciences"
  },
  {
    "id": "EASC-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Earth Sciences",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Earth Sciences"
  },
  {
    "id": "EASC-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Earth Sciences",
    "name": "Bachelor of Science-Earth Sciences"
  },
  {
    "id": "EASC-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Earth Sciences",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Earth Sciences"
  },
  {
    "id": "ECON-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Economics (BA)",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Economics (BA)"
  },
  {
    "id": "ECON-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Economics",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Economics"
  },
  {
    "id": "ECON-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Economics",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Economics"
  },
  {
    "id": "ECON-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Economics",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Economics"
  },
  {
    "id": "ECON-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Economics",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Economics"
  },
  {
    "id": "ECON-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Economics",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Economics"
  },
  {
    "id": "ECON-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Economics",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Economics"
  },
  {
    "id": "ECON-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Economics",
    "name": "Bachelor of Arts-Economics"
  },
  {
    "id": "ECON-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Economics (BCom)",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Economics (BCom)"
  },
  {
    "id": "ECON-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Economics",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Economics"
  },
  {
    "id": "ECON-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Economics",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Economics"
  },
  {
    "id": "ECON-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Economics",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Economics"
  },
  {
    "id": "ECON-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Economics",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education Conjoint-Economics"
  },
  {
    "id": "ECON-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Economics",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Economics"
  },
  {
    "id": "ECON-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Economics",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Economics"
  },
  {
    "id": "ECON-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Economics",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Economics"
  },
  {
    "id": "ECON-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Economics",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Economics"
  },
  {
    "id": "ECON-BCLB_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "Economics",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-Economics"
  },
  {
    "id": "ECON-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Economics",
    "name": "Bachelor of Commerce-Economics"
  },
  {
    "id": "EDUC-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Education",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Education"
  },
  {
    "id": "EDUC-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Education",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Education"
  },
  {
    "id": "EDUC-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Education",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Education"
  },
  {
    "id": "EDUC-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Education",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Education"
  },
  {
    "id": "EDUC-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Education",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Education"
  },
  {
    "id": "EDUC-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Education",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Education"
  },
  {
    "id": "EDUC-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Education",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Education"
  },
  {
    "id": "EDUC-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Education",
    "name": "Bachelor of Arts-Education"
  },
  {
    "id": "ENGG-BEHBC_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Engineering Part I",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Engineering Part I"
  },
  {
    "id": "ENGG-BEHBD_BDBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Engineering Part I",
    "name": "Bachelor of Design / Bachelor of Engineering (Honours) Conjoint-Engineering Part I"
  },
  {
    "id": "ENGG-BEHBM_BEHBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Music"
    ],
    "major": "Engineering Part I",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Music Conjoint-Engineering Part I"
  },
  {
    "id": "ENGG-BEHBS_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Engineering Part I",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Engineering Part I"
  },
  {
    "id": "ENGG-BEHLB_BEHLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Laws"
    ],
    "major": "Engineering Part I",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Laws Conjoint-Engineering Part I"
  },
  {
    "id": "ENGG-BEHON_BEHON_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Engineering Part I",
    "name": "Bachelor of Engineering (Honours)-Engineering Part I"
  },
  {
    "id": "ENGL-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "English",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-English"
  },
  {
    "id": "ENGL-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "English",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-English"
  },
  {
    "id": "ENGL-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "English",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-English"
  },
  {
    "id": "ENGL-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "English",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-English"
  },
  {
    "id": "ENGL-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "English",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-English"
  },
  {
    "id": "ENGL-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "English",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-English"
  },
  {
    "id": "ENGL-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "English",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-English"
  },
  {
    "id": "ENGL-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "English",
    "name": "Bachelor of Arts-English"
  },
  {
    "id": "ENVC-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Environmental Change",
    "name": "Bachelor of Advanced Science (Honours)-Environmental Change"
  },
  {
    "id": "ENVS-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Environmental Science",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Environmental Science"
  },
  {
    "id": "ENVS-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Environmental Science",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Environmental Science"
  },
  {
    "id": "ENVS-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Environmental Science",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Environmental Science"
  },
  {
    "id": "ENVS-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Environmental Science",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Environmental Science"
  },
  {
    "id": "ENVS-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Environmental Science",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Environmental Science"
  },
  {
    "id": "ENVS-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Environmental Science",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Environmental Science"
  },
  {
    "id": "ENVS-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Environmental Science",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Environmental Science"
  },
  {
    "id": "ENVS-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Environmental Science",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Environmental Science"
  },
  {
    "id": "ENVS-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Environmental Science",
    "name": "Bachelor of Science-Environmental Science"
  },
  {
    "id": "ENVS-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Environmental Science",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Environmental Science"
  },
  {
    "id": "EROS-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Employment Relations & Organisation Studies",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Employment Relations & Organisation Studies"
  },
  {
    "id": "EROS-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Employment Relations & Organisation Studies",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Employment Relations & Organisation Studies"
  },
  {
    "id": "EROS-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Employment Relations & Organisation Studies",
    "name": "Bachelor of Arts / Bachelor of Global Studies -Employment Relations & Organisation Studies"
  },
  {
    "id": "EROS-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Employment Relations & Organisation Studies",
    "name": "Bachelor of Arts / Bachelor of Health Sciences -Employment Relations & Organisation Studies"
  },
  {
    "id": "EROS-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Employment Relations & Organisation Studies",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Employment Relations & Organisation Studies"
  },
  {
    "id": "EROS-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Employment Relations & Organisation Studies",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Employment Relations & Organisation Studies"
  },
  {
    "id": "EROS-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Employment Relations & Organisation Studies",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Employment Relations & Organisation Studies"
  },
  {
    "id": "EROS-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Employment Relations & Organisation Studies",
    "name": "Bachelor of Arts-Employment Relations & Organisation Studies"
  },
  {
    "id": "EURO-BA_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "European Studies",
    "name": "Bachelor of Arts-European Studies"
  },
  {
    "id": "EURO-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "European Studies",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-European Studies"
  },
  {
    "id": "EURO-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "European Studies",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-European Studies"
  },
  {
    "id": "EURO-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "European Studies",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-European Studies"
  },
  {
    "id": "EURO-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "European Studies",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-European Studies"
  },
  {
    "id": "EURO-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "European Studies",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-European Studies"
  },
  {
    "id": "EURO-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "European Studies",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-European Studies"
  },
  {
    "id": "EURO-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "European Studies",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-European Studies"
  },
  {
    "id": "EXES-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Exercise Sciences",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Exercise Sciences"
  },
  {
    "id": "EXES-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Exercise Sciences",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Exercise Sciences"
  },
  {
    "id": "EXES-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Exercise Sciences",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Exercise Sciences"
  },
  {
    "id": "EXES-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Exercise Sciences",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Exercise Sciences"
  },
  {
    "id": "EXES-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Exercise Sciences",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Exercise Sciences"
  },
  {
    "id": "EXES-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Exercise Sciences",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Exercise Sciences"
  },
  {
    "id": "EXES-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Exercise Sciences",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Exercise Sciences"
  },
  {
    "id": "EXES-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Exercise Sciences",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Exercise Sciences"
  },
  {
    "id": "EXES-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Exercise Sciences",
    "name": "Bachelor of Science-Exercise Sciences"
  },
  {
    "id": "EXES-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Exercise Sciences",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Exercise Sciences"
  },
  {
    "id": "FIN-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Finance",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Finance"
  },
  {
    "id": "FIN-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Finance",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Finance"
  },
  {
    "id": "FIN-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Finance",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Finance"
  },
  {
    "id": "FIN-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Finance",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Finance"
  },
  {
    "id": "FIN-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Finance",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education Conjoint-Finance"
  },
  {
    "id": "FIN-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Finance",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Finance"
  },
  {
    "id": "FIN-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Finance",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Finance"
  },
  {
    "id": "FIN-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Finance",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Finance"
  },
  {
    "id": "FIN-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Finance",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Finance"
  },
  {
    "id": "FIN-BCLB_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "Finance",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-Finance"
  },
  {
    "id": "FIN-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Finance",
    "name": "Bachelor of Commerce-Finance"
  },
  {
    "id": "FREN-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "French",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-French"
  },
  {
    "id": "FREN-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "French",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-French"
  },
  {
    "id": "FREN-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "French",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-French"
  },
  {
    "id": "FREN-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "French",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-French"
  },
  {
    "id": "FREN-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "French",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-French"
  },
  {
    "id": "FREN-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "French",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-French"
  },
  {
    "id": "FREN-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "French",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-French"
  },
  {
    "id": "FREN-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "French",
    "name": "Bachelor of Arts-French"
  },
  {
    "id": "FREN-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: French",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: French"
  },
  {
    "id": "FREN-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: French",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: French"
  },
  {
    "id": "FREN-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: French",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: French"
  },
  {
    "id": "FREN-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: French",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: French"
  },
  {
    "id": "FREN-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: French",
    "name": "Bachelor of Global Studies-BGlobalSt Language: French"
  },
  {
    "id": "FDSC-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Food Science",
    "name": "Bachelor of Science-Food Science"
  },
  {
    "id": "NUTR-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Nutrition",
    "name": "Bachelor of Science- Nutrition"
  },
  {
    "id": "GEND-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Gender Studies",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Gender Studies"
  },
  {
    "id": "GEND-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Gender Studies",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Gender Studies"
  },
  {
    "id": "GEND-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Gender Studies",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Gender Studies"
  },
  {
    "id": "GEND-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Gender Studies",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Gender Studies"
  },
  {
    "id": "GEND-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Gender Studies",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Gender Studies"
  },
  {
    "id": "GEND-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Gender Studies",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Gender Studies"
  },
  {
    "id": "GEND-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Gender Studies",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Gender Studies"
  },
  {
    "id": "GEND-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Gender Studies",
    "name": "Bachelor of Arts-Gender Studies"
  },
  {
    "id": "GEOG-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Geography",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Geography"
  },
  {
    "id": "GEOG-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Geography",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Geography"
  },
  {
    "id": "GEOG-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Geography",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Geography"
  },
  {
    "id": "GEOG-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Geography",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Geography"
  },
  {
    "id": "GEOG-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Geography",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Geography"
  },
  {
    "id": "GEOG-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Geography (BA)",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Geography (BA)"
  },
  {
    "id": "GEOG-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Geography",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Geography"
  },
  {
    "id": "GEOG-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Geography",
    "name": "Bachelor of Arts-Geography"
  },
  {
    "id": "GEOG-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Geography (BSc)",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Geography (BSc)"
  },
  {
    "id": "GEOG-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Geography",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Geography"
  },
  {
    "id": "GEOG-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Geography",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Geography"
  },
  {
    "id": "GEOG-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Geography",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Geography"
  },
  {
    "id": "GEOG-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Geography",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Geography"
  },
  {
    "id": "GEOG-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Geography",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Geography"
  },
  {
    "id": "GEOG-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Geography",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Geography"
  },
  {
    "id": "GEOG-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Geography",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Geography"
  },
  {
    "id": "GEOG-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Geography",
    "name": "Bachelor of Science-Geography"
  },
  {
    "id": "GEOG-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Geography",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Geography"
  },
  {
    "id": "GEOL-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Geology",
    "name": "Bachelor of Advanced Science (Honours)-Geology"
  },
  {
    "id": "GEOP-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Geophysics",
    "name": "Bachelor of Science-Geophysics"
  },
  {
    "id": "GERM-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "German",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-German"
  },
  {
    "id": "GERM-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "German",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-German"
  },
  {
    "id": "GERM-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "German",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-German"
  },
  {
    "id": "GERM-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "German",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-German"
  },
  {
    "id": "GERM-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "German",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-German"
  },
  {
    "id": "GERM-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "German",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-German"
  },
  {
    "id": "GERM-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "German",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-German"
  },
  {
    "id": "GERM-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "German",
    "name": "Bachelor of Arts-German"
  },
  {
    "id": "GERM-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: German",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: German"
  },
  {
    "id": "GERM-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: German",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: German"
  },
  {
    "id": "GERM-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: German",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: German"
  },
  {
    "id": "GERM-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: German",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: German"
  },
  {
    "id": "GERM-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: German",
    "name": "Bachelor of Global Studies-BGlobalSt Language: German"
  },
  {
    "id": "GESD-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Global Environment & Sustainable Development",
    "name": "Bachelor of Arts / Bachelor of Global Studies -Global Environment & Sustainable Development"
  },
  {
    "id": "GESD-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Global Environment & Sustainable Development",
    "name": "Bachelor of Commerce / Bachelor of Global Studies -Global Environment & Sustainable Development"
  },
  {
    "id": "GESD-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Global Environment & Sustainable Development",
    "name": "Bachelor of Global Studies / Bachelor of Science -Global Environment & Sustainable Development"
  },
  {
    "id": "GESD-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "Global Environment & Sustainable Development",
    "name": "Bachelor of Global Studies / Bachelor of Laws -Global Environment & Sustainable Development"
  },
  {
    "id": "GESD-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "Global Environment & Sustainable Development",
    "name": "Bachelor of Global Studies-Global Environment & Sustainable Development"
  },
  {
    "id": "GIS-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Geographic Information Science",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Geographic Information Science"
  },
  {
    "id": "GIS-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Geographic Information Science",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Geographic Information Science"
  },
  {
    "id": "GIS-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Geographic Information Science",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Geographic Information Science"
  },
  {
    "id": "GIS-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Geographic Information Science",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Geographic Information Science"
  },
  {
    "id": "GIS-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Geographic Information Science",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Geographic Information Science"
  },
  {
    "id": "GIS-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Geographic Information Science",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Geographic Information Science"
  },
  {
    "id": "GIS-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Geographic Information Science",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Geographic Information Science"
  },
  {
    "id": "GIS-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Geographic Information Science",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Geographic Information Science"
  },
  {
    "id": "GIS-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Geographic Information Science",
    "name": "Bachelor of Science-Geographic Information Science"
  },
  {
    "id": "GIS-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Geographic Information Science",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Geographic Information Science"
  },
  {
    "id": "GPHR-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Global Politics & Human Rights",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Global Politics & Human Rights"
  },
  {
    "id": "GPHR-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Global Politics & Human Rights",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Global Politics & Human Rights"
  },
  {
    "id": "GPHR-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Global Politics & Human Rights",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Global Politics & Human Rights"
  },
  {
    "id": "GPHR-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "Global Politics & Human Rights",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-Global Politics & Human Rights"
  },
  {
    "id": "GPHR-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "Global Politics & Human Rights",
    "name": "Bachelor of Global Studies-Global Politics & Human Rights"
  },
  {
    "id": "GREE-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Green Chemical Science",
    "name": "Bachelor of Advanced Science (Honours)-Green Chemical Science"
  },
  {
    "id": "GREE-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Green Chemical Science (Specialisation)",
    "name": "Bachelor of Science-Green Chemical Science (Specialisation)"
  },
  {
    "id": "HIST-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "History",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-History"
  },
  {
    "id": "HIST-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "History",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-History"
  },
  {
    "id": "HIST-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "History",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-History"
  },
  {
    "id": "HIST-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "History",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-History"
  },
  {
    "id": "HIST-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "History",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-History"
  },
  {
    "id": "HIST-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "History",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-History"
  },
  {
    "id": "HIST-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "History",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-History"
  },
  {
    "id": "HIST-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "History",
    "name": "Bachelor of Arts-History"
  },
  {
    "id": "EDTE-BEDTE_BEDTE_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Education (Teaching)"
    ],
    "major": null,
    "name": "Bachelor of Education (Teaching)"
  },
  {
    "id": "INEN-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Innovation & Entrepreneurship",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Innovation & Entrepreneurship"
  },
  {
    "id": "INEN-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Innovation & Entrepreneurship",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Innovation & Entrepreneurship"
  },
  {
    "id": "INEN-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Innovation & Entrepreneurship",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Innovation & Entrepreneurship"
  },
  {
    "id": "INEN-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Innovation & Entrepreneurship",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Innovation & Entrepreneurship"
  },
  {
    "id": "INEN-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Innovation",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education -Innovation"
  },
  {
    "id": "INEN-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Innovation & Entrepreneurship",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Innovation & Entrepreneurship"
  },
  {
    "id": "INEN-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Innovation & Entrepreneurship",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Innovation & Entrepreneurship"
  },
  {
    "id": "INEN-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Innovation & Entrepreneurship",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Innovation & Entrepreneurship"
  },
  {
    "id": "INEN-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Innovation & Entrepreneurship",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Innovation & Entrepreneurship"
  },
  {
    "id": "INEN-BCLB_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "Innovation & Entrepreneurship",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-Innovation & Entrepreneurship"
  },
  {
    "id": "INEN-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Innovation & Entrepreneurship",
    "name": "Bachelor of Commerce-Innovation & Entrepreneurship"
  },
  {
    "id": "INFS-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Information Systems"
  },
  {
    "id": "INFS-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Information Systems"
  },
  {
    "id": "INFS-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Information Systems"
  },
  {
    "id": "INFS-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Information Systems"
  },
  {
    "id": "INFS-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education -Information Systems"
  },
  {
    "id": "INFS-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Information Systems"
  },
  {
    "id": "INFS-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Information Systems"
  },
  {
    "id": "INFS-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Information Systems"
  },
  {
    "id": "INFS-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Information Systems"
  },
  {
    "id": "INFS-BCLB_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-Information Systems"
  },
  {
    "id": "INFS-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Information Systems",
    "name": "Bachelor of Commerce-Information Systems"
  },
  {
    "id": "INTB-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "International Business",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-International Business"
  },
  {
    "id": "INTB-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "International Business",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-International Business"
  },
  {
    "id": "INTB-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "International Business",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-International Business"
  },
  {
    "id": "INTB-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "International Business",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-International Business"
  },
  {
    "id": "INTB-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "International Business",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education -International Business"
  },
  {
    "id": "INTB-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "International Business",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-International Business"
  },
  {
    "id": "INTB-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "International Business",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-International Business"
  },
  {
    "id": "INTB-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "International Business",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-International Business"
  },
  {
    "id": "INTB-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "International Business",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-International Business"
  },
  {
    "id": "INTB-BCLB_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "International Business",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-International Business"
  },
  {
    "id": "INTB-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "International Business",
    "name": "Bachelor of Commerce-International Business"
  },
  {
    "id": "IRBU-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "International Relations & Business",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-International Relations & Business"
  },
  {
    "id": "IRBU-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "International Relations & Business",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-International Relations & Business"
  },
  {
    "id": "IRBU-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "International Relations & Business",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-International Relations & Business"
  },
  {
    "id": "IRBU-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "International Relations & Business",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-International Relations & Business"
  },
  {
    "id": "IRBU-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "International Relations & Business",
    "name": "Bachelor of Global Studies-International Relations & Business"
  },
  {
    "id": "ITAL-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Italian",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Italian"
  },
  {
    "id": "ITAL-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Italian",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Italian"
  },
  {
    "id": "ITAL-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Italian",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Italian"
  },
  {
    "id": "ITAL-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Italian",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Italian"
  },
  {
    "id": "ITAL-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Italian",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Italian"
  },
  {
    "id": "ITAL-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Italian",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Italian"
  },
  {
    "id": "ITAL-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Italian",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Italian"
  },
  {
    "id": "ITAL-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Italian",
    "name": "Bachelor of Arts-Italian"
  },
  {
    "id": "ITAL-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Italian",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: Italian"
  },
  {
    "id": "ITAL-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Italian",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: Italian"
  },
  {
    "id": "ITAL-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: Italian",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: Italian"
  },
  {
    "id": "ITAL-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: Italian",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: Italian"
  },
  {
    "id": "ITAL-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Italian",
    "name": "Bachelor of Global Studies-BGlobalSt Language: Italian"
  },
  {
    "id": "ITEM-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Information & Technology Management",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Information & Technology Management"
  },
  {
    "id": "ITEM-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Information & Technology Management",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Information & Technology Management"
  },
  {
    "id": "ITEM-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Information & Technology Management",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Information & Technology Management"
  },
  {
    "id": "ITEM-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Information & Technology Management",
    "name": "Bachelor of Engineering (Hon) / Bachelor of Science -Information & Technology Management"
  },
  {
    "id": "ITEM-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Information & Technology Management",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Information & Technology Management"
  },
  {
    "id": "ITEM-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Information & Technology Management",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Information & Technology Management"
  },
  {
    "id": "ITEM-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Information & Technology Management",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Information & Technology Management"
  },
  {
    "id": "ITEM-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Information & Technology Management",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Information & Technology Management"
  },
  {
    "id": "ITEM-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Information & Technology Management",
    "name": "Bachelor of Science-Information & Technology Management"
  },
  {
    "id": "ITEM-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Information & Technology Management",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Information & Technology Management"
  },
  {
    "id": "JAPN-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Japanese",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Japanese"
  },
  {
    "id": "JAPN-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Japanese",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Japanese"
  },
  {
    "id": "JAPN-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Japanese",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Japanese"
  },
  {
    "id": "JAPN-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Japanese",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Japanese"
  },
  {
    "id": "JAPN-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Japanese",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Japanese"
  },
  {
    "id": "JAPN-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Japanese",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Japanese"
  },
  {
    "id": "JAPN-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Japanese",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Japanese"
  },
  {
    "id": "JAPN-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Japanese",
    "name": "Bachelor of Arts-Japanese"
  },
  {
    "id": "JAPN-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Japanese",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: Japanese"
  },
  {
    "id": "JAPN-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Japanese",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: Japanese"
  },
  {
    "id": "JAPN-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: Japanese",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: Japanese"
  },
  {
    "id": "JAPN-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: Japanese",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: Japanese"
  },
  {
    "id": "JAPN-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Japanese",
    "name": "Bachelor of Global Studies-BGlobalSt Language: Japanese"
  },
  {
    "id": "KORE-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Korean",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Korean"
  },
  {
    "id": "KORE-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Korean",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Korean"
  },
  {
    "id": "KORE-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Korean",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Korean"
  },
  {
    "id": "KORE-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Korean",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Korean"
  },
  {
    "id": "KORE-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Korean",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Korean"
  },
  {
    "id": "KORE-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Korean",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Korean"
  },
  {
    "id": "KORE-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Korean",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Korean"
  },
  {
    "id": "KORE-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Korean",
    "name": "Bachelor of Arts-Korean"
  },
  {
    "id": "KORE-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Korean",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: Korean"
  },
  {
    "id": "KORE-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Korean",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: Korean"
  },
  {
    "id": "KORE-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: Korean",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: Korean"
  },
  {
    "id": "KORE-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: Korean",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: Korean"
  },
  {
    "id": "KORE-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Korean",
    "name": "Bachelor of Global Studies-BGlobalSt Language: Korean"
  },
  {
    "id": "LATN-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Latin",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Latin"
  },
  {
    "id": "LATN-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Latin",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Latin"
  },
  {
    "id": "LATN-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Latin",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Latin"
  },
  {
    "id": "LATN-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Latin",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Latin"
  },
  {
    "id": "LATN-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Latin",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Latin"
  },
  {
    "id": "LATN-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Latin",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Latin"
  },
  {
    "id": "LATN-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Latin",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Latin"
  },
  {
    "id": "LATN-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Latin",
    "name": "Bachelor of Arts-Latin"
  },
  {
    "id": "LAW1-LBBA_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Law Part I",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Law Part I"
  },
  {
    "id": "LAW1-LBBC_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "Law Part I",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-Law Part I"
  },
  {
    "id": "LAW1-LBBEH_BEHLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Laws"
    ],
    "major": "Law Part I",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Laws Conjoint-Law Part I"
  },
  {
    "id": "LAW1-LBBG_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "Law Part I",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-Law Part I"
  },
  {
    "id": "LAW1-LBBHS_BHSLB_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Laws"
    ],
    "major": "Law Part I",
    "name": "Bachelor of Health Sciences / Bachelor of Laws Conjoint-Law Part I"
  },
  {
    "id": "LAW1-LBBM_BMLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Laws"
    ],
    "major": "Law Part I",
    "name": "Bachelor of Music / Bachelor of Laws Conjoint-Law Part I"
  },
  {
    "id": "LAW1-LBBS_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Law Part I",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Law Part I"
  },
  {
    "id": "LAW1-LLB_LLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Laws"
    ],
    "major": "Law Part I",
    "name": "Bachelor of Laws-Law Part I"
  },
  {
    "id": "LING-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Linguistics",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Linguistics"
  },
  {
    "id": "LING-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Linguistics",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Linguistics"
  },
  {
    "id": "LING-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Linguistics",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Linguistics"
  },
  {
    "id": "LING-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Linguistics",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Linguistics"
  },
  {
    "id": "LING-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Linguistics",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Linguistics"
  },
  {
    "id": "LING-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Linguistics",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Linguistics"
  },
  {
    "id": "LING-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Linguistics",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Linguistics"
  },
  {
    "id": "LING-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Linguistics",
    "name": "Bachelor of Arts-Linguistics"
  },
  {
    "id": "LOGC-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Logic & Computation (BA)",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Logic & Computation (BA)"
  },
  {
    "id": "LOGC-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Arts-Logic & Computation"
  },
  {
    "id": "LOGC-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Logic & Computation (BSc)",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Logic & Computation (BSc)"
  },
  {
    "id": "LOGC-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Logic & Computation"
  },
  {
    "id": "LOGC-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Science-Logic & Computation"
  },
  {
    "id": "LOGC-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Logic & Computation",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Logic & Computation"
  },
  {
    "id": "MAOR-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "M?ori Studies",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-M?ori Studies"
  },
  {
    "id": "MAOR-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "M?ori Studies",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-M?ori Studies"
  },
  {
    "id": "MAOR-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "M?ori Studies",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-M?ori Studies"
  },
  {
    "id": "MAOR-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "M?ori Studies",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-M?ori Studies"
  },
  {
    "id": "MAOR-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "M?ori Studies",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-M?ori Studies"
  },
  {
    "id": "MAOR-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "M?ori Studies",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-M?ori Studies"
  },
  {
    "id": "MAOR-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "M?ori Studies",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-M?ori Studies"
  },
  {
    "id": "MAOR-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "M?ori Studies",
    "name": "Bachelor of Arts-M?ori Studies"
  },
  {
    "id": "MAOR-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: M?ori",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: M?ori"
  },
  {
    "id": "MAOR-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: M?ori",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: M?ori"
  },
  {
    "id": "MAOR-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: M?ori",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: M?ori"
  },
  {
    "id": "MAOR-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: M?ori",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: M?ori"
  },
  {
    "id": "MAOR-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: M?ori",
    "name": "Bachelor of Global Studies-BGlobalSt Language: M?ori"
  },
  {
    "id": "MATH-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Mathematics"
  },
  {
    "id": "MATH-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Mathematics"
  },
  {
    "id": "MATH-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Mathematics"
  },
  {
    "id": "MATH-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Mathematics"
  },
  {
    "id": "MATH-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Mathematics"
  },
  {
    "id": "MATH-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Mathematics (BA)",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Mathematics (BA)"
  },
  {
    "id": "MATH-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Mathematics"
  },
  {
    "id": "MATH-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Arts-Mathematics"
  },
  {
    "id": "MATH-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Advanced Science (Honours)-Mathematics"
  },
  {
    "id": "MATH-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Mathematics (BSc)",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Mathematics (BSc)"
  },
  {
    "id": "MATH-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Mathematics"
  },
  {
    "id": "MATH-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Mathematics"
  },
  {
    "id": "MATH-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Mathematics"
  },
  {
    "id": "MATH-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Mathematics"
  },
  {
    "id": "MATH-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Mathematics"
  },
  {
    "id": "MATH-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Mathematics"
  },
  {
    "id": "MATH-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Mathematics"
  },
  {
    "id": "MATH-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Science-Mathematics"
  },
  {
    "id": "MATH-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Mathematics"
  },
  {
    "id": "MDCM-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Medicinal Chemistry",
    "name": "Bachelor of Science-Medicinal Chemistry"
  },
  {
    "id": "MESC-BAMAJ_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Media and Screen Studies",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Media and Screen Studies"
  },
  {
    "id": "MESC-BAMAJ_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Media and Screen Studies",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Media and Screen Studies"
  },
  {
    "id": "MESC-BAMAJ_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Media and Screen Studies",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Media and Screen Studies"
  },
  {
    "id": "MESC-BAMAJ_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Media and Screen Studies",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Media and Screen Studies"
  },
  {
    "id": "MESC-BAMAJ_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Media and Screen Studies",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Media and Screen Studies"
  },
  {
    "id": "MESC-BAMAJ_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Media and Screen Studies",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Media and Screen Studies"
  },
  {
    "id": "MESC-BAMAJ_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Media and Screen Studies",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Media and Screen Studies"
  },
  {
    "id": "MESC-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Media and Screen Studies",
    "name": "Bachelor of Arts-Media and Screen Studies"
  },
  {
    "id": "MGT-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Management",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Management"
  },
  {
    "id": "MGT-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Management",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Management"
  },
  {
    "id": "MGT-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Management",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Management"
  },
  {
    "id": "MGT-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Management",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Management"
  },
  {
    "id": "MGT-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Management",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education Conjoint-Management"
  },
  {
    "id": "MGT-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Management",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Management"
  },
  {
    "id": "MGT-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Management",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Management"
  },
  {
    "id": "MGT-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Management",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Management"
  },
  {
    "id": "MGT-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Management",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Management"
  },
  {
    "id": "MGT-BCLB_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "Management",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-Management"
  },
  {
    "id": "MGT-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Management",
    "name": "Bachelor of Commerce-Management"
  },
  {
    "id": "MKTG-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Marketing",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Marketing"
  },
  {
    "id": "MKTG-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Marketing",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Marketing"
  },
  {
    "id": "MKTG-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Marketing",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Marketing"
  },
  {
    "id": "MKTG-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Marketing",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Marketing"
  },
  {
    "id": "MKTG-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Marketing",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education Conjoint-Marketing"
  },
  {
    "id": "MKTG-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Marketing",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Marketing"
  },
  {
    "id": "MKTG-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Marketing",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Marketing"
  },
  {
    "id": "MKTG-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Marketing",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Marketing"
  },
  {
    "id": "MKTG-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Marketing",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Marketing"
  },
  {
    "id": "MKTG-BCLB_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "Marketing",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-Marketing"
  },
  {
    "id": "MKTG-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Marketing",
    "name": "Bachelor of Commerce-Marketing"
  },
  {
    "id": "MNSC-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Advanced Science (Honours)-Marine Science"
  },
  {
    "id": "MNSC-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Marine Science"
  },
  {
    "id": "MNSC-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Marine Science"
  },
  {
    "id": "MNSC-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Marine Science"
  },
  {
    "id": "MNSC-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Marine Science"
  },
  {
    "id": "MNSC-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Marine Science"
  },
  {
    "id": "MNSC-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Marine Science"
  },
  {
    "id": "MNSC-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Marine Science"
  },
  {
    "id": "MNSC-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Marine Science"
  },
  {
    "id": "MNSC-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Science-Marine Science"
  },
  {
    "id": "MNSC-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Marine Science",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Marine Science"
  },
  {
    "id": "MUSI-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Music",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Music"
  },
  {
    "id": "MUSI-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Music",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Music"
  },
  {
    "id": "MUSI-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Music",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Music"
  },
  {
    "id": "MUSI-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Music",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Music"
  },
  {
    "id": "MUSI-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Music",
    "name": "Bachelor of Arts-Music"
  },
  {
    "id": "MUST-BMBA_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Music Studies",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Music Studies"
  },
  {
    "id": "MUST-BMBC_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Music Studies",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Music Studies"
  },
  {
    "id": "MUST-BMBEH_BEHBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Music"
    ],
    "major": "Music Studies",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Music Conjoint-Music Studies"
  },
  {
    "id": "MUST-BMBS_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Music Studies",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Music Studies"
  },
  {
    "id": "MUST-BMLB_BMLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Laws"
    ],
    "major": "Music Studies",
    "name": "Bachelor of Music / Bachelor of Laws Conjoint-Music Studies"
  },
  {
    "id": "MUE-BMUS_BMUS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music"
    ],
    "major": "Music Education",
    "name": "Bachelor of Music-Music Education"
  },
  {
    "id": "NURS-BNURS_BNURS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Nursing"
    ],
    "major": "Nursing",
    "name": "Bachelor of Nursing-Nursing"
  },
  {
    "id": "OPSC-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Operations & Supply Chain Management",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Hon) -Operations & Supply Chain Management"
  },
  {
    "id": "OPSM-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Operations Management",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Operations Management"
  },
  {
    "id": "OSCM-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Operations & Supply Chain Management",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Operations & Supply Chain Management"
  },
  {
    "id": "OSCM-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Operations & Supply Chain Management",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Operations & Supply Chain Management"
  },
  {
    "id": "OSCM-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Operations & Supply Chain Management",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Operations & Supply Chain Management"
  },
  {
    "id": "OSCM-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Ops & Supply Chain Mgt",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education -Ops & Supply Chain Mgt"
  },
  {
    "id": "OSCM-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Operations & Supply Chain Management",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Operations & Supply Chain Management"
  },
  {
    "id": "OSCM-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Operations & Supply Chain Management",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Operations & Supply Chain Management"
  },
  {
    "id": "OSCM-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Operations & Supply Chain Management",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Operations & Supply Chain Management"
  },
  {
    "id": "OSCM-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Operations & Supply Chain Management",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Operations & Supply Chain Management"
  },
  {
    "id": "OSCM-BCLB_BCLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Laws"
    ],
    "major": "Operations & Supply Chain Management",
    "name": "Bachelor of Commerce / Bachelor of Laws Conjoint-Operations & Supply Chain Management"
  },
  {
    "id": "OSCM-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Operations & Supply Chain Management",
    "name": "Bachelor of Commerce-Operations & Supply Chain Management"
  },
  {
    "id": "PACI-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Pacific Studies",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Pacific Studies"
  },
  {
    "id": "PACI-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Pacific Studies",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Pacific Studies"
  },
  {
    "id": "PACI-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Pacific Studies",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Pacific Studies"
  },
  {
    "id": "PACI-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Pacific Studies",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Pacific Studies"
  },
  {
    "id": "PACI-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Pacific Studies",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Pacific Studies"
  },
  {
    "id": "PACI-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Pacific Studies",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Pacific Studies"
  },
  {
    "id": "PACI-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Pacific Studies",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Pacific Studies"
  },
  {
    "id": "PACI-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Pacific Studies",
    "name": "Bachelor of Arts-Pacific Studies"
  },
  {
    "id": "PHAR-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Pharmacology",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Pharmacology"
  },
  {
    "id": "PHAR-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Pharmacology",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Pharmacology"
  },
  {
    "id": "PHAR-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Pharmacology",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Pharmacology"
  },
  {
    "id": "PHAR-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Pharmacology",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Pharmacology"
  },
  {
    "id": "PHAR-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Pharmacology",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Pharmacology"
  },
  {
    "id": "PHAR-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Pharmacology",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Pharmacology"
  },
  {
    "id": "PHAR-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Pharmacology",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Pharmacology"
  },
  {
    "id": "PHAR-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Pharmacology",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Pharmacology"
  },
  {
    "id": "PHAR-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Pharmacology",
    "name": "Bachelor of Science-Pharmacology"
  },
  {
    "id": "PHAR-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Pharmacology",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Pharmacology"
  },
  {
    "id": "PHIL-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Philosophy",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Philosophy"
  },
  {
    "id": "PHIL-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Philosophy",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Philosophy"
  },
  {
    "id": "PHIL-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Philosophy",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Philosophy"
  },
  {
    "id": "PHIL-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Philosophy",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Philosophy"
  },
  {
    "id": "PHIL-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Philosophy",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Philosophy"
  },
  {
    "id": "PHIL-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Philosophy",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Philosophy"
  },
  {
    "id": "PHIL-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Philosophy",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Philosophy"
  },
  {
    "id": "PHIL-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Philosophy",
    "name": "Bachelor of Arts-Philosophy"
  },
  {
    "id": "PHYO-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Physiology",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Physiology"
  },
  {
    "id": "PHYO-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Physiology",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Physiology"
  },
  {
    "id": "PHYO-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Physiology",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Physiology"
  },
  {
    "id": "PHYO-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Physiology",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Physiology"
  },
  {
    "id": "PHYO-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Physiology",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Physiology"
  },
  {
    "id": "PHYO-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Physiology",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Physiology"
  },
  {
    "id": "PHYO-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Physiology",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Physiology"
  },
  {
    "id": "PHYO-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Physiology",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Physiology"
  },
  {
    "id": "PHYO-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Physiology",
    "name": "Bachelor of Science-Physiology"
  },
  {
    "id": "PHYO-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Physiology",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Physiology"
  },
  {
    "id": "PHYS-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Physics",
    "name": "Bachelor of Advanced Science (Honours)-Physics"
  },
  {
    "id": "PHYS-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Physics",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Physics"
  },
  {
    "id": "PHYS-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Physics",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Physics"
  },
  {
    "id": "PHYS-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Physics",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Physics"
  },
  {
    "id": "PHYS-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Physics",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Physics"
  },
  {
    "id": "PHYS-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Physics",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Physics"
  },
  {
    "id": "PHYS-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Physics",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Physics"
  },
  {
    "id": "PHYS-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Physics",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Physics"
  },
  {
    "id": "PHYS-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Physics",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Physics"
  },
  {
    "id": "PHYS-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Physics",
    "name": "Bachelor of Science-Physics"
  },
  {
    "id": "PHYS-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Physics",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Physics"
  },
  {
    "id": "POHL-BHSBA_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Population Health",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Population Health"
  },
  {
    "id": "POHL-BHSBC_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Population Health",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Population Health"
  },
  {
    "id": "POHL-BHSBS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Population Health",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Population Health"
  },
  {
    "id": "POHL-BHSLB_BHSLB_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Laws"
    ],
    "major": "Population Health",
    "name": "Bachelor of Health Sciences / Bachelor of Laws Conjoint-Population Health"
  },
  {
    "id": "POIR-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Politics & International Relations",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Politics & International Relations"
  },
  {
    "id": "POIR-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Politics & International Relations",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Politics & International Relations"
  },
  {
    "id": "POIR-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Politics & International Relations",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Politics & International Relations"
  },
  {
    "id": "POIR-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Politics & International Relations",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Politics & International Relations"
  },
  {
    "id": "POIR-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Politics & International Relations",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Politics & International Relations"
  },
  {
    "id": "POIR-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Politics & International Relations",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Politics & International Relations"
  },
  {
    "id": "POIR-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Politics & International Relations",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Politics & International Relations"
  },
  {
    "id": "POIR-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Politics & International Relations",
    "name": "Bachelor of Arts-Politics & International Relations"
  },
  {
    "id": "PROP-BPBC_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Property",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Property"
  },
  {
    "id": "PROP-BPROP_BPROP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Property"
    ],
    "major": "Property",
    "name": "Bachelor of Property-Property"
  },
  {
    "id": "PSYC-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Psychology",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Psychology"
  },
  {
    "id": "PSYC-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Psychology",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Psychology"
  },
  {
    "id": "PSYC-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Psychology",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Psychology"
  },
  {
    "id": "PSYC-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Psychology",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Psychology"
  },
  {
    "id": "PSYC-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Psychology",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Psychology"
  },
  {
    "id": "PSYC-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Psychology (BA)",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Psychology (BA)"
  },
  {
    "id": "PSYC-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Psychology",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Psychology"
  },
  {
    "id": "PSYC-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Psychology",
    "name": "Bachelor of Arts-Psychology"
  },
  {
    "id": "PSYC-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Psychology",
    "name": "Bachelor of Advanced Science (Honours)-Psychology"
  },
  {
    "id": "PSYC-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Psychology (BSc)",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Psychology (BSc)"
  },
  {
    "id": "PSYC-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Psychology",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Psychology"
  },
  {
    "id": "PSYC-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Psychology",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Psychology"
  },
  {
    "id": "PSYC-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Psychology",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Psychology"
  },
  {
    "id": "PSYC-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Psychology",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Psychology"
  },
  {
    "id": "PSYC-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Psychology",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Psychology"
  },
  {
    "id": "PSYC-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Psychology",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Psychology"
  },
  {
    "id": "PSYC-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Psychology",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Psychology"
  },
  {
    "id": "PSYC-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Psychology",
    "name": "Bachelor of Science-Psychology"
  },
  {
    "id": "PSYC-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Psychology",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Psychology"
  },
  {
    "id": "RUSS-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Russian",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: Russian"
  },
  {
    "id": "RUSS-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Russian",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: Russian"
  },
  {
    "id": "RUSS-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: Russian",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: Russian"
  },
  {
    "id": "RUSS-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: Russian",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: Russian"
  },
  {
    "id": "RUSS-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Russian",
    "name": "Bachelor of Global Studies-BGlobalSt Language: Russian"
  },
  {
    "id": "SAMO-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Samoan",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: Samoan"
  },
  {
    "id": "SAMO-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Samoan",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: Samoan"
  },
  {
    "id": "SAMO-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: Samoan",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: Samoan"
  },
  {
    "id": "SAMO-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: Samoan",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: Samoan"
  },
  {
    "id": "SAMO-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Samoan",
    "name": "Bachelor of Global Studies-BGlobalSt Language: Samoan"
  },
  {
    "id": "SHPE-BHBC_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Sport, Health & PE",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education -Sport, Health & PE"
  },
  {
    "id": "SHPE-BSHPE_BSHPE_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Sport, Health & Physical Education",
    "name": "Bachelor of Sport, Health & Physical Education-Sport, Health & Physical Education"
  },
  {
    "id": "SOCI-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Sociology",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Sociology"
  },
  {
    "id": "SOCI-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Sociology",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Sociology"
  },
  {
    "id": "SOCI-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Sociology",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Sociology"
  },
  {
    "id": "SOCI-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Sociology",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Sociology"
  },
  {
    "id": "SOCI-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Sociology",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Sociology"
  },
  {
    "id": "SOCI-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Sociology",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Sociology"
  },
  {
    "id": "SOCI-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Sociology",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Sociology"
  },
  {
    "id": "SOCI-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Sociology",
    "name": "Bachelor of Arts-Sociology"
  },
  {
    "id": "SPAN-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Spanish",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Spanish"
  },
  {
    "id": "SPAN-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Spanish",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Spanish"
  },
  {
    "id": "SPAN-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Spanish",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Spanish"
  },
  {
    "id": "SPAN-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Spanish",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Spanish"
  },
  {
    "id": "SPAN-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Spanish",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Spanish"
  },
  {
    "id": "SPAN-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Spanish",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Spanish"
  },
  {
    "id": "SPAN-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Spanish",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Spanish"
  },
  {
    "id": "SPAN-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Spanish",
    "name": "Bachelor of Arts-Spanish"
  },
  {
    "id": "SPAN-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Spanish",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: Spanish"
  },
  {
    "id": "SPAN-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Spanish",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: Spanish"
  },
  {
    "id": "SPAN-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: Spanish",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: Spanish"
  },
  {
    "id": "SPAN-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: Spanish",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: Spanish"
  },
  {
    "id": "SPAN-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Spanish",
    "name": "Bachelor of Global Studies-BGlobalSt Language: Spanish"
  },
  {
    "id": "STAT-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Statistics",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Statistics"
  },
  {
    "id": "STAT-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Statistics",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Statistics"
  },
  {
    "id": "STAT-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Statistics",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Statistics"
  },
  {
    "id": "STAT-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Statistics",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Statistics"
  },
  {
    "id": "STAT-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Statistics",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Statistics"
  },
  {
    "id": "STAT-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Statistics (BA)",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Statistics (BA)"
  },
  {
    "id": "STAT-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Statistics",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Statistics"
  },
  {
    "id": "STAT-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Statistics",
    "name": "Bachelor of Arts-Statistics"
  },
  {
    "id": "STAT-BASH_BASH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Advanced Science (Honours)"
    ],
    "major": "Statistics",
    "name": "Bachelor of Advanced Science (Honours)-Statistics"
  },
  {
    "id": "STAT-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Statistics (BSc)",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Statistics (BSc)"
  },
  {
    "id": "STAT-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Statistics",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Statistics"
  },
  {
    "id": "STAT-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Statistics",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Statistics"
  },
  {
    "id": "STAT-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Statistics",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Statistics"
  },
  {
    "id": "STAT-BSBF_BFBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Fine Arts",
      "Bachelor of Science"
    ],
    "major": "Statistics",
    "name": "Bachelor of Fine Arts / Bachelor of Science Conjoint-Statistics"
  },
  {
    "id": "STAT-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Statistics",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Statistics"
  },
  {
    "id": "STAT-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Statistics",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Statistics"
  },
  {
    "id": "STAT-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Statistics",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Statistics"
  },
  {
    "id": "STAT-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Statistics",
    "name": "Bachelor of Science-Statistics"
  },
  {
    "id": "STAT-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Statistics",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Statistics"
  },
  {
    "id": "TAX-BCBA_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Taxation",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Taxation"
  },
  {
    "id": "TAX-BCBD_BCBD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Design"
    ],
    "major": "Taxation",
    "name": "Bachelor of Commerce / Bachelor of Design Conjoint-Taxation"
  },
  {
    "id": "TAX-BCBEH_BCBEH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Engineering (Honours)"
    ],
    "major": "Taxation",
    "name": "Bachelor of Commerce / Bachelor of Engineering (Honours) Conjoint-Taxation"
  },
  {
    "id": "TAX-BCBG_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Taxation",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-Taxation"
  },
  {
    "id": "TAX-BCBH_BCBH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Sport, Health & Physical Education"
    ],
    "major": "Taxation",
    "name": "Bachelor of Commerce / Bachelor of Sport, Health & Physical Education Conjoint-Taxation"
  },
  {
    "id": "TAX-BCBHS_BCBHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Health Sciences"
    ],
    "major": "Taxation",
    "name": "Bachelor of Commerce / Bachelor of Health Sciences Conjoint-Taxation"
  },
  {
    "id": "TAX-BCBM_BCBM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Music"
    ],
    "major": "Taxation",
    "name": "Bachelor of Commerce / Bachelor of Music Conjoint-Taxation"
  },
  {
    "id": "TAX-BCBP_BCBP_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Property"
    ],
    "major": "Taxation",
    "name": "Bachelor of Commerce / Bachelor of Property Conjoint-Taxation"
  },
  {
    "id": "TAX-BCBS_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Taxation",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Taxation"
  },
  {
    "id": "TAX-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Taxation",
    "name": "Bachelor of Commerce-Taxation"
  },
  {
    "id": "TCCP-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Transnational Cultures & Creative Practice",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Transnational Cultures & Creative Practice"
  },
  {
    "id": "TCCP-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "Transnational Cultures & Creative Practice",
    "name": "Bachelor of Commerce / Bachelor of Global Studies -Transnational Cultures & Creative Practice"
  },
  {
    "id": "TCCP-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Transnational Cultures & Creative Practice",
    "name": "Bachelor of Global Studies / Bachelor of Science -Transnational Cultures & Creative Practice"
  },
  {
    "id": "TCCP-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "Transnational Cultures & Creative Practice",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-Transnational Cultures & Creative Practice"
  },
  {
    "id": "TCCP-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "Transnational Cultures & Creative Practice",
    "name": "Bachelor of Global Studies-Transnational Cultures & Creative Practice"
  },
  {
    "id": "TESL-BA_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Teaching English to Speakers of Other Languages",
    "name": "Bachelor of Arts-Teaching English to Speakers of Other Languages"
  },
  {
    "id": "TESL-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Teaching English to Speakers of Other Languages",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Teaching English to Speakers of Other Languages"
  },
  {
    "id": "TESL-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Teaching English to Speakers of Other Languages",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Teaching English to Speakers of Other Languages"
  },
  {
    "id": "TESL-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Teaching English to Speakers of Other Languages",
    "name": "Bachelor of Arts / Bachelor of Global Studies -Teaching English to Speakers of Other Languages"
  },
  {
    "id": "TESL-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Teaching English to Speakers of Other Languages",
    "name": "Bachelor of Arts / Bachelor of Health Sciences -Teaching English to Speakers of Other Languages"
  },
  {
    "id": "TESL-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Teaching English to Speakers of Other Languages",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Teaching English to Speakers of Other Languages"
  },
  {
    "id": "TESL-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Teaching English to Speakers of Other Languages",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Teaching English to Speakers of Other Languages"
  },
  {
    "id": "TESL-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Teaching English to Speakers of Other Languages",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Teaching English to Speakers of Other Languages"
  },
  {
    "id": "TONG-BGBA_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Tongan",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-BGlobalSt Language: Tongan"
  },
  {
    "id": "TONG-BGBC_BCBG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Tongan",
    "name": "Bachelor of Commerce / Bachelor of Global Studies Conjoint-BGlobalSt Language: Tongan"
  },
  {
    "id": "TONG-BGBS_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "BGlobalSt Language: Tongan",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-BGlobalSt Language: Tongan"
  },
  {
    "id": "TONG-BGLB_BGLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Laws"
    ],
    "major": "BGlobalSt Language: Tongan",
    "name": "Bachelor of Global Studies / Bachelor of Laws Conjoint-BGlobalSt Language: Tongan"
  },
  {
    "id": "TONG-BGS_BGS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": "BGlobalSt Language: Tongan",
    "name": "Bachelor of Global Studies-BGlobalSt Language: Tongan"
  },
  {
    "id": "TREL-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Theological & Religious Studies",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Theological & Religious Studies"
  },
  {
    "id": "TREL-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Theological & Religious Studies",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Theological & Religious Studies"
  },
  {
    "id": "TREL-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Theological & Religious Studies",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Theological & Religious Studies"
  },
  {
    "id": "TREL-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Theological & Religious Studies",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Theological & Religious Studies"
  },
  {
    "id": "TREL-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Theological & Religious Studies",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Theological & Religious Studies"
  },
  {
    "id": "TREL-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Theological & Religious Studies",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Theological & Religious Studies"
  },
  {
    "id": "TREL-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Theological & Religious Studies",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Theological & Religious Studies"
  },
  {
    "id": "TREL-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Theological & Religious Studies",
    "name": "Bachelor of Arts-Theological & Religious Studies"
  },
  {
    "id": "URPL-BUPH_BUPH_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Urban Planning (Honours)"
    ],
    "major": "Urban Planning",
    "name": "Bachelor of Urban Planning (Honours)-Urban Planning"
  },
  {
    "id": "ECS-BECS_BECS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Early Childhood Studies"
    ],
    "major": "Early Childhood Studies",
    "name": "Bachelor of Early Childhood Studies-Early Childhood Studies"
  },
  {
    "id": "HESO-BABC_BABC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Commerce"
    ],
    "major": "Health and Society",
    "name": "Bachelor of Arts / Bachelor of Commerce Conjoint-Health and Society"
  },
  {
    "id": "AESL-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Academic English Studies and Linguistics",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Academic English Studies and Linguistics"
  },
  {
    "id": "ANTH-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Anthropology",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Anthropology"
  },
  {
    "id": "ARTH-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Art History",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Art History"
  },
  {
    "id": "ASNS-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Asian Studies",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Asian Studies"
  },
  {
    "id": "CHIN-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Chinese",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Chinese"
  },
  {
    "id": "CLAN-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Classical Studies and Ancient History",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Classical Studies and Ancient History"
  },
  {
    "id": "COSC-BOBA_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Communication and Social Change",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Communication and Social Change"
  },
  {
    "id": "COTC-BOBA_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Communication and Technology",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Communication and Technology"
  },
  {
    "id": "COLD-BOBA_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Communication in Leadership",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Communication in Leadership"
  },
  {
    "id": "CRIM-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Criminology",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Criminology"
  },
  {
    "id": "DRMA-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Drama",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Drama"
  },
  {
    "id": "ECON-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Economics",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Economics"
  },
  {
    "id": "EDUC-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Education",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Education"
  },
  {
    "id": "EROS-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Employment Relations and Organisation Studies",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Employment Relations and Organisation Studies"
  },
  {
    "id": "ENGL-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "English",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-English"
  },
  {
    "id": "EURO-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "European Studies",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-European Studies"
  },
  {
    "id": "FREN-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "French",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-French"
  },
  {
    "id": "GEND-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Gender Studies",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Gender Studies"
  },
  {
    "id": "GEOG-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Geography",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Geography"
  },
  {
    "id": "GERM-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "German",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-German"
  },
  {
    "id": "HESO-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Health and Society",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Health and Society"
  },
  {
    "id": "HIST-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "History",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-History"
  },
  {
    "id": "ITAL-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Italian",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Italian"
  },
  {
    "id": "JAPN-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Japanese",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Japanese"
  },
  {
    "id": "KORE-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Korean",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Korean"
  },
  {
    "id": "LATN-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Latin",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Latin"
  },
  {
    "id": "LING-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Linguistics",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Linguistics"
  },
  {
    "id": "LOGC-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Logic and Computation",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Logic and Computation"
  },
  {
    "id": "MAOR-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "M?ori Studies",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-M?ori Studies"
  },
  {
    "id": "MATH-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Mathematics",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Mathematics"
  },
  {
    "id": "MESC-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Media and Screen Studies",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Media and Screen Studies"
  },
  {
    "id": "MUSI-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Music",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Music"
  },
  {
    "id": "PACI-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Pacific Studies",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Pacific Studies"
  },
  {
    "id": "PHIL-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Philosophy",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Philosophy"
  },
  {
    "id": "POIR-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Politics and International Relations",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Politics and International Relations"
  },
  {
    "id": "PSYC-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Psychology",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Psychology"
  },
  {
    "id": "SOCI-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Sociology",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Sociology"
  },
  {
    "id": "SPAN-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Spanish",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Spanish"
  },
  {
    "id": "STAT-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Statistics",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Statistics"
  },
  {
    "id": "TESL-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Teaching English to Speakers of Other Languages",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Teaching English to Speakers of Other Languages"
  },
  {
    "id": "TREL-BABO_BABO_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Communication"
    ],
    "major": "Theological and Religious Studies",
    "name": "Bachelor of Arts / Bachelor of Communication Conjoint-Theological and Religious Studies"
  },
  {
    "id": "HESO-BABD_BABD_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Design"
    ],
    "major": "Health and Society",
    "name": "Bachelor of Arts / Bachelor of Design Conjoint-Health and Society"
  },
  {
    "id": "HESO-BABG_BABG_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Global Studies"
    ],
    "major": "Health and Society",
    "name": "Bachelor of Arts / Bachelor of Global Studies Conjoint-Health and Society"
  },
  {
    "id": "HESO-BABHS_BABHS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Health Sciences"
    ],
    "major": "Health and Society",
    "name": "Bachelor of Arts / Bachelor of Health Sciences Conjoint-Health and Society"
  },
  {
    "id": "HESO-BALB_BALB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Laws"
    ],
    "major": "Health and Society",
    "name": "Bachelor of Arts / Bachelor of Laws Conjoint-Health and Society"
  },
  {
    "id": "HESO-BABM_BABM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Music"
    ],
    "major": "Health and Society",
    "name": "Bachelor of Arts / Bachelor of Music Conjoint-Health and Society"
  },
  {
    "id": "ENVP-BSBA_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Environmental Physics",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Environmental Physics"
  },
  {
    "id": "HESO-BABS_BABS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts",
      "Bachelor of Science"
    ],
    "major": "Health and Society",
    "name": "Bachelor of Arts / Bachelor of Science Conjoint-Health and Society"
  },
  {
    "id": "HESO-BAMAJ_BA_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": "Health and Society",
    "name": "Bachelor of Arts-Health and Society"
  },
  {
    "id": "ENVP-BSBC_BCBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce",
      "Bachelor of Science"
    ],
    "major": "Environmental Physics",
    "name": "Bachelor of Commerce / Bachelor of Science Conjoint-Environmental Physics"
  },
  {
    "id": "COSC-BCM_BCM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Communication"
    ],
    "major": "Communication and Social Change",
    "name": "Bachelor of Communication-Communication and Social Change"
  },
  {
    "id": "COTC-BCM_BCM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Communication"
    ],
    "major": "Communication and Technology",
    "name": "Bachelor of Communication-Communication and Technology"
  },
  {
    "id": "COLD-BCM_BCM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Communication"
    ],
    "major": "Communication in Leadership",
    "name": "Bachelor of Communication-Communication in Leadership"
  },
  {
    "id": "ENVP-BSBD_BDBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Design",
      "Bachelor of Science"
    ],
    "major": "Environmental Physics",
    "name": "Bachelor of Design / Bachelor of Science Conjoint-Environmental Physics"
  },
  {
    "id": "ENVP-BSBEH_BEHBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Engineering (Honours)",
      "Bachelor of Science"
    ],
    "major": "Environmental Physics",
    "name": "Bachelor of Engineering (Honours) / Bachelor of Science Conjoint-Environmental Physics"
  },
  {
    "id": "ENVP-BSBG_BGBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Global Studies",
      "Bachelor of Science"
    ],
    "major": "Environmental Physics",
    "name": "Bachelor of Global Studies / Bachelor of Science Conjoint-Environmental Physics"
  },
  {
    "id": "ENVP-BSBHS_BHSBS_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences",
      "Bachelor of Science"
    ],
    "major": "Environmental Physics",
    "name": "Bachelor of Health Sciences / Bachelor of Science Conjoint-Environmental Physics"
  },
  {
    "id": "ENVP-BSBM_BMBS_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Music",
      "Bachelor of Science"
    ],
    "major": "Environmental Physics",
    "name": "Bachelor of Music / Bachelor of Science Conjoint-Environmental Physics"
  },
  {
    "id": "ENVP-BSLB_BSLB_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science",
      "Bachelor of Laws"
    ],
    "major": "Environmental Physics",
    "name": "Bachelor of Science / Bachelor of Laws Conjoint-Environmental Physics"
  },
  {
    "id": "HRM-BCOM_BCOM_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": "Human Resource Management",
    "name": "Bachelor of Commerce-Human Resource Management"
  },
  {
    "id": "CMB-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Cell and Molecular Bioscience",
    "name": "Bachelor of Science-Cell and Molecular Bioscience"
  },
  {
    "id": "BEE-BSC_BSC_C",
    "university": "UoA",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": "Biodiversity, Ecology and Evolution",
    "name": "Bachelor of Science-Biodiversity, Ecology and Evolution"
  },
  {
    "id": "NUTR-BHSC_BHSC_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences"
    ],
    "major": "Nutrition",
    "name": "Bachelor of Health Sciences-Nutrition"
  },
  {
    "id": "HSDA-BHSC_BHSC_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences"
    ],
    "major": "Health Systems and Data Analytics",
    "name": "Bachelor of Health Sciences-Health Systems and Data Analytics"
  },
  {
    "id": "COMH-BHSC_BHSC_H",
    "university": "UoA",
    "degrees": [
      "Bachelor of Health Sciences"
    ],
    "major": "Community Health",
    "name": "Bachelor of Health Sciences-Community Health"
  },
  {
    "id": "VUW113",
    "university": "VUW",
    "degrees": [
      "Bachelor of Global Studies"
    ],
    "major": null,
    "name": "Bachelor of Global Studies"
  },
  {
    "id": "VUW114",
    "university": "VUW",
    "degrees": [
      "Bachelor of Psychology"
    ],
    "major": null,
    "name": "Bachelor of Psychology"
  },
  {
    "id": "VUW100",
    "university": "VUW",
    "degrees": [
      "Bachelor of Architectural Studies"
    ],
    "major": null,
    "name": "Bachelor of Architectural Studies"
  },
  {
    "id": "VUW101",
    "university": "VUW",
    "degrees": [
      "Bachelor of Arts"
    ],
    "major": null,
    "name": "Bachelor of Arts"
  },
  {
    "id": "VUW102",
    "university": "VUW",
    "degrees": [
      "Bachelor of Biomedical Science"
    ],
    "major": null,
    "name": "Bachelor of Biomedical Science"
  },
  {
    "id": "VUW103",
    "university": "VUW",
    "degrees": [
      "Bachelor of Science"
    ],
    "major": null,
    "name": "Bachelor of Science"
  },
  {
    "id": "VUW104",
    "university": "VUW",
    "degrees": [
      "Bachelor of Commerce"
    ],
    "major": null,
    "name": "Bachelor of Commerce"
  },
  {
    "id": "VUW105",
    "university": "VUW",
    "degrees": [
      "Bachelor of Building Science"
    ],
    "major": null,
    "name": "Bachelor of Building Science"
  },
  {
    "id": "VUW106",
    "university": "VUW",
    "degrees": [
      "Bachelor of Communication"
    ],
    "major": null,
    "name": "Bachelor of Communication"
  },
  {
    "id": "VUW107",
    "university": "VUW",
    "degrees": [
      "Bachelor of Design Innovation"
    ],
    "major": null,
    "name": "Bachelor of Design Innovation"
  },
  {
    "id": "VUW108",
    "university": "VUW",
    "degrees": [
      "Bachelor of Education (Teaching) Early Childhood"
    ],
    "major": null,
    "name": "Bachelor of Education (Teaching) Early Childhood"
  },
  {
    "id": "VUW109",
    "university": "VUW",
    "degrees": [
      "Bachelor of Engineering (Honours)"
    ],
    "major": null,
    "name": "Bachelor of Engineering (Honours)"
  },
  {
    "id": "VUW110",
    "university": "VUW",
    "degrees": [
      "Bachelor of Health"
    ],
    "major": null,
    "name": "Bachelor of Health"
  },
  {
    "id": "VUW111",
    "university": "VUW",
    "degrees": [
      "Bachelor of Laws"
    ],
    "major": null,
    "name": "Bachelor of Laws"
  },
  {
    "id": "VUW112",
    "university": "VUW",
    "degrees": [
      "Bachelor of Music"
    ],
    "major": null,
    "name": "Bachelor of Music"
  },
  {
    "id": "VUW117 - BEnvSoc - 2026",
    "university": "VUW",
    "degrees": [
      "Bachelor of Environment and Society"
    ],
    "major": null,
    "name": "Bachelor of Environment and Society"
  },
  {
    "id": "VUW115 - 2025",
    "university": "VUW",
    "degrees": [
      "Bachelor of Construction"
    ],
    "major": null,
    "name": "Bachelor of Construction"
  },
  {
    "id": "VUW116 - 2025",
    "university": "VUW",
    "degrees": [
      "Bachelor of Midwifery"
    ],
    "major": null,
    "name": "Bachelor of Midwifery"
  }
]

const uniq = (xs: string[]) => Array.from(new Set(xs)).sort()

/** All degrees offered at a university (both halves of conjoints included). */
export const degreesFor = (u: PathwayUniversity) =>
  uniq(DESTINATIONS.filter((d) => d.university === u).flatMap((d) => d.degrees))

/** Degrees that can be taken as a conjoint with the chosen degree. */
export const conjointsFor = (u: PathwayUniversity, degree: string) =>
  uniq(
    DESTINATIONS.filter((d) => d.university === u && d.degrees.length === 2 && d.degrees.includes(degree))
      .map((d) => d.degrees.find((x) => x !== degree) as string),
  )

/** Products (= majors) for a degree, or a degree + conjoint pair. */
export const majorsFor = (u: PathwayUniversity, degree: string, conjoint: string | null) =>
  DESTINATIONS.filter(
    (d) =>
      d.university === u &&
      (conjoint ? d.degrees.length === 2 && d.degrees.includes(degree) && d.degrees.includes(conjoint) : d.degrees.length === 1 && d.degrees[0] === degree),
  )

/** Typeahead: every term must appear in the product name. "commerce law accounting" → BCom/LLB Conjoint – Accounting. */
export function searchDestinations(q: string, u?: PathwayUniversity, limit = 25): Destination[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return DESTINATIONS.filter(
    (d) => (!u || d.university === u) && terms.every((t) => d.name.toLowerCase().includes(t)),
  ).slice(0, limit)
}

/** Display label: "Bachelor of Commerce / Bachelor of Laws Conjoint – Accounting". */
export const destinationLabel = (d: Destination) =>
  d.degrees.join(' / ') + (d.degrees.length === 2 ? ' Conjoint' : '') + (d.major ? ` – ${d.major}` : '')
