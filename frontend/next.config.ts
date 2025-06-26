import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',           // Add the port if you serve from 8000
        pathname: '/media/**'
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'africarise.pythonanywhere.com',
        pathname: '/media/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**'
      }
    ]
  }
};

export default nextConfig;
