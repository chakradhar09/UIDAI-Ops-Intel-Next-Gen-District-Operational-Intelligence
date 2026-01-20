'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { cn, formatPercent, getMigrationColor } from '@/lib/utils'
import type { DistrictMigration } from '@/lib/api'
import { MapExplanation } from '@/components/ui'

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
)

interface DistrictMapProps {
  geojson: GeoJSON.FeatureCollection | null
  migrationData: DistrictMigration[]
  className?: string
}

export function DistrictMap({ geojson, migrationData, className }: DistrictMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [L, setL] = useState<any>(null)
  const [showMapExplanation, setShowMapExplanation] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Import Leaflet for custom icons
    if (typeof window !== 'undefined') {
      import('leaflet').then((leaflet) => {
        setL(leaflet)
      })
    }
  }, [])

  // Create a lookup map for migration data
  const migrationLookup = new Map(
    migrationData.map(d => [d.district.toLowerCase(), d])
  )

  const getDistrictData = (districtName: string) => {
    const normalized = districtName.toLowerCase()
    return migrationLookup.get(normalized)
  }

  // Get list of districts that have GeoJSON features (visible on map)
  const visibleDistricts = new Set(
    geojson?.features.map((f: any) => 
      (f.properties?.district || f.properties?.D_N || '').toLowerCase()
    ) || []
  )

  // Group all districts by visible polygon - districts not in GeoJSON are grouped with their nearest visible district
  const getGroupedDistricts = (visibleDistrictName: string) => {
    // For simplicity, group by first letter or region - in production, use proper mapping
    const grouped = migrationData.filter(d => {
      const dName = d.district.toLowerCase()
      // If district has its own polygon, don't include it in groups
      if (visibleDistricts.has(dName)) return false
      
      // Simple grouping logic based on name similarity or alphabetical proximity
      // This is a simplified approach - ideally use actual district hierarchy/region data
      const visibleLower = visibleDistrictName.toLowerCase()
      
      // Group districts that start with similar letters or are known to be in same region
      if (visibleLower === 'hyderabad') {
        return ['medchal-malkajgiri', 'sangareddy', 'vikarabad', 'yadadri bhuvanagiri'].includes(dName)
      }
      if (visibleLower === 'rangareddy') {
        return ['nagarkurnool', 'wanaparthy', 'jogulamba gadwal', 'narayanpet'].includes(dName)
      }
      if (visibleLower === 'karimnagar') {
        return ['jagtial', 'peddapalli', 'rajanna sircilla'].includes(dName)
      }
      if (visibleLower === 'warangal') {
        return ['hanumakonda', 'jangaon', 'mahabubabad', 'jayashankar bhupalpally', 'mulugu'].includes(dName)
      }
      if (visibleLower === 'khammam') {
        return ['bhadradri kothagudem', 'suryapet'].includes(dName)
      }
      if (visibleLower === 'nizamabad') {
        return ['kamareddy', 'nirmal'].includes(dName)
      }
      if (visibleLower === 'adilabad') {
        return ['komaram bheem', 'mancherial'].includes(dName)
      }
      if (visibleLower === 'medak') {
        return ['siddipet'].includes(dName)
      }
      
      return false
    })
    return grouped
  }

  // Calculate centroid of a polygon for label placement
  const getPolygonCentroid = (coordinates: number[][][]) => {
    const coords = coordinates[0]
    let latSum = 0
    let lngSum = 0
    const count = coords.length - 1 // Exclude last point (same as first)

    for (let i = 0; i < count; i++) {
      lngSum += coords[i][0]
      latSum += coords[i][1]
    }

    return [latSum / count, lngSum / count]
  }

  // Generate district labels from GeoJSON
  const districtLabels = geojson?.features.map((feature: any) => {
    const districtName = feature.properties?.district || feature.properties?.D_N || 'Unknown'
    const coordinates = feature.geometry.coordinates
    const centroid = getPolygonCentroid(coordinates)
    const data = getDistrictData(districtName)

    return {
      name: districtName,
      position: centroid as [number, number],
      intensity: data?.migration_intensity || 0,
      category: data?.migration_category || 'No Data',
    }
  }) || []

  const getColor = (intensity: number) => {
    // UIDAI Official Branding Color Scale
    if (intensity >= 70) return '#F7941D' // UIDAI Orange - High
    if (intensity >= 30) return '#2E3192' // UIDAI Blue - Moderate
    return '#10B981' // Green - Low
  }

  const style = (feature: any) => {
    const districtName = feature.properties?.district || feature.properties?.D_N || ''
    const data = getDistrictData(districtName)
    const intensity = data?.migration_intensity || 0

    return {
      fillColor: getColor(intensity),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.7,
    }
  }

  const onEachFeature = (feature: any, layer: any) => {
    const districtName = feature.properties?.district || feature.properties?.D_N || 'Unknown'
    const data = getDistrictData(districtName)

    // Get districts grouped/covered by this visible polygon
    const groupedDistricts = getGroupedDistricts(districtName)

    const groupedHtml = groupedDistricts.length > 0 ? `
      <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #E2E8F0;">
        <p style="font-size: 11px; font-weight: 600; color: #64748B; margin-bottom: 6px;">
          📍 Districts Covered in This Region (${groupedDistricts.length}):
        </p>
        <div style="max-height: 120px; overflow-y: auto;">
          ${groupedDistricts.map(d => `
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px; padding: 2px 0;">
              <span style="color: #475569;">${d.district}</span>
              <span style="font-weight: 600; color: ${getColor(d.migration_intensity)};">
                ${d.migration_intensity.toFixed(1)}%
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''

    const popupContent = `
      <div style="font-family: system-ui, sans-serif; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1E293B;">
          ${districtName}
        </h3>
        <div style="font-size: 13px; color: #64748B;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Migration Intensity:</span>
            <span style="font-weight: 600; color: ${data ? getColor(data.migration_intensity) : '#94A3B8'}">
              ${data ? data.migration_intensity.toFixed(1) : 'N/A'}%
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Category:</span>
            <span style="font-weight: 500;">${data?.migration_category || 'No Data'}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Migration Ratio:</span>
            <span style="font-weight: 500;">${data ? formatPercent(data.migration_ratio * 100) : 'N/A'}</span>
          </div>
        </div>
        ${groupedHtml}
      </div>
    `

    layer.bindPopup(popupContent)

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target
        layer.setStyle({
          weight: 3,
          color: '#1E293B',
          fillOpacity: 0.9,
        })
        layer.bringToFront()
      },
      mouseout: (e: any) => {
        e.target.setStyle(style(feature))
      },
    })
  }

  if (!isMounted) {
    return (
      <div className={cn('bg-slate-100 rounded-xl animate-pulse', className)} style={{ height: 450 }}>
        <div className="flex items-center justify-center h-full text-slate-400">
          Loading map...
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Import Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      <MapContainer
        center={[17.9, 79.5]} // Telangana center
        zoom={7}
        style={{ height: 450, width: '100%', borderRadius: '1rem' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {geojson && (
          <GeoJSON
            data={geojson}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}

        {/* District Labels - Permanent tooltips showing all district names */}
        {L && districtLabels.map((label, idx) => {
          // Create a divIcon for text labels
          const icon = L.divIcon({
            className: 'district-label',
            html: `<div style="
              font-size: 10px;
              font-weight: 600;
              color: #1E293B;
              text-shadow: 1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white;
              white-space: nowrap;
              pointer-events: none;
              text-align: center;
            ">${label.name}</div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })

          return (
            <Marker 
              key={idx} 
              position={label.position} 
              icon={icon}
              interactive={false}
            />
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 z-[1000]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-700">Migration Intensity</p>
          <button
            onClick={() => setShowMapExplanation(true)}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors group"
            aria-label="Map explanation"
            title="Why only 10 districts visible?"
          >
            <svg className="w-3.5 h-3.5 text-uidai-navy group-hover:text-uidai-saffron" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="space-y-1">
          {[
            { color: '#F7941D', label: 'High', threshold: '(>70%)', key: 'high' },
            { color: '#2E3192', label: 'Moderate', threshold: '(30-70%)', key: 'moderate' },
            { color: '#10B981', label: 'Low', threshold: '(<30%)', key: 'low' },
          ].map(({ color, label, threshold, key }) => {
            // Count from migration data, not labels (which includes all GeoJSON features)
            const count = migrationData.filter(d => {
              if (key === 'high') return d.migration_intensity >= 70
              if (key === 'moderate') return d.migration_intensity >= 30 && d.migration_intensity < 70
              return d.migration_intensity < 30
            }).length

            return (
              <div key={label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-slate-600">{label} {threshold}</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">{count}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-2 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Total Districts</span>
            <span className="text-xs font-bold text-slate-800">{migrationData.length}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-slate-500">Visible on Map</span>
            <span className="text-xs text-slate-600">{geojson?.features.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Map Explanation Modal */}
      <MapExplanation
        isOpen={showMapExplanation}
        onClose={() => setShowMapExplanation(false)}
        totalDistricts={migrationData.length}
        visibleDistricts={geojson?.features.length || 0}
      />
    </div>
  )
}

export default DistrictMap
