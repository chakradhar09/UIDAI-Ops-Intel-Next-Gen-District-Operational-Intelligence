'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon: LucideIcon
  variant?: 'red' | 'yellow' | 'blue' | 'green'
  action?: React.ReactNode
}

const variantStyles = {
  red: 'bg-uidai-red',
  yellow: 'bg-uidai-yellow',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  variant = 'red',
  action,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between mb-6"
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            'text-white shadow-lg',
            variantStyles[variant]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}

export default SectionHeader
