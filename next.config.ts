// next.config.ts
import type { NextConfig } from "next";

/** iOS 등이 루트에서 자동 요청 — 없으면 콘솔 404. layout 메타와 동일 자산 */
const APPLE_TOUCH_ICON_URL =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_APPLE%20TOUCH%20ICON_180.jpg";

const nextConfig: NextConfig = {
  // next-themes가 server vendor-chunks에 누락되며 `next start` 시 500 나는 경우 방지
  transpilePackages: ["next-themes"],
  async redirects() {
    return [
      {
        source: "/apple-touch-icon.png",
        destination: APPLE_TOUCH_ICON_URL,
        permanent: false,
      },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: APPLE_TOUCH_ICON_URL,
        permanent: false,
      },
    ];
  },
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
  poweredByHeader: false,
};

export default nextConfig;
