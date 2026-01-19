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

const COLORS: Color[] = ['#B72025', '#3B82F6', '#10B981']

export function AgeDistributionChart({ data }: AgeDistributionChartProps) {
  const chartData = Object.entries(data.totals).map(([key, value], index) => ({
    name: LABELS[key] || key,
    value,
    percentage: data.percentages[key as keyof typeof data.percentages],
  }))

  const totalValue = Object.values(data.totals).reduce((acc, val) => acc + val, 0)
  const valueFormatter = (value: number) => formatCompact(value)

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative">
        <DonutChart
          className="h-64"
          data={chartData}
          category="value"
          index="name"
          colors={COLORS}
          valueFormatter={valueFormatter}
          showAnimation={true}
          showTooltip={true}
          variant="donut"
          customTooltip={({ payload, active }) => {
            if (!active || !payload?.length) return null
            const item = payload[0]?.payload
            return (
              <div className="rounded-xl border-2 border-white bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-md p-4 shadow-2xl">
                <p className="text-sm font-bold text-slate-800 mb-2">{item?.name}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-uidai-red to-blue-600 bg-clip-text text-transparent">
                  {formatCompact(item?.value || 0)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-uidai-red to-blue-600 rounded-full"
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
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-bold text-slate-800">{formatCompact(totalValue)}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-2 w-full">
        {chartData.map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] as string }} />
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
