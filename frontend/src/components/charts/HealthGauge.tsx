'use client'

import { ProgressCircle, Badge, Color } from '@tremor/react'
import { motion } from 'framer-motion'

interface HealthGaugeProps {
  score: number
  title?: string
}

export function HealthGauge({ score, title = 'Data Quality Score' }: HealthGaugeProps) {
  const getColor = (score: number): Color => {
    if (score >= 80) return 'emerald'
    if (score >= 50) return 'amber'
    return 'rose'
  }

  const getStatus = (score: number): string => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Attention'
  }

  const color = getColor(score)
  const status = getStatus(score)

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <ProgressCircle 
        value={score} 
        size="xl" 
        color={color}
        showAnimation={true}
      >
        <div className="text-center">
          <span className="text-3xl font-bold text-slate-900">
            {score.toFixed(0)}
          </span>
          <span className="text-sm text-slate-500 block">/ 100</span>
        </div>
      </ProgressCircle>

      <Badge color={color} size="lg" className="mt-4">
        {status}
      </Badge>

      {title && (
        <p className="text-sm font-medium text-slate-600 mt-3">{title}</p>
      )}
    </motion.div>
  )
}

export default HealthGauge
