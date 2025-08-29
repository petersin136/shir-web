// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ewaqnqzivdceurhjxgpf.supabase.co", // ← 본인 호스트로 교체!
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Vercel에서만 standalone 출력 사용
  ...(process.env.VERCEL && { output: 'standalone' }),
};

export default nextConfig;
