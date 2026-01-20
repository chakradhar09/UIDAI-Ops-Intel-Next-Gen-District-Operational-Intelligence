/**
 * API Client for UIDAI Ops-Intel Dashboard
 * Communicates with the FastAPI backend
 */

// In production: NEXT_PUBLIC_API_URL points to deployed backend
// In local dev: Empty string uses Next.js rewrites to proxy to localhost:8000
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// ============================================================================
// TYPES
// ============================================================================

export interface KPIResponse {
  totalEnrolments: number;
  predictedUpdates: number;
  highMigrationDistricts: number;
  criticalAnomalies: number;
  avgHealthScore: number;
}

export interface WorkloadSummary {
  total_projected_updates: number;
  avg_per_district: number;
  max_district: string;
  max_district_load: number;
  age_5_total: number;
  age_15_total: number;
}

export interface MigrationSummary {
  total_districts: number;
  high_migration_count: number;
  moderate_migration_count: number;
  low_migration_count: number;
  avg_migration_ratio: number;
  max_migration_district: string;
  max_migration_ratio: number;
  high_migration_districts: string[];
}

export interface AnomalySummary {
  total_anomalies: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
  by_type: Record<string, number>;
  affected_districts: string[];
}

export interface DashboardSummary {
  kpis: KPIResponse;
  workload: WorkloadSummary;
  migration: MigrationSummary;
  anomalies: AnomalySummary;
  dateRange: { min: string; max: string };
  districts: string[];
}

export interface DistrictMigration {
  district: string;
  total_enrolments: number;
  total_demo_updates: number;
  migration_ratio: number;
  migration_category: string;
  migration_intensity: number;
}

export interface ForecastPoint {
  date: string;
  total_enrolments: number;
  is_forecast: boolean;
}

export interface WorkloadProjection {
  district: string;
  age_0_5: number;
  age_5_17: number;
  total_enrolments: number;
  projected_age_5_updates: number;
  projected_age_15_updates: number;
  total_projected_updates: number;
}

export interface Anomaly {
  type: string;
  district: string;
  severity: 'Critical' | 'Warning' | 'Info';
  description: string;
  recommendation?: string;
}

export interface DistrictHealth {
  district: string;
  health_score: number;
  status: string;
}

export interface MigrationTrend {
  date: string;
  enrolments: number;
  demo_updates: number;
  migration_ratio: number;
}

export interface DistrictEnrolment {
  district: string;
  total_enrolments: number;
  age_0_5: number;
  age_5_17: number;
  age_18_greater: number;
}

export interface AgeDistribution {
  totals: {
    age_0_5: number;
    age_5_17: number;
    age_18_greater: number;
  };
  percentages: {
    age_0_5: number;
    age_5_17: number;
    age_18_greater: number;
  };
  total: number;
}

export interface FilterParams {
  start_date?: string;
  end_date?: string;
  districts?: string[];
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  // Build the full URL
  // If API_BASE is a full URL (production), use it directly
  // If API_BASE is empty (local dev), use relative path with window.location.origin
  let url: URL;
  
  if (API_BASE && API_BASE.startsWith('http')) {
    // Production: API_BASE is a full URL like https://backend.railway.app
    url = new URL(endpoint, API_BASE);
  } else {
    // Local dev: use relative path
    url = new URL(`${API_BASE}${endpoint}`, window.location.origin);
  }
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new APIError(response.status, `API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError(408, 'Request timeout - please try again');
    }
    
    throw error;
  }
}

function buildParams(filters?: FilterParams): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (filters?.start_date) params.start_date = filters.start_date;
  if (filters?.end_date) params.end_date = filters.end_date;
  if (filters?.districts?.length) params.districts = filters.districts.join(',');
  
  return params;
}

// ============================================================================
// EXPORTED API METHODS
// ============================================================================

export const api = {
  /**
   * Get complete dashboard summary
   */
  getDashboardSummary: (filters?: FilterParams) =>
    fetchAPI<DashboardSummary>('/api/v1/summary', buildParams(filters)),

  /**
   * Get migration choropleth data
   */
  getMigrationChoropleth: (filters?: FilterParams) =>
    fetchAPI<DistrictMigration[]>('/api/v1/migration/choropleth', buildParams(filters)),

  /**
   * Get GeoJSON for map
   */
  getGeoJSON: () =>
    fetchAPI<GeoJSON.FeatureCollection>('/api/v1/geojson'),

  /**
   * Get workload forecast data
   */
  getWorkloadForecast: (periods: number = 3, filters?: FilterParams) =>
    fetchAPI<ForecastPoint[]>('/api/v1/workload/forecast', {
      ...buildParams(filters),
      periods: periods.toString(),
    }),

  /**
   * Get workload projections by district
   */
  getWorkloadProjections: (limit: number = 15, filters?: FilterParams) =>
    fetchAPI<WorkloadProjection[]>('/api/v1/workload/projections', {
      ...buildParams(filters),
      limit: limit.toString(),
    }),

  /**
   * Get anomalies
   */
  getAnomalies: (severity?: string, filters?: FilterParams) =>
    fetchAPI<Anomaly[]>('/api/v1/anomalies', {
      ...buildParams(filters),
      ...(severity && { severity }),
    }),

  /**
   * Get district health scores
   */
  getDistrictHealth: (filters?: FilterParams) =>
    fetchAPI<DistrictHealth[]>('/api/v1/districts/health', buildParams(filters)),

  /**
   * Get migration trends over time
   */
  getMigrationTrends: (filters?: FilterParams) =>
    fetchAPI<MigrationTrend[]>('/api/v1/migration/trends', buildParams(filters)),

  /**
   * Get enrolments by district
   */
  getEnrolmentsByDistrict: (filters?: FilterParams) =>
    fetchAPI<DistrictEnrolment[]>('/api/v1/enrolments/by-district', buildParams(filters)),

  /**
   * Get age distribution
   */
  getAgeDistribution: (filters?: FilterParams) =>
    fetchAPI<AgeDistribution>('/api/v1/enrolments/age-distribution', buildParams(filters)),

  /**
   * Health check
   */
  healthCheck: () =>
    fetchAPI<{ status: string; service: string }>('/api/health'),
};

export default api;
