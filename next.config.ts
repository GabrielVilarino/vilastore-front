import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
        return [
            {
                source: '/api/:path*',
                // destination: 'http://localhost:8000/:path*'
                destination: `${API_URL}/:path*`
            }
        ]
    }
};

export default nextConfig;
