'use client'

import { BarChart, Color } from '@tremor/react'
import { formatCompact, truncate } from '@/lib/utils'
import type { WorkloadProjection } from '@/lib/api'

interface ProjectionChartProps {
  data: WorkloadProjection[]
  maxItems?: number
}

export function ProjectionChart({ data, maxItems = 10 }: ProjectionChartProps) {
  const chartData = data.slice(0, maxItems).map(d => ({
    district: truncate(d.district, 14),
    'Age 5 Updates': d.projected_age_5_updates,
    'Age 15 Updates': d.projected_age_15_updates,
  }))

  const valueFormatter = (value: number) => formatCompact(value)

  return (
    <BarChart
      className="h-96"
      data={chartData}
      index="district"
      categories={['Age 5 Updates', 'Age 15 Updates']}
      colors={['#B72025', '#3B82F6'] as Color[]}
      valueFormatter={valueFormatter}
      showLegend={true}
      showGridLines={true}
      showAnimation={true}
      stack={true}
      layout="vertical"
      yAxisWidth={110}
      customTooltip={({ payload, active }) => {
        if (!active || !payload?.length) return null
        const data = payload[0]?.payload
        const total = (data?.['Age 5 Updates'] || 0) + (data?.['Age 15 Updates'] || 0)
        return (
          <div className="rounded-xl border-2 border-white bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-md p-4 shadow-2xl min-w-[200px]">
            <p className="text-sm font-bold text-slate-800 mb-3">{data?.district}</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color: '#B72025' }}>Age 5 Updates</span>
                <span className="text-sm font-bold" style={{ color: '#8B181C' }}>{formatCompact(data?.['Age 5 Updates'] || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color: '#3B82F6' }}>Age 15 Updates</span>
                <span className="text-sm font-bold" style={{ color: '#2563EB' }}>{formatCompact(data?.['Age 15 Updates'] || 0)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-600 font-semibold">Total</span>
                <span className="text-base font-bold text-slate-900">{formatCompact(total)}</span>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}

export default ProjectionChart
