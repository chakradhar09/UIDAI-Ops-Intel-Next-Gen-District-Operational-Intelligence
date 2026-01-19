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
    <AreaChart
      className="h-80"
      data={chartData}
      index="date"
      categories={['Enrolments', 'Demo Updates']}
      colors={['#B72025', '#3B82F6'] as Color[]}
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
                <span className="text-xs font-medium" style={{ color: '#B72025' }}>Enrolments</span>
                <span className="text-sm font-bold" style={{ color: '#8B181C' }}>{formatCompact(data?.Enrolments || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color: '#3B82F6' }}>Demo Updates</span>
                <span className="text-sm font-bold" style={{ color: '#2563EB' }}>{formatCompact(data?.['Demo Updates'] || 0)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-medium">Migration Ratio</span>
                  <span className="text-sm font-bold" style={{ color: '#7C3AED' }}>{ratio.toFixed(1)}%</span>
                </div>
                <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(ratio, 100)}%`,
                      background: 'linear-gradient(to right, #B72025, #7C3AED)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}

export default MigrationTrendChart
