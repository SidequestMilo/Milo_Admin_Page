/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    // Proxy requests to the FastAPI backend to avoid CORS issues
    async rewrites() {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://3.110.182.233:8000').replace(/\/$/, "");

        return [
            {
                source: '/api/:path*',
                destination: `${apiUrl}/api/:path*`
            },
            {
                source: '/admin/:path*',
                destination: `${apiUrl}/admin/:path*`
            }
        ];
    }
};

module.exports = nextConfig;
