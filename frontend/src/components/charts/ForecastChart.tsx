'use client'

import { AreaChart, Card, Color } from '@tremor/react'
import { format, parseISO } from 'date-fns'
import { formatCompact } from '@/lib/utils'
import type { ForecastPoint } from '@/lib/api'

interface ForecastChartProps {
  data: ForecastPoint[]
}

export function ForecastChart({ data }: ForecastChartProps) {
  // Transform data for Tremor
  const chartData = data.map(d => ({
    date: format(parseISO(d.date), 'MMM yyyy'),
    'Historical': !d.is_forecast ? d.total_enrolments : null,
    'Forecast': d.is_forecast ? d.total_enrolments : null,
  }))

  // Find the transition point and add overlap for continuity
  const lastHistoricalIdx = data.findIndex(d => d.is_forecast) - 1
  if (lastHistoricalIdx >= 0 && lastHistoricalIdx < chartData.length - 1) {
    // Copy the last historical value to forecast for line continuity
    chartData[lastHistoricalIdx + 1]['Historical'] = chartData[lastHistoricalIdx]['Historical']
  }

  const valueFormatter = (value: number) => formatCompact(value)

  return (
    <div className="uidai-chart-forecast">
    <AreaChart
      className="h-96"
      data={chartData}
      index="date"
      categories={['Historical', 'Forecast']}
      colors={['blue', 'orange'] as Color[]}
      valueFormatter={valueFormatter}
      showLegend={true}
      showGridLines={true}
      showAnimation={true}
      curveType="monotone"
      connectNulls={true}
      customTooltip={({ payload, active }) => {
        if (!active || !payload?.length) return null
        const data = payload[0]?.payload
        const isForecast = data?.Forecast !== null && data?.Historical === null
        return (
          <div className="rounded-xl border-2 border-white bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-md p-4 shadow-2xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{data?.date}</p>
            <p className={`text-2xl font-bold ${isForecast ? 'text-orange-600' : 'text-blue-600'}`}>
              {formatCompact(data?.Historical || data?.Forecast || 0)}
            </p>
            {isForecast && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-2 h-2 rounded-full animate-pulse bg-orange-500" />
                <p className="text-xs font-semibold text-orange-600">
                  Forecast (Predicted)
                </p>
              </div>
            )}
            {!isForecast && data?.Historical && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-xs font-semibold text-blue-600">
                  Historical Data
                </p>
              </div>
            )}
          </div>
        )
      }}
    />
    </div>
  )
}

export default ForecastChart
