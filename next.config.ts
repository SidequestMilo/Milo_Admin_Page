import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy requests to the FastAPI backend to avoid CORS issues
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://3.110.182.233:8000/api/:path*'
      },
      {
        source: '/admin/:path*',
        destination: 'http://3.110.182.233:8000/admin/:path*'
      }
    ];
  }
};

export default nextConfig;
