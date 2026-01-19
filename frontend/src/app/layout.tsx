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
  description: 'District Operational Intelligence Dashboard for UIDAI Telangana - Workload Forecasting, Migration Analysis, and Anomaly Detection',
  keywords: ['UIDAI', 'Aadhaar', 'Dashboard', 'Analytics', 'Telangana', 'Government'],
  authors: [{ name: 'UIDAI Data Hackathon 2026' }],
  openGraph: {
    title: 'UIDAI Ops-Intel Dashboard',
    description: 'District Operational Intelligence for Telangana',
    type: 'website',
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
