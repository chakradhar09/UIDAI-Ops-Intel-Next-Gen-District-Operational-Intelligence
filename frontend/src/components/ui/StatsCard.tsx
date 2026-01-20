'use client'

import { motion } from 'framer-motion'
import { cn, formatNumber } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number
  total?: number
  color?: 'orange' | 'blue' | 'green' | 'amber' | 'rose'
  delay?: number
}

const colorStyles = {
  orange: {
    bar: 'bg-gradient-to-r from-orange-500 to-orange-400',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
  },
  blue: {
    bar: 'bg-gradient-to-r from-indigo-500 to-indigo-400',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
  green: {
    bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  amber: {
    bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  rose: {
    bar: 'bg-gradient-to-r from-rose-500 to-rose-400',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
  },
}

export function StatsCard({ 
  title, 
  value, 
  total = 100,
  color = 'orange',
  delay = 0 
}: StatsCardProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  const styles = colorStyles[color]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{formatNumber(value)}</p>
        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
          <span className={cn('font-semibold', styles.text)}>{percentage.toFixed(1)}%</span>
          <span>of {formatNumber(total)}</span>
        </div>
        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
            className={cn('h-full rounded-full', styles.bar)}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard
