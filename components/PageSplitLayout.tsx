import { BackgroundVideo } from "@/components/BackgroundVideo";
import { cn } from "@/lib/utils";

type PageSplitLayoutProps = {
  children: React.ReactNode;
  /** oneness / metanoia — 모바일 contain 배너 */
  backgroundVariant?: "default" | "contained";
  className?: string;
  /** 본문 영역 추가 클래스 (max-w, 패딩 등) */
  mainClassName?: string;
  /** 티켓 페이지 모바일 — 흰 배경·전체 너비 (데스크탑 레이아웃 유지) */
  ticketMobileShell?: boolean;
};

const HERO_BG_CLASS =
  "fixed -z-10 left-0 right-0 top-12 bottom-0 sm:top-14 md:inset-0";

/** 이 경로에서는 푸터 숨김 (AppChrome과 동기화) */
export const PAGE_SPLIT_LAYOUT_PATHS = [
  "/about",
  "/ticket",
  "/notice",
  "/events",
  "/media",
  "/apply",
  "/inquiry",
  "/contact",
  "/privacy-policy",
  "/oneness",
  "/metanoia-2026",
] as const;

export function isPageSplitLayoutPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return PAGE_SPLIT_LAYOUT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/** GNB 아래 본문: 히어로 전체 고정 · 오른쪽 50%만 레이어+텍스트(좌측 정렬) */
export function PageSplitLayout({
  children,
  backgroundVariant = "default",
  className,
  mainClassName,
  ticketMobileShell = false,
}: PageSplitLayoutProps) {
  const hideMobileHero = ticketMobileShell;

  return (
    <>
      {backgroundVariant === "contained" ? (
        <BackgroundVideo
          overlayOpacity={0}
          mobileFit="contain"
          bgColor="#000000"
          mobileObjectClass="object-top"
          className={cn(HERO_BG_CLASS, hideMobileHero && "max-md:hidden")}
        />
      ) : (
        <BackgroundVideo
          overlayOpacity={0}
          className={cn(HERO_BG_CLASS, hideMobileHero && "max-md:hidden")}
        />
      )}

      <div
        className={cn(
          "relative z-[2] min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-3.5rem)]",
          className,
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 top-[38vh] md:left-1/2 md:top-0 md:bottom-0",
            "bg-white",
            hideMobileHero && "max-md:hidden",
          )}
          aria-hidden
        />

        {/* 오른쪽 절반 컬럼 — 본문은 컬럼 안 왼쪽(중앙선 쪽) 정렬 */}
        <div
          className={cn(
            "relative md:ml-auto md:w-1/2 md:min-h-[inherit] md:z-[3] md:bg-white",
            hideMobileHero && "max-md:w-full",
          )}
        >
          <main
            className={cn(
              "page-content-light relative w-full bg-white px-6 py-16 sm:px-10 sm:py-20 md:pl-10 md:pr-14 md:py-24 lg:pl-12 lg:pr-16 lg:py-28 max-md:pt-[38vh]",
              hideMobileHero &&
                "max-md:px-0 max-md:pt-0 max-md:pb-0 max-md:bg-white max-md:min-h-[calc(100dvh-3rem)] max-md:overflow-x-hidden",
              mainClassName,
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
