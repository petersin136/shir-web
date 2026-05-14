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
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={`admin-console-root ${jetbrainsMono.variable} flex min-h-screen flex-col`}
      style={{
        backgroundColor: "var(--admin-bg)",
        color: "var(--admin-text)",
      }}
    >
      <header
        className="admin-console-mono flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6"
        style={{
          backgroundColor: "var(--admin-bg)",
          borderColor: "var(--admin-border)",
        }}
      >
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="admin-console-mono truncate text-sm font-semibold uppercase tracking-[0.28em]">
            SHIR BAND
          </span>
          <span
            className="admin-console-mono text-[11px] uppercase tracking-[0.22em] text-[var(--admin-text-muted)]"
            style={{ opacity: 0.5 }}
          >
            / ADMIN CONSOLE
          </span>
        </div>
        <div className="admin-console-mono flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
          <span
            className="admin-live-dot inline-block size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--admin-dot-red)" }}
            aria-hidden
          />
          <span className="text-[var(--admin-text)]">● LIVE</span>
          <time
            dateTime={now.toISOString()}
            className="tabular-nums text-[var(--admin-text-muted)]"
          >
            {formatClockHms(now)}
          </time>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
