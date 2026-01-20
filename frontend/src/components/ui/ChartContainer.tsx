'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ChartContainerProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  delay?: number
  action?: React.ReactNode
  gradient?: boolean
}

export function ChartContainer({
  title,
  subtitle,
  children,
  className,
  delay = 0,
  action,
  gradient = false,
}: ChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn('relative', className)}
    >
      <div className={cn(
        'bg-white rounded-2xl border border-slate-200/60 shadow-sm',
        'hover:shadow-lg hover:border-slate-300/60 transition-all duration-300',
        gradient && 'ring-1 ring-inset ring-slate-100'
      )}>
        {(title || action) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <div>
              {title && (
                <h3 className="text-base font-semibold text-slate-800">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
              )}
            </div>
            {action}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export default ChartContainer
