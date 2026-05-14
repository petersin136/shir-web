import type { Metadata } from "next";
import { Noto_Serif_KR, EB_Garamond } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/AppChrome";

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif-kr",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif-en",
  display: "swap",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// 파비콘 (브라우저 탭 · 바로가기)
const FAVICON_URL =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_FAVICON_32.png";

// iOS 홈 화면 — 180×180
const APPLE_TOUCH_ICON_URL =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_APPLE%20TOUCH%20ICON_180.jpg";

// Android 홈 화면 / PWA — 192×192
const ANDROID_TOUCH_ICON_URL =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_ANDROID%20TOUCH%20ICON_192.jpg";

// 검색엔진 · SNS 링크 미리보기용 이미지 (빨강 SHIRBAND 로고)
const OG_IMAGE_URL =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND%20Sub%20Logotype%2002_RED(1000X1000).png";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SHIR BAND | Spirit & Truth Worship",
  description: "SHIR BAND - Spirit & Truth Worship 찬양 사역",
  icons: {
    icon: [
      { url: FAVICON_URL, type: "image/png", sizes: "32x32" },
      {
        url: ANDROID_TOUCH_ICON_URL,
        type: "image/jpeg",
        sizes: "192x192",
      },
    ],
    shortcut: [{ url: FAVICON_URL, type: "image/png" }],
    apple: [
      {
        url: APPLE_TOUCH_ICON_URL,
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
  },
  openGraph: {
    title: "SHIR BAND | Spirit & Truth Worship",
    description: "SHIR BAND - Spirit & Truth Worship 찬양 사역",
    url: defaultUrl,
    siteName: "SHIR BAND",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1000,
        height: 1000,
        alt: "SHIR BAND",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SHIR BAND | Spirit & Truth Worship",
    description: "SHIR BAND - Spirit & Truth Worship 찬양 사역",
    images: [OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${notoSerifKr.variable} ${ebGaramond.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning className={`antialiased bg-black text-white`} style={{fontFamily: '"Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif'}}>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
// Deploy trigger - Sat Oct  4 23:22:51 KST 2025
// Force redeploy - Sat Oct  4 23:30:05 KST 2025
// Force redeploy again - Sat Oct  4 23:41:02 KST 2025
// Force Vercel to use latest commit - Sat Oct  4 23:44:41 KST 2025
// Final force deploy - Sat Oct  4 23:49:08 KST 2025
