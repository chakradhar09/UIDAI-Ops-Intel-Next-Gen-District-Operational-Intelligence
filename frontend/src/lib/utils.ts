import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number with locale-specific thousands separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num)
}

/**
 * Format number as compact (e.g., 1.2K, 3.4M)
 */
export function formatCompact(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

/**
 * Format percentage
 */
export function formatPercent(num: number, decimals: number = 1): string {
  return `${num.toFixed(decimals)}%`
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format date for API
 */
export function toAPIDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Get color based on severity
 */
export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '#EF4444' // red-500
    case 'warning':
      return '#F59E0B' // amber-500
    case 'info':
      return '#3B82F6' // blue-500
    default:
      return '#6B7280' // gray-500
  }
}

/**
 * Get migration category color
 */
export function getMigrationColor(category: string): string {
  if (category.includes('High')) return '#B72025' // UIDAI Red
  if (category.includes('Moderate')) return '#FDB913' // UIDAI Yellow
  return '#10B981' // emerald-500
}

/**
 * Calculate percentage change
 */
export function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Delay utility for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
