import { KNOWN_COUNTRIES } from './eligibility'

export interface AddressMatch {
  line1: string
  line2?: string
  city: string
  region: string
  postcode: string
  country: string
}

// Simulated address index for the POC. In production this is a call to an
// international address provider (e.g. Loqate or Google Places), scoped by
// the selected country.
const INDEX: Record<string, Omit<AddressMatch, 'country'>[]> = {
  'New Zealand': [
    { line1: '85 Albert Street', city: 'Auckland', region: 'Auckland', postcode: '1010' },
    { line1: '12 Queen Street', city: 'Auckland', region: 'Auckland', postcode: '1010' },
    { line1: '48 Cuba Street', line2: 'Te Aro', city: 'Wellington', region: 'Wellington', postcode: '6011' },
    { line1: '210 Colombo Street', city: 'Christchurch', region: 'Canterbury', postcode: '8011' },
    { line1: '7 Victoria Street', city: 'Hamilton', region: 'Waikato', postcode: '3204' },
  ],
  Vietnam: [
    { line1: '25 Nguyen Hue', line2: 'Ben Nghe Ward, District 1', city: 'Ho Chi Minh City', region: 'Ho Chi Minh', postcode: '700000' },
    { line1: '112 Le Loi', line2: 'Ben Thanh Ward, District 1', city: 'Ho Chi Minh City', region: 'Ho Chi Minh', postcode: '700000' },
    { line1: '18 Hang Bai', line2: 'Hoan Kiem District', city: 'Hanoi', region: 'Hanoi', postcode: '100000' },
    { line1: '45 Tran Phu', line2: 'Hai Chau District', city: 'Da Nang', region: 'Da Nang', postcode: '550000' },
  ],
  India: [
    { line1: '14 MG Road', line2: 'Ashok Nagar', city: 'Bengaluru', region: 'Karnataka', postcode: '560001' },
    { line1: '221 Linking Road', line2: 'Bandra West', city: 'Mumbai', region: 'Maharashtra', postcode: '400050' },
    { line1: '9 Park Street', city: 'Kolkata', region: 'West Bengal', postcode: '700016' },
    { line1: '56 Anna Salai', line2: 'Teynampet', city: 'Chennai', region: 'Tamil Nadu', postcode: '600018' },
    { line1: '33 Sector 17', city: 'Chandigarh', region: 'Punjab', postcode: '160017' },
  ],
  China: [
    { line1: '88 Nanjing East Road', line2: 'Huangpu District', city: 'Shanghai', region: 'Shanghai', postcode: '200001' },
    { line1: '1 Jianguomenwai Avenue', line2: 'Chaoyang District', city: 'Beijing', region: 'Beijing', postcode: '100004' },
    { line1: '208 Tianhe Road', line2: 'Tianhe District', city: 'Guangzhou', region: 'Guangdong', postcode: '510620' },
    { line1: '66 Renmin South Road', line2: 'Wuhou District', city: 'Chengdu', region: 'Sichuan', postcode: '610041' },
  ],
  'Saudi Arabia': [
    { line1: '4120 King Fahd Road', line2: 'Al Olaya', city: 'Riyadh', region: 'Riyadh Province', postcode: '12214' },
    { line1: '7781 Tahlia Street', line2: 'Al Andalus', city: 'Jeddah', region: 'Makkah Province', postcode: '23326' },
    { line1: '2260 Prince Mohammed Street', city: 'Dammam', region: 'Eastern Province', postcode: '32241' },
  ],
  Italy: [
    { line1: 'Via del Corso 120', city: 'Rome', region: 'Lazio', postcode: '00186' },
    { line1: 'Corso Buenos Aires 45', city: 'Milan', region: 'Lombardy', postcode: '20124' },
    { line1: 'Via dei Calzaiuoli 8', city: 'Florence', region: 'Tuscany', postcode: '50122' },
  ],
  Japan: [
    { line1: '2-11-3 Shibuya', city: 'Shibuya-ku', region: 'Tokyo', postcode: '150-0002' },
    { line1: '1-4-1 Umeda', line2: 'Kita-ku', city: 'Osaka', region: 'Osaka', postcode: '530-0001' },
    { line1: '3-5-12 Sakae', line2: 'Naka-ku', city: 'Nagoya', region: 'Aichi', postcode: '460-0008' },
  ],
  Pakistan: [
    { line1: '17 Mall Road', city: 'Lahore', region: 'Punjab', postcode: '54000' },
    { line1: 'Plot 34, Shahrah-e-Faisal', city: 'Karachi', region: 'Sindh', postcode: '75350' },
    { line1: 'House 9, Street 22, F-7/2', city: 'Islamabad', region: 'Islamabad Capital Territory', postcode: '44000' },
  ],
  Bangladesh: [
    { line1: 'House 12, Road 27', line2: 'Gulshan 1', city: 'Dhaka', region: 'Dhaka Division', postcode: '1212' },
    { line1: '45 Agrabad Commercial Area', city: 'Chattogram', region: 'Chattogram Division', postcode: '4100' },
  ],
  Philippines: [
    { line1: '6750 Ayala Avenue', line2: 'Makati', city: 'Metro Manila', region: 'NCR', postcode: '1226' },
    { line1: '28 Osmeña Boulevard', city: 'Cebu City', region: 'Central Visayas', postcode: '6000' },
  ],
}

export const ADDRESS_COUNTRIES: string[] = Array.from(
  new Set(['New Zealand', ...KNOWN_COUNTRIES, ...Object.keys(INDEX)]),
).sort((a, b) => a.localeCompare(b))

export function hasAddressIndex(country: string): boolean {
  return Boolean(INDEX[country])
}

export function postcodeLabel(country: string): string {
  if (country === 'United States') return 'ZIP code'
  if (country === 'India') return 'PIN code'
  return 'Postcode'
}

export function formatAddress(a: AddressMatch): string {
  return [a.line1, a.line2, a.city, a.region, a.postcode].filter(Boolean).join(', ')
}

export function searchAddresses(country: string, query: string, limit = 6): AddressMatch[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const tokens = q.split(/\s+/)
  return (INDEX[country] ?? [])
    .map((a) => ({ ...a, country }))
    .filter((a) => {
      const hay = formatAddress(a).toLowerCase()
      return tokens.every((t) => hay.includes(t))
    })
    .slice(0, limit)
}
