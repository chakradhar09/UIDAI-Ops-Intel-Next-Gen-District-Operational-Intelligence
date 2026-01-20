'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Calculator } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface DistrictMigration {
  district: string
  total_enrolments: number
  total_demo_updates: number
  migration_ratio: number
  migration_category: string
  migration_intensity: number
}

interface RatioExplainerProps {
  isOpen: boolean
  onClose: () => void
  migrationData: DistrictMigration[]
}

// ============================================================================
// CONSTANTS
// ============================================================================

const THRESHOLDS = {
  HIGH: 0.7,
  MEDIUM: 0.4,
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatNumber(num: number): string {
  return num.toLocaleString('en-IN')
}

function getCategoryColor(ratio: number): 'saffron' | 'navy' | 'green' {
  if (ratio >= THRESHOLDS.HIGH) return 'saffron'
  if (ratio >= THRESHOLDS.MEDIUM) return 'navy'
  return 'green'
}

// ============================================================================
// COMPONENT
// ============================================================================

export function RatioExplainer({ isOpen, onClose, migrationData }: RatioExplainerProps) {
  // Get top 3 districts by migration ratio for example calculations
  const topDistricts = [...migrationData]
    .sort((a, b) => b.migration_ratio - a.migration_ratio)
    .slice(0, 3)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - covers everything including the map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Modal Container */}
          <div 
            className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
            style={{ zIndex: 9999 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto"
            >
              <div className="max-w-lg w-full max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200">
                {/* Simple Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-uidai-navy/10 rounded-lg flex items-center justify-center">
                      <Calculator className="h-5 w-5 text-uidai-navy" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">How is Ratio Calculated?</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Formula - Simple */}
                  <div className="text-center py-4 px-5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Formula</p>
                    <p className="text-lg font-mono font-semibold text-slate-800">
                      Migration Ratio = Demographic Updates ÷ New Enrolments
                    </p>
                  </div>

                  {/* What the values mean */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <p className="text-xs font-medium text-uidai-saffron mb-1">📍 Demographic Updates</p>
                      <p className="text-xs text-slate-600">Address changes by existing Aadhaar holders moving into the district</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs font-medium text-uidai-navy mb-1">🆕 New Enrolments</p>
                      <p className="text-xs text-slate-600">Fresh Aadhaar registrations (new residents or first-time applicants)</p>
                    </div>
                  </div>

                  {/* What it means */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-2">What does the ratio indicate?</p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      A <span className="font-semibold text-uidai-saffron">high ratio</span> means more people are updating their address to this district than new Aadhaar registrations — indicating <strong>inward migration</strong> (people moving in).
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">
                      A <span className="font-semibold text-uidai-green">low ratio</span> suggests a stable, settled population with minimal movement.
                    </p>
                  </div>

                  {/* Thresholds - Compact */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">Classification Thresholds</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-orange-50 border border-orange-100">
                        <div>
                          <span className="text-sm font-medium text-slate-800">High Migration</span>
                          <p className="text-xs text-slate-500">Urban hubs, IT corridors, industrial zones</p>
                        </div>
                        <span className="text-sm font-bold text-uidai-saffron">≥ 70%</span>
                      </div>
                      <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-blue-50 border border-blue-100">
                        <div>
                          <span className="text-sm font-medium text-slate-800">Moderate Migration</span>
                          <p className="text-xs text-slate-500">Growing towns, satellite areas</p>
                        </div>
                        <span className="text-sm font-bold text-uidai-navy">40% - 70%</span>
                      </div>
                      <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-green-50 border border-green-100">
                        <div>
                          <span className="text-sm font-medium text-slate-800">Stable Population</span>
                          <p className="text-xs text-slate-500">Rural areas, established communities</p>
                        </div>
                        <span className="text-sm font-bold text-uidai-green">&lt; 40%</span>
                      </div>
                    </div>
                  </div>

                  {/* Example - Simple table */}
                  {topDistricts.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-3">Live Example from Data</p>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="text-left py-2.5 px-3 font-medium text-slate-600">District</th>
                              <th className="text-right py-2.5 px-3 font-medium text-slate-600">Updates</th>
                              <th className="text-right py-2.5 px-3 font-medium text-slate-600">Enrolments</th>
                              <th className="text-right py-2.5 px-3 font-medium text-slate-600">Ratio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topDistricts.slice(0, 2).map((d) => (
                              <tr key={d.district} className="border-t border-slate-100">
                                <td className="py-2.5 px-3 font-medium text-slate-800">{d.district}</td>
                                <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatNumber(d.total_demo_updates)}</td>
                                <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatNumber(d.total_enrolments)}</td>
                                <td className="py-2.5 px-3 text-right">
                                  <span className={`font-semibold ${
                                    getCategoryColor(d.migration_ratio) === 'saffron' ? 'text-uidai-saffron' :
                                    getCategoryColor(d.migration_ratio) === 'navy' ? 'text-uidai-navy' :
                                    'text-uidai-green'
                                  }`}>
                                    {(d.migration_ratio * 100).toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Step-by-step calculation */}
                      <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs font-medium text-uidai-navy uppercase tracking-wide mb-2">Step-by-Step: {topDistricts[0].district}</p>
                        <div className="space-y-1.5 text-sm">
                          <p className="text-slate-600">
                            <span className="text-slate-400 mr-2">1.</span>
                            Demographic Updates = <span className="font-mono font-semibold text-uidai-saffron">{formatNumber(topDistricts[0].total_demo_updates)}</span>
                          </p>
                          <p className="text-slate-600">
                            <span className="text-slate-400 mr-2">2.</span>
                            New Enrolments = <span className="font-mono font-semibold text-uidai-navy">{formatNumber(topDistricts[0].total_enrolments)}</span>
                          </p>
                          <p className="text-slate-600">
                            <span className="text-slate-400 mr-2">3.</span>
                            Ratio = <span className="font-mono">{formatNumber(topDistricts[0].total_demo_updates)} ÷ {formatNumber(topDistricts[0].total_enrolments)}</span> = <span className="font-semibold text-uidai-navy">{(topDistricts[0].migration_ratio * 100).toFixed(1)}%</span>
                          </p>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">
                          → This indicates <strong className={getCategoryColor(topDistricts[0].migration_ratio) === 'saffron' ? 'text-uidai-saffron' : getCategoryColor(topDistricts[0].migration_ratio) === 'navy' ? 'text-uidai-navy' : 'text-uidai-green'}>{topDistricts[0].migration_category}</strong> activity
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default RatioExplainer
