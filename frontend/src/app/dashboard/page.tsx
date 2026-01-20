'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  Col,
  type Color,
} from '@tremor/react'
import {
  Users,
  RefreshCw,
  TrendingUp,
  Map,
  AlertCircle,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Info,
} from 'lucide-react'

import { Sidebar } from '@/components/layout/Sidebar'
import { KPICard, SectionHeader, ChartContainer, RatioExplainer, InsightsExplainer } from '@/components/ui'
import { KPICardSkeleton, ChartSkeleton, MapSkeleton } from '@/components/ui/LoadingSkeleton'
import {
  ForecastChart,
  ProjectionChart,
  DistrictBarChart,
  AgeDistributionChart,
  HealthGauge,
  MigrationTrendChart,
} from '@/components/charts'
import { DistrictMap } from '@/components/map/DistrictMap'

import api, {
  DashboardSummary,
  ForecastPoint,
  WorkloadProjection,
  DistrictMigration,
  Anomaly,
  DistrictEnrolment,
  AgeDistribution,
  DistrictHealth,
  MigrationTrend,
} from '@/lib/api'
import { formatDate } from '@/lib/utils'

const severityColors: Record<string, Color> = {
  Critical: 'rose',
  Warning: 'amber',
  Info: 'blue',
}

export default function Dashboard() {
  // State
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([])
  const [projections, setProjections] = useState<WorkloadProjection[]>([])
  const [migrationData, setMigrationData] = useState<DistrictMigration[]>([])
  const [migrationTrends, setMigrationTrends] = useState<MigrationTrend[]>([])
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | null>(null)
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [showRatioExplainer, setShowRatioExplainer] = useState(false)
  const [showInsightsExplainer, setShowInsightsExplainer] = useState(false)
  const [insightsExplainerTab, setInsightsExplainerTab] = useState<'age' | 'trend' | 'anomaly'>('age')
  const [districtEnrolments, setDistrictEnrolments] = useState<DistrictEnrolment[]>([])
  const [ageDistribution, setAgeDistribution] = useState<AgeDistribution | null>(null)
  const [healthScores, setHealthScores] = useState<DistrictHealth[]>([])

  // Filters
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Fetch all data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const filters = {
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        districts: selectedDistricts.length > 0 ? selectedDistricts : undefined,
      }

      const [
        summaryData,
        forecast,
        projectionsData,
        migration,
        trends,
        geo,
        anomalyData,
        enrolments,
        ageDist,
        health,
      ] = await Promise.all([
        api.getDashboardSummary(filters),
        api.getWorkloadForecast(3, filters),
        api.getWorkloadProjections(15, filters),
        api.getMigrationChoropleth(filters),
        api.getMigrationTrends(filters),
        api.getGeoJSON(),
        api.getAnomalies(undefined, filters),
        api.getEnrolmentsByDistrict(filters),
        api.getAgeDistribution(filters),
        api.getDistrictHealth(filters),
      ])

      setSummary(summaryData)
      setForecastData(forecast)
      setProjections(projectionsData)
      setMigrationData(migration)
      setMigrationTrends(trends)
      setGeojson(geo)
      setAnomalies(anomalyData)
      setDistrictEnrolments(enrolments)
      setAgeDistribution(ageDist)
      setHealthScores(health)

      // Debug logging
      console.log('📊 Migration Data Districts:', migration.length, migration.map(d => d.district))
      console.log('🗺️ GeoJSON Features:', geo?.features.length)

      // Set initial date range from data
      if (!startDate && summaryData.dateRange) {
        setStartDate(summaryData.dateRange.min)
        setEndDate(summaryData.dateRange.max)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [startDate, endDate, selectedDistricts])

  useEffect(() => {
    fetchData()
  }, []) // Only on mount

  const handleRefresh = () => {
    fetchData()
  }

  const criticalAnomalies = anomalies.filter(a => a.severity === 'Critical')
  const warningAnomalies = anomalies.filter(a => a.severity === 'Warning')
  const avgHealthScore = healthScores.length > 0
    ? healthScores.reduce((acc, h) => acc + h.health_score, 0) / healthScores.length
    : 0

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        districts={summary?.districts || []}
        selectedDistricts={selectedDistricts}
        onDistrictsChange={setSelectedDistricts}
        dateRange={summary?.dateRange || { min: '', max: '' }}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onRefresh={handleRefresh}
        criticalAnomalies={criticalAnomalies}
        warningAnomalies={warningAnomalies}
        isLoading={isLoading}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:pl-8 overflow-x-hidden md:ml-80">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            🏛️ UIDAI District Operational Intelligence
          </h1>
          <p className="text-slate-500">
            Telangana State • {startDate && endDate ? `${formatDate(startDate)} to ${formatDate(endDate)}` : 'Loading...'}
          </p>
        </motion.header>

        {/* KPI Cards */}
        <section className="mb-6">
          <SectionHeader
            title="Key Performance Indicators"
            icon={BarChart3}
            variant="red"
          />

          <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
            {isLoading ? (
              <>
                <KPICardSkeleton />
                <KPICardSkeleton />
                <KPICardSkeleton />
                <KPICardSkeleton />
              </>
            ) : (
              <>
                <KPICard
                  title="Total Enrolments"
                  value={summary?.kpis.totalEnrolments || 0}
                  subtitle="Active registrations"
                  icon={Users}
                  trend="up"
                  trendValue="+12%"
                  delay={0.1}
                />
                <KPICard
                  title="Predicted Updates"
                  value={summary?.kpis.predictedUpdates || 0}
                  subtitle="Next 12 months"
                  icon={RefreshCw}
                  variant="warning"
                  delay={0.2}
                />
                <KPICard
                  title="High Migration Districts"
                  value={summary?.kpis.highMigrationDistricts || 0}
                  subtitle="Urban hubs identified"
                  icon={TrendingUp}
                  variant="success"
                  delay={0.3}
                />
                <KPICard
                  title="Critical Alerts"
                  value={summary?.kpis.criticalAnomalies || 0}
                  subtitle={summary?.kpis.criticalAnomalies ? 'Needs attention' : 'All clear'}
                  icon={AlertCircle}
                  variant={summary?.kpis.criticalAnomalies ? 'danger' : 'success'}
                  delay={0.4}
                />
              </>
            )}
          </Grid>
        </section>

        {/* Migration Map Section */}
        <section className="mb-6">
          <SectionHeader
            title="Module A: Migration Pattern Analysis"
            subtitle="District-wise migration intensity based on demographic update ratios"
            icon={Map}
            variant="yellow"
          />

          <Grid numItemsLg={3} className="gap-6">
            <Col numColSpanLg={2}>
              {isLoading ? (
                <MapSkeleton />
              ) : (
                <ChartContainer title="Migration Intensity by District" delay={0.2} gradient>
                  <DistrictMap
                    geojson={geojson}
                    migrationData={migrationData}
                  />
                </ChartContainer>
              )}
            </Col>

            <Col>
              {isLoading ? (
                <ChartSkeleton height={400} />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-800">Migration Insights</h3>
                    <button
                      onClick={() => setShowRatioExplainer(true)}
                      className="p-2 hover:bg-uidai-saffron/10 rounded-lg transition-colors group"
                      aria-label="How is migration ratio calculated?"
                      title="How is this ratio calculated?"
                    >
                      <Info className="h-4 w-4 text-uidai-saffron group-hover:text-uidai-saffron-dark" />
                    </button>
                  </div>

                  <div className="p-6">
                    {/* Category Breakdown */}
                    <div className="space-y-3 mb-6">
                      {[
                        { label: 'High Migration (Urban Hub)', color: 'bg-uidai-saffron', textColor: 'text-uidai-saffron', bgColor: 'bg-orange-50' },
                        { label: 'Moderate Migration', color: 'bg-uidai-navy', textColor: 'text-uidai-navy', bgColor: 'bg-blue-50' },
                        { label: 'Stable (Rural)', color: 'bg-uidai-green', textColor: 'text-uidai-green', bgColor: 'bg-green-50' },
                      ].map((cat) => {
                        const count = migrationData.filter(d => d.migration_category === cat.label).length
                        return (
                          <div key={cat.label} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                              <span className="text-sm text-slate-600">{cat.label}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${cat.bgColor} ${cat.textColor}`}>
                              {count}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100 pt-5">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-uidai-saffron" />
                        <h4 className="text-sm font-semibold text-slate-800">Top Migration Hubs</h4>
                      </div>
                      
                      <div className="space-y-3">
                        {migrationData
                          .sort((a, b) => b.migration_ratio - a.migration_ratio)
                          .slice(0, 5)
                          .map((d, i) => (
                            <div key={d.district} className="flex items-center justify-between group">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">{d.district}</p>
                                <p className="text-xs text-slate-500">
                                  Ratio: {(d.migration_ratio * 100).toFixed(1)}%
                                </p>
                              </div>
                              <div className={`
                                flex items-center justify-center w-9 h-9 rounded-lg text-xs font-bold
                                ${i === 0 ? 'bg-gradient-to-br from-uidai-saffron to-uidai-saffron-dark text-white shadow-md' :
                                  i === 1 ? 'bg-gradient-to-br from-uidai-navy to-uidai-navy-dark text-white shadow-md' :
                                  i === 2 ? 'bg-gradient-to-br from-uidai-green to-uidai-green-dark text-white shadow-md' :
                                  'bg-slate-100 text-slate-600'}
                              `}>
                                #{i + 1}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Grid>
        </section>

        {/* Workload Forecasting Section */}
        <section className="mb-6">
          <SectionHeader
            title="Module B: Workload Forecasting"
            subtitle="Predict mandatory biometric updates based on age demographics"
            icon={LineChart}
            variant="red"
          />

          <Grid numItemsLg={2} className="gap-6">
            {isLoading ? (
              <>
                <ChartSkeleton height={350} />
                <ChartSkeleton height={350} />
              </>
            ) : (
              <>
                <ChartContainer
                  title="Enrolment Trend & 3-Month Forecast"
                  subtitle="Historical data with exponential smoothing projection"
                  delay={0.2}
                  gradient
                >
                  <ForecastChart data={forecastData} />
                </ChartContainer>

                <ChartContainer
                  title="Projected Mandatory Updates"
                  subtitle="By district (Next 12 months)"
                  delay={0.3}
                  gradient
                >
                  <ProjectionChart data={projections} />
                </ChartContainer>
              </>
            )}
          </Grid>
        </section>

        {/* Module 3: Anomaly Detection - Tabs */}
        <section className="mb-6">
          <SectionHeader
            title="Module 3: Anomaly Detection"
            icon={PieChart}
            variant="blue"
          />

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <TabGroup>
              {/* Custom Tab List */}
              <div className="border-b border-slate-200 px-6 pt-4">
                <TabList className="flex gap-1 -mb-px">
                  <Tab className="group relative px-5 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 focus:outline-none ui-selected:text-uidai-navy">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>Age Distribution</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent ui-selected:bg-uidai-navy rounded-t-full transition-colors" />
                  </Tab>
                  <Tab className="group relative px-5 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 focus:outline-none ui-selected:text-uidai-navy">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Trend Analysis</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent ui-selected:bg-uidai-navy rounded-t-full transition-colors" />
                  </Tab>
                  <Tab className="group relative px-5 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 focus:outline-none ui-selected:text-uidai-navy">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Anomaly Details</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent ui-selected:bg-uidai-navy rounded-t-full transition-colors" />
                  </Tab>
                </TabList>
              </div>

              <TabPanels className="p-6">
                {/* Age Distribution Panel */}
                <TabPanel>
                  <div className="flex items-center justify-between mb-4">
                    <div />
                    <button
                      onClick={() => {
                        setInsightsExplainerTab('age')
                        setShowInsightsExplainer(true)
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-uidai-navy hover:text-uidai-saffron transition-colors bg-slate-50 hover:bg-orange-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-orange-200"
                    >
                      <Info className="w-3.5 h-3.5" />
                      How is this calculated?
                    </button>
                  </div>
                  <Grid numItemsLg={3} className="gap-6">
                    {isLoading ? (
                      <ChartSkeleton height={300} />
                    ) : ageDistribution && (
                      <Col>
                        <AgeDistributionChart data={ageDistribution} />
                      </Col>
                    )}

                    {isLoading ? (
                      <ChartSkeleton height={300} />
                    ) : (
                      <Col numColSpanLg={2}>
                        <h4 className="text-sm font-semibold text-slate-800 mb-4">Top Districts by Enrolments</h4>
                        <DistrictBarChart data={districtEnrolments} maxItems={10} />
                      </Col>
                    )}
                  </Grid>
                </TabPanel>

                {/* Trend Analysis Panel */}
                <TabPanel>
                  <div className="flex items-center justify-between mb-4">
                    <div />
                    <button
                      onClick={() => {
                        setInsightsExplainerTab('trend')
                        setShowInsightsExplainer(true)
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-uidai-navy hover:text-uidai-saffron transition-colors bg-slate-50 hover:bg-orange-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-orange-200"
                    >
                      <Info className="w-3.5 h-3.5" />
                      How is this calculated?
                    </button>
                  </div>
                  <div>
                    {isLoading ? (
                      <ChartSkeleton height={300} />
                    ) : migrationTrends.length > 1 ? (
                      <>
                        <h4 className="text-sm font-semibold text-slate-800">Migration Trends Over Time</h4>
                        <p className="text-sm text-slate-500 mb-4">Monthly enrolments vs demographic updates</p>
                        <MigrationTrendChart data={migrationTrends} />
                      </>
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        <Activity className="w-12 h-12 mx-auto mb-3" />
                        <p>Insufficient data for trend analysis. Select a wider date range.</p>
                      </div>
                    )}
                  </div>
                </TabPanel>

                {/* Anomaly Details Panel */}
                <TabPanel>
                  <div className="flex items-center justify-between mb-4">
                    <div />
                    <button
                      onClick={() => {
                        setInsightsExplainerTab('anomaly')
                        setShowInsightsExplainer(true)
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-uidai-navy hover:text-uidai-saffron transition-colors bg-slate-50 hover:bg-orange-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-orange-200"
                    >
                      <Info className="w-3.5 h-3.5" />
                      How is this calculated?
                    </button>
                  </div>
                  <Grid numItemsLg={3} className="gap-6">
                    {/* Health Score Section */}
                    <Col>
                      {isLoading ? (
                        <ChartSkeleton height={250} />
                      ) : (
                        <div className="flex flex-col items-center py-4">
                          <HealthGauge score={avgHealthScore} title="Average Health Score" />

                          {/* Stats Cards */}
                          <div className="grid grid-cols-3 gap-3 mt-6 w-full">
                            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-center">
                              <p className="text-xs text-rose-600 font-medium">Critical</p>
                              <p className="text-xl font-bold text-rose-700">{summary?.anomalies.critical_count || 0}</p>
                            </div>
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                              <p className="text-xs text-amber-600 font-medium">Warning</p>
                              <p className="text-xl font-bold text-amber-700">{summary?.anomalies.warning_count || 0}</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                              <p className="text-xs text-blue-600 font-medium">Info</p>
                              <p className="text-xl font-bold text-blue-700">{summary?.anomalies.info_count || 0}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Col>

                    {/* Anomaly Table */}
                    <Col numColSpanLg={2}>
                      {isLoading ? (
                        <ChartSkeleton height={250} />
                      ) : anomalies.length > 0 ? (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-slate-800">Detected Anomalies</h4>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                              {anomalies.length} total
                            </span>
                          </div>
                          <div className="border border-slate-200 rounded-xl overflow-hidden">
                            {/* Sticky header */}
                            <div className="bg-slate-50">
                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide w-24">Severity</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide w-32">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide w-36">District</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Description</th>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                            {/* Scrollable body */}
                            <div className="max-h-[320px] overflow-y-auto">
                              <table className="w-full">
                                <tbody className="divide-y divide-slate-100">
                                  {anomalies.map((anomaly, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-4 py-3 w-24">
                                        <span className={`
                                          inline-flex px-2.5 py-1 rounded-md text-xs font-semibold
                                          ${anomaly.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                            anomaly.severity === 'Warning' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'}
                                        `}>
                                          {anomaly.severity}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-sm text-slate-600 w-32">{anomaly.type}</td>
                                      <td className="px-4 py-3 text-sm font-medium text-slate-800 w-36">{anomaly.district}</td>
                                      <td className="px-4 py-3 text-sm text-slate-500">{anomaly.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                          <Activity className="w-12 h-12 mb-3" />
                          <p>No anomalies detected</p>
                        </div>
                      )}
                    </Col>
                  </Grid>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-slate-200 mt-8">
          <p className="font-medium text-slate-600">
            UIDAI Ops-Intel Dashboard • District Operational Intelligence for Telangana
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Data Hackathon 2026 • Built with Next.js, Tremor & FastAPI
          </p>
        </footer>
      </main>

      {/* Ratio Explainer Modal */}
      <RatioExplainer
        isOpen={showRatioExplainer}
        onClose={() => setShowRatioExplainer(false)}
        migrationData={migrationData}
      />

      {/* Insights Explainer Modal */}
      <InsightsExplainer
        isOpen={showInsightsExplainer}
        onClose={() => setShowInsightsExplainer(false)}
        activeTab={insightsExplainerTab}
        ageData={ageDistribution}
        trendData={migrationTrends}
        anomalyData={anomalies}
        healthScore={avgHealthScore}
      />
    </div>
  )
}
