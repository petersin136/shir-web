"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import { isPageSplitLayoutPath } from "@/components/PageSplitLayout";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isManage =
    pathname === "/manage" || pathname?.startsWith("/manage/");
  const hideFooter = isPageSplitLayoutPath(pathname ?? null);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MainNav />
      <div className="flex min-h-screen flex-col">
        <div
          className={
            isManage
              ? "flex min-h-0 flex-1 flex-col pt-12 sm:pt-14"
              : "flex-1 pt-12 sm:pt-14"
          }
        >
          {children}
        </div>
        {!isManage && !hideFooter && (
          <div className="relative z-20 w-full shrink-0">
            <Footer />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
