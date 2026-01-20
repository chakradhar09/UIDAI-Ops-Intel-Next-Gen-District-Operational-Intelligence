'use client'

import { BarChart, Color } from '@tremor/react'
import { formatCompact, truncate } from '@/lib/utils'
import type { DistrictEnrolment } from '@/lib/api'

interface DistrictBarChartProps {
  data: DistrictEnrolment[]
  maxItems?: number
}

export function DistrictBarChart({ data, maxItems = 12 }: DistrictBarChartProps) {
  const chartData = data.slice(0, maxItems).map((d, idx) => ({
    district: truncate(d.district, 12),
    'Total Enrolments': d.total_enrolments,
    rank: idx + 1,
  }))

  const valueFormatter = (value: number) => formatCompact(value)

  // Color code by tiers
  const getColorForRank = (rank: number): Color => {
    if (rank <= 3) return 'rose'
    if (rank <= 6) return 'amber'
    return 'emerald'
  }

  return (
    <div className="space-y-3">
      {chartData.slice(0, 5).map((item, idx) => {
        const percentage = (item['Total Enrolments'] / chartData[0]['Total Enrolments']) * 100
        return (
          <div key={item.district} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`
                  flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs
                  ${idx === 0 ? 'bg-gradient-to-br from-uidai-saffron to-uidai-saffron-dark text-white shadow-lg' : 
                    idx === 1 ? 'bg-gradient-to-br from-uidai-navy to-uidai-navy-dark text-white shadow-lg' :
                    idx === 2 ? 'bg-gradient-to-br from-uidai-green to-uidai-green-dark text-white shadow-lg' :
                    'bg-slate-200 text-slate-600'}
                `}>
                  #{idx + 1}
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {item.district}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800">{valueFormatter(item['Total Enrolments'])}</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`
                  h-full rounded-full transition-all duration-500 group-hover:shadow-lg
                  ${idx === 0 ? 'bg-gradient-to-r from-uidai-saffron to-uidai-saffron-dark' :
                    idx === 1 ? 'bg-gradient-to-r from-uidai-navy to-uidai-navy-dark' :
                    idx === 2 ? 'bg-gradient-to-r from-uidai-green to-uidai-green-dark' :
                    'bg-gradient-to-r from-uidai-navy-light to-uidai-navy'}
                `}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
      {chartData.length > 5 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-800 font-medium">
            View {chartData.length - 5} more districts →
          </summary>
          <div className="mt-3 space-y-3">
            {chartData.slice(5).map((item, idx) => {
              const percentage = (item['Total Enrolments'] / chartData[0]['Total Enrolments']) * 100
              const actualRank = idx + 6
              return (
                <div key={item.district} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-200 text-slate-600 font-bold text-xs">
                        #{actualRank}
                      </div>
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                        {item.district}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{valueFormatter(item['Total Enrolments'])}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-uidai-navy-light to-uidai-navy rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </details>
      )}
    </div>
  )
}

export default DistrictBarChart
