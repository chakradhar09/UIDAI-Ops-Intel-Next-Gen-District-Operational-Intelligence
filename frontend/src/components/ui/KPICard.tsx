'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn, formatNumber, formatCompact } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: number
  subtitle?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'danger' | 'success' | 'warning'
  delay?: number
  compact?: boolean
}

const variantConfig = {
  default: {
    iconBg: 'bg-gradient-to-br from-uidai-navy to-uidai-navy-dark',
    iconShadow: 'shadow-uidai-navy/30',
    accentLine: 'bg-gradient-to-r from-uidai-navy to-uidai-navy-light',
    badge: 'bg-blue-50 text-uidai-navy border-blue-200',
  },
  danger: {
    iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
    iconShadow: 'shadow-rose-500/30',
    accentLine: 'bg-gradient-to-r from-rose-500 to-rose-400',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  success: {
    iconBg: 'bg-gradient-to-br from-uidai-green to-uidai-green-dark',
    iconShadow: 'shadow-uidai-green/30',
    accentLine: 'bg-gradient-to-r from-uidai-green to-uidai-green-light',
    badge: 'bg-green-50 text-uidai-green border-green-200',
  },
  warning: {
    iconBg: 'bg-gradient-to-br from-uidai-saffron to-uidai-saffron-dark',
    iconShadow: 'shadow-uidai-saffron/30',
    accentLine: 'bg-gradient-to-r from-uidai-saffron to-uidai-saffron-light',
    badge: 'bg-orange-50 text-uidai-saffron border-orange-200',
  },
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  delay = 0,
  compact = false,
}: KPICardProps) {
  const config = variantConfig[variant]

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-500'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="relative bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 overflow-hidden">
        {/* Top accent line */}
        <div className={cn('absolute top-0 left-0 right-0 h-1', config.accentLine)} />
        
        <div className="p-5 pt-6">
          {/* Header with icon and trend */}
          <div className="flex items-start justify-between mb-4">
            {/* Icon */}
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
              config.iconBg,
              config.iconShadow
            )}>
              <Icon className="w-6 h-6 text-white" strokeWidth={2} />
            </div>

            {/* Trend Badge */}
            {trend && trendValue && (
              <div className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
                config.badge
              )}>
                <TrendIcon className={cn('w-3.5 h-3.5', trendColor)} />
                <span>{trendValue}</span>
              </div>
            )}
          </div>

          {/* Value */}
          <div className="mb-1">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {compact ? formatCompact(value) : formatNumber(value)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-700 mb-0.5">{title}</h3>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        {/* Subtle hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-100/0 group-hover:from-slate-50/50 group-hover:to-slate-100/30 transition-all duration-300 pointer-events-none" />
      </div>
    </motion.div>
  )
}

export default KPICard
