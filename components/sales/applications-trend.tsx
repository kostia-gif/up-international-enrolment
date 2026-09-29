'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { MonthBucket } from '@/lib/sales'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const config = {
  submitted: { label: 'Submitted', color: 'var(--chart-2)' },
  unfinished: { label: 'Unfinished', color: 'var(--chart-4)' },
} satisfies ChartConfig

export function ApplicationsTrend({ data }: { data: MonthBucket[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold">Applications by date of application</h2>
        <p className="text-xs text-muted-foreground">Monthly applications started, split by submitted and still unfinished.</p>
      </div>
      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        <BarChart data={data} margin={{ left: -8, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="submitted" stackId="a" fill="var(--color-submitted)" />
          <Bar dataKey="unfinished" stackId="a" fill="var(--color-unfinished)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </section>
  )
}
