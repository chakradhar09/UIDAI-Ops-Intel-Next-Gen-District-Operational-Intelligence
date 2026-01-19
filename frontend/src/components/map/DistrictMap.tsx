'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { cn, formatPercent, getMigrationColor } from '@/lib/utils'
import type { DistrictMigration } from '@/lib/api'

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

interface DistrictMapProps {
  geojson: GeoJSON.FeatureCollection | null
  migrationData: DistrictMigration[]
  className?: string
}

export function DistrictMap({ geojson, migrationData, className }: DistrictMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Create a lookup map for migration data
  const migrationLookup = new Map(
    migrationData.map(d => [d.district.toLowerCase(), d])
  )

  const getDistrictData = (districtName: string) => {
    const normalized = districtName.toLowerCase()
    return migrationLookup.get(normalized)
  }

  const getColor = (intensity: number) => {
    // Color scale from green (low) to yellow (medium) to red (high)
    if (intensity >= 70) return '#B72025' // UIDAI Red
    if (intensity >= 50) return '#E98711'
    if (intensity >= 30) return '#FDB913' // UIDAI Yellow
    if (intensity >= 10) return '#84CC16'
    return '#10B981' // Green
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

    const popupContent = `
      <div style="font-family: system-ui, sans-serif; min-width: 180px;">
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
      <div className={cn('bg-slate-100 rounded-xl animate-pulse', className)} style={{ height: 400 }}>
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
        style={{ height: 400, width: '100%', borderRadius: '1rem' }}
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
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 z-[1000]">
        <p className="text-xs font-semibold text-slate-700 mb-2">Migration Intensity</p>
        <div className="space-y-1">
          {[
            { color: '#B72025', label: 'High (>70%)' },
            { color: '#FDB913', label: 'Moderate (30-70%)' },
            { color: '#10B981', label: 'Low (<30%)' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-4 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DistrictMap
