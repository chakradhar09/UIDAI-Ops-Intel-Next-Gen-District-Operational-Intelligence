'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Building2,
  Calendar,
  ChevronDown,
  Filter,
  MapPin,
  RefreshCw,
  AlertTriangle,
  X,
  Menu,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AlertBadge } from '@/components/ui/AlertBadge'
import type { Anomaly } from '@/lib/api'

interface SidebarProps {
  districts: string[]
  selectedDistricts: string[]
  onDistrictsChange: (districts: string[]) => void
  dateRange: { min: string; max: string }
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onRefresh: () => void
  criticalAnomalies: Anomaly[]
  warningAnomalies: Anomaly[]
  isLoading?: boolean
}

export function Sidebar({
  districts,
  selectedDistricts,
  onDistrictsChange,
  dateRange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRefresh,
  criticalAnomalies,
  warningAnomalies,
  isLoading,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  // Detect screen size and set initial state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768 // md breakpoint
      setIsMobile(mobile)
      // On desktop, sidebar should always be open
      // On mobile, sidebar should be closed by default
      setIsOpen(!mobile)
    }

    // Check on mount
    checkScreenSize()

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleDistrict = (district: string) => {
    if (district === 'All') {
      onDistrictsChange([])
    } else if (selectedDistricts.includes(district)) {
      onDistrictsChange(selectedDistricts.filter(d => d !== district))
    } else {
      onDistrictsChange([...selectedDistricts, district])
    }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-3 rounded-xl shadow-lg border border-slate-200"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isMobile ? { x: isOpen ? 0 : '-100%' } : { x: 0 }}
        className={cn(
          'h-screen w-80 bg-slate-50/80 backdrop-blur-sm border-r border-slate-200/80',
          'flex flex-col transition-transform duration-300 ease-in-out',
          // Fixed positioning for both mobile and desktop
          'fixed left-0 top-0 z-50',
          // On desktop, ensure it's always visible
          'md:z-40'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200/60 bg-white/50">
          <div className="bg-gradient-to-br from-uidai-navy to-uidai-navy-dark rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">Ops-Intel</h1>
                <p className="text-sm opacity-80">District Dashboard</p>
              </div>
            </div>
          </div>
          {/* Back to Home Link */}
          <Link href="/" className="mt-4 flex items-center gap-2 text-sm text-slate-600 hover:text-uidai-saffron transition-colors group">
            <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Region Section */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <MapPin className="w-4 h-4" />
              Region
            </h3>

            {/* State (Fixed) */}
            <div className="mb-3">
              <label className="text-xs text-slate-500 mb-1 block">State</label>
              <div className="bg-slate-50 px-4 py-2.5 rounded-xl text-sm text-slate-600">
                Telangana
              </div>
            </div>

            {/* Districts Dropdown */}
            <div className="relative">
              <label className="text-xs text-slate-500 mb-1 block">Districts</label>
              <button
                onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
                className="w-full flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm hover:border-slate-300 transition-colors"
              >
                <span className="text-slate-700">
                  {selectedDistricts.length === 0
                    ? 'All Districts'
                    : `${selectedDistricts.length} selected`}
                </span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-slate-400 transition-transform',
                    showDistrictDropdown && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {showDistrictDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto"
                  >
                    <button
                      onClick={() => toggleDistrict('All')}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm hover:bg-slate-50',
                        selectedDistricts.length === 0 && 'bg-uidai-navy/5 text-uidai-navy font-medium'
                      )}
                    >
                      All Districts
                    </button>
                    {districts.map(district => (
                      <button
                        key={district}
                        onClick={() => toggleDistrict(district)}
                        className={cn(
                          'w-full px-4 py-2 text-left text-sm hover:bg-slate-50',
                          selectedDistricts.includes(district) && 'bg-uidai-navy/5 text-uidai-navy font-medium'
                        )}
                      >
                        {district}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Calendar className="w-4 h-4" />
              Time Period
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">From</label>
                <input
                  type="date"
                  value={startDate}
                  min={dateRange.min}
                  max={dateRange.max}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uidai-navy/20 focus:border-uidai-navy"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">To</label>
                <input
                  type="date"
                  value={endDate}
                  min={dateRange.min}
                  max={dateRange.max}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-uidai-navy/20 focus:border-uidai-navy"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Filter className="w-4 h-4" />
              Actions
            </h3>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-uidai-navy text-white px-4 py-3 rounded-xl font-medium hover:bg-uidai-navy-dark transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              {isLoading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>

          {/* Red Flags */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <AlertTriangle className="w-4 h-4" />
              Red Flags
            </h3>

            <div className="space-y-3">
              {criticalAnomalies.length > 0 ? (
                <>
                  <AlertBadge severity="Critical" count={criticalAnomalies.length} pulse />
                  <div className="space-y-2 mt-2">
                    {criticalAnomalies.slice(0, 3).map((alert, i) => (
                      <div
                        key={i}
                        className="bg-red-50 border border-red-100 rounded-xl p-3"
                      >
                        <p className="text-xs font-medium text-red-700">{alert.type}</p>
                        <p className="text-xs text-red-600 mt-0.5">{alert.district}</p>
                        <p className="text-xs text-red-500 mt-1">{alert.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <AlertBadge severity="Success" label="No critical issues" />
              )}

              {warningAnomalies.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer">
                    <AlertBadge severity="Warning" count={warningAnomalies.length} />
                  </summary>
                  <div className="mt-2 space-y-2">
                    {warningAnomalies.slice(0, 3).map((alert, i) => (
                      <div
                        key={i}
                        className="bg-amber-50 border border-amber-100 rounded-xl p-3"
                      >
                        <p className="text-xs font-medium text-amber-700">{alert.district}</p>
                        <p className="text-xs text-amber-600 mt-0.5">{alert.description}</p>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto p-6 border-t border-slate-200/60 bg-white/40">
          <div className="text-center text-xs space-y-1">
            <p className="font-semibold text-slate-700">UIDAI Data Hackathon 2026</p>
            <p className="text-slate-500">Built with ❤️ using Next.js</p>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
