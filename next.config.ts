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
};

export default nextConfig;
