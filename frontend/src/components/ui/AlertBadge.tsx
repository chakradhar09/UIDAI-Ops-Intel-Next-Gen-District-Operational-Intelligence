'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertBadgeProps {
  severity: 'Critical' | 'Warning' | 'Info' | 'Success'
  count?: number
  label?: string
  pulse?: boolean
}

const severityConfig = {
  Critical: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: AlertCircle,
    dot: 'bg-red-500',
  },
  Warning: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: AlertTriangle,
    dot: 'bg-amber-500',
  },
  Info: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Info,
    dot: 'bg-blue-500',
  },
  Success: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle,
    dot: 'bg-emerald-500',
  },
}

export function AlertBadge({
  severity,
  count,
  label,
  pulse = false,
}: AlertBadgeProps) {
  const config = severityConfig[severity]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'text-sm font-medium border',
        config.bg,
        config.text,
        config.border
      )}
    >
      {pulse && severity === 'Critical' && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
      )}

      <Icon className="w-4 h-4" />

      {count !== undefined && (
        <span className="font-bold">{count}</span>
      )}

      {label && <span>{label}</span>}
    </motion.div>
  )
}

export default AlertBadge
