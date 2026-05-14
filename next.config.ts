// next.config.ts
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** 이 앱 디렉터리 — 상위 폴더의 package-lock.json으로 인한 잘못된 루트 추론 방지 */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** iOS 등이 루트에서 자동 요청 — 없으면 콘솔 404. layout 메타와 동일 자산 */
const APPLE_TOUCH_ICON_URL =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_APPLE%20TOUCH%20ICON_180.jpg";

const nextConfig: NextConfig = {
  // 상위 디렉터리에 lockfile이 있을 때 Next가 워크스페이스 루트를 오인 → dev 500·청크 오류 완화
  outputFileTracingRoot: projectRoot,
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
  // experimental: { optimizePackageImports: ['framer-motion'] },
  // ↑ 일부 환경에서 framer-motion 팩토리가 undefined가 되어
  //   "Cannot read properties of undefined (reading 'call')" 런타임 오류가 날 수 있어 비활성화
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
