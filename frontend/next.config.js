/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Only proxy API in local development (when no API_URL is set)
  async rewrites() {
    // In production, NEXT_PUBLIC_API_URL is set, so no rewrites needed
    if (process.env.NEXT_PUBLIC_API_URL) {
      return [];
    }
    // Local development: proxy to local backend
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
  
  // Transpile Leaflet for SSR
  transpilePackages: ['react-leaflet'],
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    domains: ['upload.wikimedia.org'],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
