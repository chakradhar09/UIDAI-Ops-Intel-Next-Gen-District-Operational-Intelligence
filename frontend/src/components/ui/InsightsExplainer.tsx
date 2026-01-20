'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Calculator, PieChart, TrendingUp, AlertTriangle, HeartPulse } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

type ExplainerTab = 'age' | 'trend' | 'anomaly'

interface AgeDistribution {
  totals: {
    age_0_5: number
    age_5_17: number
    age_18_greater: number
  }
  percentages: {
    age_0_5: number
    age_5_17: number
    age_18_greater: number
  }
  total: number
}

interface MigrationTrend {
  date: string
  enrolments: number
  demo_updates: number
  migration_ratio: number
}

interface Anomaly {
  type: string
  district: string
  severity: string
  description: string
}

interface InsightsExplainerProps {
  isOpen: boolean
  onClose: () => void
  activeTab: ExplainerTab
  ageData?: AgeDistribution | null
  trendData?: MigrationTrend[]
  anomalyData?: Anomaly[]
  healthScore?: number
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatNumber(num: number): string {
  return num.toLocaleString('en-IN')
}

function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`
}

// ============================================================================
// TAB CONTENT COMPONENTS
// ============================================================================

function AgeDistributionExplainer({ data }: { data: AgeDistribution | null }) {
  if (!data) return <p className="text-slate-500">No data available</p>

  const total = data.total
  const age0_5 = data.totals.age_0_5
  const age5_17 = data.totals.age_5_17
  const age18plus = data.totals.age_18_greater

  return (
    <div className="space-y-5">
      {/* Formula */}
      <div className="text-center py-4 px-5 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Formula</p>
        <p className="text-lg font-mono font-semibold text-slate-800">
          Age Group % = (Age Group Count ÷ Total Enrolments) × 100
        </p>
      </div>

      {/* Data Sources */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
          <p className="text-xs font-medium text-uidai-saffron mb-1">👶 0-5 Years</p>
          <p className="text-xs text-slate-600">Children (Birth to 5 years)</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-uidai-navy mb-1">🧒 5-17 Years</p>
          <p className="text-xs text-slate-600">School-age children & teens</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
          <p className="text-xs font-medium text-uidai-green mb-1">👤 18+ Years</p>
          <p className="text-xs text-slate-600">Adults (18 and above)</p>
        </div>
      </div>

      {/* What it means */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm font-medium text-slate-700 mb-2">What does it indicate?</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          The age distribution helps understand the <strong>demographic profile</strong> of Aadhaar enrolments. 
          A <span className="font-semibold text-uidai-saffron">high 0-5 years</span> percentage indicates active birth registrations.
          <span className="font-semibold text-uidai-green"> High adult enrolments</span> may indicate late adoption or migration patterns.
        </p>
      </div>

      {/* Live Calculation */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Live Calculation from Data</p>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2.5 px-3 font-medium text-slate-600">Age Group</th>
                <th className="text-right py-2.5 px-3 font-medium text-slate-600">Count</th>
                <th className="text-right py-2.5 px-3 font-medium text-slate-600">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100">
                <td className="py-2.5 px-3 font-medium text-slate-800">0-5 Years</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatNumber(age0_5)}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="font-semibold text-uidai-saffron">{formatPercent(data.percentages.age_0_5)}</span>
                </td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className="py-2.5 px-3 font-medium text-slate-800">5-17 Years</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatNumber(age5_17)}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="font-semibold text-uidai-navy">{formatPercent(data.percentages.age_5_17)}</span>
                </td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className="py-2.5 px-3 font-medium text-slate-800">18+ Years</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatNumber(age18plus)}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="font-semibold text-uidai-green">{formatPercent(data.percentages.age_18_greater)}</span>
                </td>
              </tr>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Total</td>
                <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">{formatNumber(total)}</td>
                <td className="py-2.5 px-3 text-right font-semibold text-slate-800">100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Step-by-step */}
        <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-uidai-navy uppercase tracking-wide mb-2">Example: 0-5 Years Calculation</p>
          <div className="space-y-1.5 text-sm">
            <p className="text-slate-600">
              <span className="text-slate-400 mr-2">1.</span>
              Age 0-5 Count = <span className="font-mono font-semibold text-uidai-saffron">{formatNumber(age0_5)}</span>
            </p>
            <p className="text-slate-600">
              <span className="text-slate-400 mr-2">2.</span>
              Total Enrolments = <span className="font-mono font-semibold text-uidai-navy">{formatNumber(total)}</span>
            </p>
            <p className="text-slate-600">
              <span className="text-slate-400 mr-2">3.</span>
              Percentage = <span className="font-mono">{formatNumber(age0_5)} ÷ {formatNumber(total)} × 100</span> = <span className="font-semibold text-uidai-navy">{formatPercent(data.percentages.age_0_5)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TrendAnalysisExplainer({ data }: { data: MigrationTrend[] }) {
  const sampleData = data.slice(0, 3)
  const latestMonth = data[data.length - 1]

  return (
    <div className="space-y-5">
      {/* Formula */}
      <div className="text-center py-4 px-5 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Monthly Trend Formula</p>
        <p className="text-lg font-mono font-semibold text-slate-800">
          Monthly Ratio = Demo Updates ÷ Enrolments (per month)
        </p>
      </div>

      {/* Data Sources */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
          <p className="text-xs font-medium text-uidai-saffron mb-1">📊 Enrolments</p>
          <p className="text-xs text-slate-600">New Aadhaar registrations aggregated monthly</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-uidai-navy mb-1">🔄 Demo Updates</p>
          <p className="text-xs text-slate-600">Address change requests aggregated monthly</p>
        </div>
      </div>

      {/* What it means */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm font-medium text-slate-700 mb-2">What does trend analysis show?</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          The trend chart visualizes <strong>migration patterns over time</strong> by comparing new enrolments with demographic updates.
        </p>
        <ul className="mt-2 text-sm text-slate-600 space-y-1">
          <li>• <span className="font-semibold text-uidai-saffron">Rising enrolments</span> → Growing population or active campaigns</li>
          <li>• <span className="font-semibold text-uidai-navy">Rising demo updates</span> → Increased migration activity</li>
          <li>• <span className="font-semibold text-uidai-green">Stable ratio</span> → Consistent migration patterns</li>
        </ul>
      </div>

      {/* Aggregation Method */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
        <p className="text-sm font-medium text-amber-700 mb-2">📅 How data is aggregated</p>
        <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
          <li>Raw enrolment data grouped by month</li>
          <li>Demographic updates summed per month</li>
          <li>Migration ratio calculated for each month</li>
          <li>Time series plotted for visual trend analysis</li>
        </ol>
      </div>

      {/* Sample Data */}
      {sampleData.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Sample Monthly Data</p>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-2.5 px-3 font-medium text-slate-600">Month</th>
                  <th className="text-right py-2.5 px-3 font-medium text-slate-600">Enrolments</th>
                  <th className="text-right py-2.5 px-3 font-medium text-slate-600">Updates</th>
                  <th className="text-right py-2.5 px-3 font-medium text-slate-600">Ratio</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, idx) => (
                  <tr key={idx} className="border-t border-slate-100">
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {new Date(row.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-uidai-saffron">{formatNumber(row.enrolments)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-uidai-navy">{formatNumber(row.demo_updates)}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-uidai-green">{formatPercent(row.migration_ratio * 100)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation example */}
          {latestMonth && (
            <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-medium text-uidai-navy uppercase tracking-wide mb-2">
                Latest Month: {new Date(latestMonth.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
              <div className="space-y-1.5 text-sm">
                <p className="text-slate-600">
                  <span className="text-slate-400 mr-2">1.</span>
                  Demo Updates = <span className="font-mono font-semibold text-uidai-saffron">{formatNumber(latestMonth.demo_updates)}</span>
                </p>
                <p className="text-slate-600">
                  <span className="text-slate-400 mr-2">2.</span>
                  Enrolments = <span className="font-mono font-semibold text-uidai-navy">{formatNumber(latestMonth.enrolments)}</span>
                </p>
                <p className="text-slate-600">
                  <span className="text-slate-400 mr-2">3.</span>
                  Ratio = <span className="font-mono">{formatNumber(latestMonth.demo_updates)} ÷ {formatNumber(latestMonth.enrolments)}</span> = <span className="font-semibold text-uidai-green">{formatPercent(latestMonth.migration_ratio * 100)}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AnomalyExplainer({ anomalies, healthScore }: { anomalies: Anomaly[], healthScore: number }) {
  const criticalCount = anomalies.filter(a => a.severity === 'Critical').length
  const warningCount = anomalies.filter(a => a.severity === 'Warning').length
  const infoCount = anomalies.filter(a => a.severity === 'Info').length

  return (
    <div className="space-y-5">
      {/* Health Score Formula */}
      <div className="text-center py-4 px-5 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Health Score Formula</p>
        <p className="text-lg font-mono font-semibold text-slate-800">
          Score = 100 - (Critical × 30 + Warning × 15 + Info × 5)
        </p>
      </div>

      {/* Detection Methods */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm font-medium text-slate-700 mb-3">🔍 Anomaly Detection Methods</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-rose-600">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Volume Anomalies</p>
              <p className="text-xs text-slate-500">Districts with enrolments &gt;2 standard deviations from mean</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-amber-600">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Age Distribution Anomalies</p>
              <p className="text-xs text-slate-500">Age groups deviating &gt;15% from expected distribution</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-600">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Gender Ratio Anomalies</p>
              <p className="text-xs text-slate-500">Female ratio outside 47%-53% expected range</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-purple-600">4</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Temporal Anomalies</p>
              <p className="text-xs text-slate-500">Sudden drops in daily enrolments (rolling 7-day average)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Severity Levels */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Severity Classification</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-rose-50 border border-rose-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-rose-500 rounded-full"></span>
              <div>
                <span className="text-sm font-medium text-slate-800">Critical</span>
                <p className="text-xs text-slate-500">Requires immediate attention (e.g., gender exclusion)</p>
              </div>
            </div>
            <span className="text-sm font-bold text-rose-600">-30 pts</span>
          </div>
          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-amber-50 border border-amber-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
              <div>
                <span className="text-sm font-medium text-slate-800">Warning</span>
                <p className="text-xs text-slate-500">Needs review (e.g., volume spikes, unusual patterns)</p>
              </div>
            </div>
            <span className="text-sm font-bold text-amber-600">-15 pts</span>
          </div>
          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <div>
                <span className="text-sm font-medium text-slate-800">Info</span>
                <p className="text-xs text-slate-500">Minor deviations for monitoring</p>
              </div>
            </div>
            <span className="text-sm font-bold text-blue-600">-5 pts</span>
          </div>
        </div>
      </div>

      {/* Live Health Score Calculation */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Current Health Score Breakdown</p>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2.5 px-3 font-medium text-slate-600">Component</th>
                <th className="text-right py-2.5 px-3 font-medium text-slate-600">Count</th>
                <th className="text-right py-2.5 px-3 font-medium text-slate-600">Penalty</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100">
                <td className="py-2.5 px-3 text-slate-800">Critical Anomalies</td>
                <td className="py-2.5 px-3 text-right font-mono text-rose-600">{criticalCount}</td>
                <td className="py-2.5 px-3 text-right font-mono text-rose-600">-{criticalCount * 30}</td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className="py-2.5 px-3 text-slate-800">Warning Anomalies</td>
                <td className="py-2.5 px-3 text-right font-mono text-amber-600">{warningCount}</td>
                <td className="py-2.5 px-3 text-right font-mono text-amber-600">-{warningCount * 15}</td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className="py-2.5 px-3 text-slate-800">Info Anomalies</td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-600">{infoCount}</td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-600">-{infoCount * 5}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Calculation */}
        <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-uidai-navy uppercase tracking-wide mb-2">Health Score Calculation</p>
          <div className="space-y-1.5 text-sm">
            <p className="text-slate-600">
              <span className="text-slate-400 mr-2">1.</span>
              Base Score = <span className="font-mono font-semibold text-uidai-navy">100</span>
            </p>
            <p className="text-slate-600">
              <span className="text-slate-400 mr-2">2.</span>
              Total Penalty = <span className="font-mono">({criticalCount} × 30) + ({warningCount} × 15) + ({infoCount} × 5)</span> = <span className="font-semibold text-rose-600">{criticalCount * 30 + warningCount * 15 + infoCount * 5}</span>
            </p>
            <p className="text-slate-600">
              <span className="text-slate-400 mr-2">3.</span>
              Final Score = <span className="font-mono">100 - {criticalCount * 30 + warningCount * 15 + infoCount * 5}</span> = <span className={`font-semibold ${healthScore >= 80 ? 'text-uidai-green' : healthScore >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{healthScore.toFixed(1)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Status Thresholds */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm font-medium text-slate-700 mb-2">Status Thresholds</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
            <p className="text-lg font-bold text-green-600">≥80</p>
            <p className="text-xs text-slate-500">Good</p>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-lg font-bold text-amber-600">50-79</p>
            <p className="text-xs text-slate-500">Warning</p>
          </div>
          <div className="text-center p-2 bg-rose-50 rounded-lg border border-rose-100">
            <p className="text-lg font-bold text-rose-600">&lt;50</p>
            <p className="text-xs text-slate-500">Critical</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TAB_CONFIG = {
  age: {
    title: 'How is Age Distribution Calculated?',
    icon: PieChart,
    color: 'bg-orange-50',
    iconColor: 'text-uidai-saffron',
  },
  trend: {
    title: 'How is Trend Analysis Calculated?',
    icon: TrendingUp,
    color: 'bg-blue-50',
    iconColor: 'text-uidai-navy',
  },
  anomaly: {
    title: 'How are Anomalies & Health Score Calculated?',
    icon: HeartPulse,
    color: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
}

export function InsightsExplainer({
  isOpen,
  onClose,
  activeTab,
  ageData,
  trendData = [],
  anomalyData = [],
  healthScore = 0,
}: InsightsExplainerProps) {
  const config = TAB_CONFIG[activeTab]
  const Icon = config.icon

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
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${config.iconColor}`} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">{config.title}</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  {activeTab === 'age' && <AgeDistributionExplainer data={ageData ?? null} />}
                  {activeTab === 'trend' && <TrendAnalysisExplainer data={trendData} />}
                  {activeTab === 'anomaly' && <AnomalyExplainer anomalies={anomalyData} healthScore={healthScore} />}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default InsightsExplainer
