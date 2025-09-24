// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com", pathname: "/api/**" },
      { protocol: "https", hostname: "africarise.pythonanywhere.com", pathname: "/media/**" },
      { protocol: "http",  hostname: "africarise.pythonanywhere.com", pathname: "/media/**" },
      { protocol: "https", hostname: "img.youtube.com", pathname: "/vi/**" },
      // add your real Django/media host explicitly here:
      // { protocol: "https", hostname: "your-production-django-domain.com", pathname: "/media/**" },
    ],
  },
};

export default nextConfig;
