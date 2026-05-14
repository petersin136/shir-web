"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isManage =
    pathname === "/manage" || pathname?.startsWith("/manage/");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {isManage ? (
        children
      ) : (
        <>
          <MainNav />
          <div className="flex min-h-screen flex-col">
            <div className="flex-1 pt-12 sm:pt-14">{children}</div>
            <Footer />
          </div>
        </>
      )}
    </ThemeProvider>
  );
}
