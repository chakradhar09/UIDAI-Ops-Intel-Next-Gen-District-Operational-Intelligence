'use client'

import { Card, Flex, Text, Metric, ProgressBar, Color } from '@tremor/react'
import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: number
  total?: number
  color?: Color
  delay?: number
}

export function StatsCard({ 
  title, 
  value, 
  total = 100,
  color = 'rose',
  delay = 0 
}: StatsCardProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card>
        <Text>{title}</Text>
        <Metric className="mt-2">{value}</Metric>
        <Flex className="mt-4">
          <Text className="truncate">{percentage.toFixed(1)}%</Text>
          <Text className="truncate">of {total}</Text>
        </Flex>
        <ProgressBar value={percentage} color={color} className="mt-2" />
      </Card>
    </motion.div>
  )
}

export default StatsCard
