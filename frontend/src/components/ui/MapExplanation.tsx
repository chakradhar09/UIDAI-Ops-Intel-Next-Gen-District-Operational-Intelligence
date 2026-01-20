'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X, Map } from 'lucide-react'

interface MapExplanationProps {
  isOpen: boolean
  onClose: () => void
  totalDistricts: number
  visibleDistricts: number
}

export function MapExplanation({ isOpen, onClose, totalDistricts, visibleDistricts }: MapExplanationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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
                      <Map className="h-5 w-5 text-uidai-navy" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">District Map Display</h2>
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
                  {/* Summary - Simple */}
                  <div className="text-center py-4 px-5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Map Coverage</p>
                    <p className="text-base font-semibold text-slate-800 mb-1">
                      {totalDistricts} Districts shown through {visibleDistricts} Boundary Regions
                    </p>
                    <p className="text-xs text-slate-600">
                      Simplified boundaries for better visualization
                    </p>
                  </div>

                  {/* What this means */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs font-medium text-uidai-navy mb-1">📊 Total Districts</p>
                      <p className="text-xs text-slate-600">All {totalDistricts} districts have complete Aadhaar data in the analysis</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <p className="text-xs font-medium text-uidai-saffron mb-1">🗺️ Map Regions</p>
                      <p className="text-xs text-slate-600">Only {visibleDistricts} simplified polygons for faster rendering</p>
                    </div>
                  </div>

                  {/* Why simplified */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Why Simplified Boundaries?</p>
                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Better performance and faster map loading</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Clearer visualization of migration patterns</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Districts grouped by regional proximity</span>
                      </div>
                    </div>
                  </div>

                  {/* How to use */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm font-medium text-slate-800 mb-2">How to View All Districts</p>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>Click on any district</strong> to see a popup showing all districts covered in that region, along with their individual migration intensities and categories.
                    </p>
                  </div>

                  {/* Example */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Example</p>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-xs text-slate-600 mb-2">
                        Clicking <strong className="text-slate-800">Hyderabad</strong> shows these districts:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-uidai-navy"></div>
                          <span className="text-slate-700">Hyderabad</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                          <span className="text-slate-600">Medchal-Malkajgiri</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                          <span className="text-slate-600">Sangareddy</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                          <span className="text-slate-600">Vikarabad</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
