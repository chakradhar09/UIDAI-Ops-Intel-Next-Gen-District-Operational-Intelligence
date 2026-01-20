'use client'

import { DonutChart, Legend, Color } from '@tremor/react'
import { formatCompact, formatPercent } from '@/lib/utils'
import type { AgeDistribution } from '@/lib/api'

interface AgeDistributionChartProps {
  data: AgeDistribution
}

const LABELS: Record<string, string> = {
  'age_0_5': '0-5 Years',
  'age_5_17': '5-17 Years',
  'age_18_greater': '18+ Years',
}

// UIDAI brand colors
const UIDAI_COLORS = {
  saffron: '#f26522',
  navy: '#1a4480',
  green: '#2e7d32',
}

// Tremor color names for the chart
const CHART_COLORS: Color[] = ['orange', 'blue', 'emerald']

export function AgeDistributionChart({ data }: AgeDistributionChartProps) {
  const chartData = Object.entries(data.totals).map(([key, value], index) => ({
    name: LABELS[key] || key,
    value,
    percentage: data.percentages[key as keyof typeof data.percentages],
  }))

  const totalValue = Object.values(data.totals).reduce((acc, val) => acc + val, 0)
  const valueFormatter = (value: number) => formatCompact(value)

  const colorArray = [UIDAI_COLORS.saffron, UIDAI_COLORS.navy, UIDAI_COLORS.green]

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative">
        <DonutChart
          className="h-64"
          data={chartData}
          category="value"
          index="name"
          colors={CHART_COLORS}
          valueFormatter={valueFormatter}
          showAnimation={true}
          showTooltip={true}
          variant="donut"
          customTooltip={({ payload, active }) => {
            if (!active || !payload?.length) return null
            const item = payload[0]?.payload
            return (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                <p className="text-sm font-bold text-slate-800 mb-2">{item?.name}</p>
                <p className="text-2xl font-bold text-uidai-navy">
                  {formatCompact(item?.value || 0)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-uidai-navy rounded-full"
                      style={{ width: `${item?.percentage || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {formatPercent(item?.percentage || 0)}
                  </span>
                </div>
              </div>
            )
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Total Enrolments</p>
            <p className="text-3xl font-bold text-uidai-navy">{formatCompact(totalValue)}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-uidai-saffron"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-uidai-navy"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-uidai-green"></div>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Age Groups</p>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-2 w-full">
        {chartData.map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorArray[idx] }} />
              <span className="text-sm font-medium text-slate-700">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-slate-800">{formatPercent(item.percentage)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AgeDistributionChart
