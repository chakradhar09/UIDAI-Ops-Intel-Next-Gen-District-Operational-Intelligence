import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

// Fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-cal-sans',
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'UIDAI Ops-Intel Dashboard | District Operational Intelligence',
  description: 'District Operational Intelligence Dashboard for UIDAI Telangana - Powered by AI-driven Workload Forecasting, Migration Analysis, and Anomaly Detection for smarter government operations.',
  keywords: ['UIDAI', 'Aadhaar', 'Dashboard', 'Analytics', 'Telangana', 'Government', 'AI', 'Machine Learning', 'Data Hackathon'],
  authors: [{ name: 'UIDAI Data Hackathon 2026' }],
  openGraph: {
    title: 'UIDAI Ops-Intel Dashboard - Transform Operations with AI',
    description: 'AI-powered District Operational Intelligence for Telangana - Forecasting, Migration Analysis & Anomaly Detection',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UIDAI Ops-Intel Dashboard',
    description: 'Transform UIDAI operations with AI-driven intelligence',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-surface font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
