'use client'

import { Card, Metric, Text, Flex, BadgeDelta, Color } from '@tremor/react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn, formatNumber, formatCompact } from '@/lib/utils'

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

const variantColors: Record<string, Color> = {
  default: 'rose',
  danger: 'rose',
  success: 'emerald',
  warning: 'amber',
}

const variantStyles = {
  default: {
    accent: 'from-uidai-red to-uidai-red-dark',
    icon: 'bg-rose-100 text-rose-600',
  },
  danger: {
    accent: 'from-red-500 to-red-600',
    icon: 'bg-red-100 text-red-600',
  },
  success: {
    accent: 'from-emerald-500 to-emerald-600',
    icon: 'bg-emerald-100 text-emerald-600',
  },
  warning: {
    accent: 'from-amber-500 to-amber-600',
    icon: 'bg-amber-100 text-amber-600',
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
  const styles = variantStyles[variant]
  const color = variantColors[variant]

  const deltaType = trend === 'up' ? 'moderateIncrease' : trend === 'down' ? 'moderateDecrease' : 'unchanged'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card 
        className="relative overflow-hidden"
        decoration="top"
        decorationColor={color}
      >
        {/* Background Pattern */}
        <div className="absolute -right-4 -top-4 w-20 h-20 opacity-5">
          <Icon className="w-full h-full" />
        </div>

        <Flex alignItems="start" justifyContent="between">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              styles.icon
            )}
          >
            <Icon className="w-6 h-6" />
          </div>

          {trend && trendValue && (
            <BadgeDelta deltaType={deltaType} size="sm">
              {trendValue}
            </BadgeDelta>
          )}
        </Flex>

        <Metric className="mt-4">
          {compact ? formatCompact(value) : formatNumber(value)}
        </Metric>
        
        <Text className="mt-1">{title}</Text>
        
        {subtitle && (
          <Text className="text-xs text-slate-400 mt-1">{subtitle}</Text>
        )}
      </Card>
    </motion.div>
  )
}

export default KPICard
