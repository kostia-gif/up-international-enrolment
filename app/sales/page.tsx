import type { Metadata } from 'next'
import type { Audience } from '@/lib/entry-requirements'
import { SalesHeader } from '@/components/sales/sales-header'
import { SalesDashboard } from '@/components/sales/sales-dashboard'

export const metadata: Metadata = {
  title: 'Sales pipeline · UP Apply Platform',
  description: 'Conversion, applications, outstanding conditions and INZ visa outcomes across the business.',
}

const VIEWS: Audience[] = ['internal', 'agent', 'stakeholder']

export default async function SalesPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view: rawView } = await searchParams
  const view = rawView === 'external' ? 'stakeholder' : rawView
  const audience = VIEWS.includes(view as Audience) ? (view as Audience) : 'internal'
  return (
    <div className="min-h-dvh bg-background">
      <SalesHeader audience={audience} />
      <SalesDashboard audience={audience} />
    </div>
  )
}
