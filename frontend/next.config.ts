// next.config.ts

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
        protocol: 'https',
        hostname: 'your-production-django-domain.com', // Replace with your real domain
        pathname: '/media/**'
      },
      {
        protocol: 'https',
        hostname: 'africarise.pythonanywhere.com',
        pathname: '/media/**'
      },
      {
        protocol: 'https',
        hostname: 'africarise.pythonanywhere.com',
        pathname: '/media/**'
      },

      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      }
    ]
  }
};

export default nextConfig;
