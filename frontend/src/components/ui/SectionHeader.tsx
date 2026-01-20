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
  red: {
    bg: 'bg-gradient-to-br from-uidai-navy to-uidai-navy-dark',
    shadow: 'shadow-uidai-navy/25',
    text: 'text-uidai-navy',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-uidai-saffron to-uidai-saffron-dark',
    shadow: 'shadow-uidai-saffron/25',
    text: 'text-uidai-saffron',
  },
  blue: {
    bg: 'bg-gradient-to-br from-uidai-navy to-uidai-navy-dark',
    shadow: 'shadow-uidai-navy/25',
    text: 'text-uidai-navy',
  },
  green: {
    bg: 'bg-gradient-to-br from-uidai-green to-uidai-green-dark',
    shadow: 'shadow-uidai-green/25',
    text: 'text-uidai-green',
  },
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  variant = 'red',
  action,
}: SectionHeaderProps) {
  const styles = variantStyles[variant]

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
            'w-11 h-11 rounded-xl flex items-center justify-center',
            'text-white shadow-lg',
            styles.bg,
            styles.shadow
          )}
        >
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}

export default SectionHeader
