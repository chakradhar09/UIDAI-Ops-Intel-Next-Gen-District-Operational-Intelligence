'use client'

import { AreaChart, Color } from '@tremor/react'
import { format, parseISO } from 'date-fns'
import { formatCompact } from '@/lib/utils'
import type { MigrationTrend } from '@/lib/api'

interface MigrationTrendChartProps {
  data: MigrationTrend[]
}

export function MigrationTrendChart({ data }: MigrationTrendChartProps) {
  const chartData = data.map(d => ({
    date: format(parseISO(d.date), 'MMM yyyy'),
    'Enrolments': d.enrolments,
    'Demo Updates': d.demo_updates,
    'Migration Ratio': d.migration_ratio * 100, // Convert to percentage
  }))

  const valueFormatter = (value: number) => formatCompact(value)

  return (
    <div className="uidai-chart-area">
    <AreaChart
      className="h-80 [&_.recharts-area:first-of-type_.recharts-area-area]:fill-[#F7941D] [&_.recharts-area:first-of-type_.recharts-area-curve]:stroke-[#F7941D] [&_.recharts-area:last-of-type_.recharts-area-area]:fill-[#2E3192] [&_.recharts-area:last-of-type_.recharts-area-curve]:stroke-[#2E3192] [&_.recharts-default-legend_.recharts-legend-item:first-of-type_.recharts-surface]:!fill-[#F7941D] [&_.recharts-default-legend_.recharts-legend-item:first-of-type]:!text-[#F7941D] [&_.recharts-default-legend_.recharts-legend-item:last-of-type_.recharts-surface]:!fill-[#2E3192] [&_.recharts-default-legend_.recharts-legend-item:last-of-type]:!text-[#2E3192]"
      data={chartData}
      index="date"
      categories={['Enrolments', 'Demo Updates']}
      colors={['orange', 'indigo'] as Color[]}
      valueFormatter={valueFormatter}
      showLegend={true}
      showGridLines={true}
      showAnimation={true}
      curveType="monotone"
      customTooltip={({ payload, active }) => {
        if (!active || !payload?.length) return null
        const data = payload[0]?.payload
        const ratio = data?.['Migration Ratio'] || 0
        return (
          <div className="rounded-xl border-2 border-white bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-md p-4 shadow-2xl min-w-[220px]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{data?.date}</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color: '#F7941D' }}>Enrolments</span>
                <span className="text-sm font-bold" style={{ color: '#D97B0D' }}>{formatCompact(data?.Enrolments || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color: '#2E3192' }}>Demo Updates</span>
                <span className="text-sm font-bold" style={{ color: '#1E2062' }}>{formatCompact(data?.['Demo Updates'] || 0)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-medium">Migration Ratio</span>
                  <span className="text-sm font-bold" style={{ color: '#10B981' }}>{ratio.toFixed(1)}%</span>
                </div>
                <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(ratio, 100)}%`,
                      background: 'linear-gradient(to right, #F7941D, #2E3192)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      }}
    />
    </div>
  )
}

export default MigrationTrendChart
