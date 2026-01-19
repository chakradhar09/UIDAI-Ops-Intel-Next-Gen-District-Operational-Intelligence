/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // API Proxy to Python backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
  
  // Transpile Leaflet for SSR
  transpilePackages: ['react-leaflet'],
};

module.exports = nextConfig;
