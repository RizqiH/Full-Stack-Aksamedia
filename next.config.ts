import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-rizkiamanan.wasmer.app/api',
  },
  images: {
    domains: ['backend-rizkiamanan.wasmer.app', 'localhost'],
  },
};

export default nextConfig;
