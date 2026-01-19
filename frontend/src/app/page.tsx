'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  Title,
  Text,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  Col,
  Flex,
  Badge,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Color,
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
} from 'lucide-react'

import { Sidebar } from '@/components/layout/Sidebar'
import { KPICard, SectionHeader, ChartContainer } from '@/components/ui'
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
          <Text className="text-slate-500">
            Telangana State • {startDate && endDate ? `${formatDate(startDate)} to ${formatDate(endDate)}` : 'Loading...'}
          </Text>
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
            title="Module B: Migration Pattern Analysis"
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
                <Card>
                  <Title>Migration Insights</Title>

                  {/* Category Breakdown */}
                  <div className="mt-4 space-y-3">
                    {['High Migration (Urban Hub)', 'Moderate Migration', 'Stable (Rural)'].map((cat) => {
                      const count = migrationData.filter(d => d.migration_category === cat).length
                      const color: Color = cat.includes('High') ? 'rose' : cat.includes('Moderate') ? 'amber' : 'emerald'
                      return (
                        <Flex key={cat} justifyContent="between" alignItems="center">
                          <Text>{cat}</Text>
                          <Badge color={color} size="lg">{count}</Badge>
                        </Flex>
                      )
                    })}
                  </div>

                  <Title className="mt-6">🔝 Top Migration Hubs</Title>
                  <div className="mt-3 space-y-2">
                    {migrationData
                      .sort((a, b) => b.migration_ratio - a.migration_ratio)
                      .slice(0, 5)
                      .map((d, i) => (
                        <div key={d.district} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                          <div>
                            <Text className="font-medium">{d.district}</Text>
                            <Text className="text-xs text-slate-500">
                              Ratio: {(d.migration_ratio * 100).toFixed(1)}%
                            </Text>
                          </div>
                          <Badge color="rose">#{i + 1}</Badge>
                        </div>
                      ))}
                  </div>
                </Card>
              )}
            </Col>
          </Grid>
        </section>

        {/* Workload Forecasting Section */}
        <section className="mb-6">
          <SectionHeader
            title="Module A: Workload Forecasting"
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

        {/* Additional Insights - Tabs */}
        <section className="mb-6">
          <SectionHeader
            title="Additional Insights"
            icon={PieChart}
            variant="blue"
          />

          <Card>
            <TabGroup>
              <TabList>
                <Tab>📊 Age Distribution</Tab>
                <Tab>📈 Trend Analysis</Tab>
                <Tab>🔍 Anomaly Details</Tab>
              </TabList>
              <TabPanels>
                {/* Age Distribution Panel */}
                <TabPanel>
                  <Grid numItemsLg={3} className="gap-6 mt-6">
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
                        <Title>Top Districts by Enrolments</Title>
                        <DistrictBarChart data={districtEnrolments} maxItems={10} />
                      </Col>
                    )}
                  </Grid>
                </TabPanel>

                {/* Trend Analysis Panel */}
                <TabPanel>
                  <div className="mt-6">
                    {isLoading ? (
                      <ChartSkeleton height={300} />
                    ) : migrationTrends.length > 1 ? (
                      <>
                        <Title>Migration Trends Over Time</Title>
                        <Text className="mb-4">Monthly enrolments vs demographic updates</Text>
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
                  <Grid numItemsLg={3} className="gap-6 mt-6">
                    {/* Health Score Gauge */}
                    <Col>
                      {isLoading ? (
                        <ChartSkeleton height={250} />
                      ) : (
                        <div className="flex flex-col items-center py-4">
                          <HealthGauge score={avgHealthScore} title="Average Health Score" />

                          <Grid numItems={3} className="gap-4 mt-6 w-full">
                            <Card decoration="top" decorationColor="rose">
                              <Text>Critical</Text>
                              <Title className="text-rose-500">{summary?.anomalies.critical_count || 0}</Title>
                            </Card>
                            <Card decoration="top" decorationColor="amber">
                              <Text>Warning</Text>
                              <Title className="text-amber-500">{summary?.anomalies.warning_count || 0}</Title>
                            </Card>
                            <Card decoration="top" decorationColor="blue">
                              <Text>Info</Text>
                              <Title className="text-blue-500">{summary?.anomalies.info_count || 0}</Title>
                            </Card>
                          </Grid>
                        </div>
                      )}
                    </Col>

                    {/* Anomaly Table */}
                    <Col numColSpanLg={2}>
                      {isLoading ? (
                        <ChartSkeleton height={250} />
                      ) : anomalies.length > 0 ? (
                        <>
                          <Title>Detected Anomalies</Title>
                          <Table className="mt-4">
                            <TableHead>
                              <TableRow>
                                <TableHeaderCell>Severity</TableHeaderCell>
                                <TableHeaderCell>Type</TableHeaderCell>
                                <TableHeaderCell>District</TableHeaderCell>
                                <TableHeaderCell>Description</TableHeaderCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {anomalies.slice(0, 10).map((anomaly, i) => (
                                <TableRow key={i}>
                                  <TableCell>
                                    <Badge color={severityColors[anomaly.severity]} size="sm">
                                      {anomaly.severity}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Text>{anomaly.type}</Text>
                                  </TableCell>
                                  <TableCell>
                                    <Text className="font-medium">{anomaly.district}</Text>
                                  </TableCell>
                                  <TableCell>
                                    <Text className="max-w-xs truncate">{anomaly.description}</Text>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </>
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
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-slate-200 mt-8">
          <Text className="font-medium text-slate-600">
            UIDAI Ops-Intel Dashboard • District Operational Intelligence for Telangana
          </Text>
          <Text className="text-sm text-slate-400 mt-1">
            Data Hackathon 2026 • Built with Next.js, Tremor & FastAPI
          </Text>
        </footer>
      </main>
    </div>
  )
}
