// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ewaqnqzivdceurhjxgpf.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // 이미지 최적화 설정
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // 성능 최적화
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // 압축 활성화
  compress: true,
  // 빌드 최적화
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Vercel 최적화
  output: 'standalone',
  poweredByHeader: false,
};

export default nextConfig;
