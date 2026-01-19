'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200',
        className
      )}
    />
  )
}

export function KPICardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 border border-slate-100 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-24 h-8 mb-2" />
      <Skeleton className="w-32 h-4 mb-1" />
      <Skeleton className="w-20 h-3" />
    </div>
  )
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="rounded-2xl bg-white p-6 border border-slate-100 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Skeleton className="w-40 h-6 mb-2" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>
      <Skeleton className="w-full" style={{ height }} />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl bg-white p-6 border border-slate-100 shadow-card">
      <Skeleton className="w-40 h-6 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="flex-1 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function MapSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 border border-slate-100 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Skeleton className="w-48 h-6 mb-2" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>
      <Skeleton className="w-full h-[400px] rounded-xl" />
    </div>
  )
}

export default Skeleton
