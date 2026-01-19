'use client'

import { Card, Title, Subtitle } from '@tremor/react'
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
      whileHover={{ y: -2 }}
      className={cn(
        'relative rounded-2xl',
        gradient && 'p-[2px] bg-gradient-to-br from-uidai-red/20 via-uidai-yellow/20 to-blue-500/20',
        className
      )}
    >
      <Card className={cn(
        'shadow-card hover:shadow-card-hover transition-all duration-300',
        gradient && 'bg-white m-0'
      )}>
        {(title || action) && (
          <div className="flex items-start justify-between mb-5">
            <div>
              {title && <Title className="text-slate-800">{title}</Title>}
              {subtitle && <Subtitle className="mt-1.5 text-slate-600">{subtitle}</Subtitle>}
            </div>
            {action}
          </div>
        )}
        {children}
      </Card>
    </motion.div>
  )
}

export default ChartContainer
