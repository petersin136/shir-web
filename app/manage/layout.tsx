"use client";

import { JetBrains_Mono } from "next/font/google";
import { useEffect, useState } from "react";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-admin-mono",
  display: "swap",
});

function formatClockHms(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /** 하이드레이션: 서버·클라 첫 페인트 시각이 달라지지 않도록 마운트 후에만 실시간 표시 */
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date(0));

  useEffect(() => {
    setNow(new Date());
    setMounted(true);
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={`admin-console-root ${jetbrainsMono.variable} flex min-h-0 flex-1 flex-col`}
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <header
        className="admin-console-mono flex h-14 shrink-0 items-center justify-between border-b px-4 sm:h-16 sm:px-6"
        style={{
          backgroundColor: "var(--admin-bg)",
          borderColor: "var(--admin-border)",
        }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="admin-console-mono truncate text-sm font-semibold uppercase tracking-[0.22em] text-[var(--admin-text)] sm:text-base">
            Admin · Console
          </span>
        </div>
        <div className="admin-console-mono flex shrink-0 items-center gap-2 text-xs uppercase tracking-[0.14em] sm:text-sm">
          <span
            className="admin-live-dot inline-block size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--admin-dot-red)" }}
            aria-hidden
          />
          <span className="text-[var(--admin-text)]">● LIVE</span>
          {mounted ? (
            <time
              dateTime={now.toISOString()}
              className="tabular-nums text-[var(--admin-text-muted)]"
            >
              {formatClockHms(now)}
            </time>
          ) : (
            <span
              className="tabular-nums text-[var(--admin-text-muted)]"
              aria-hidden
            >
              --:--:--
            </span>
          )}
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
