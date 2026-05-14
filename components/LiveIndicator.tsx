"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function formatSeoulDate(now: Date): string {
  const raw = now.toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return raw.replace(/\. /g, ".").replace(/ /g, "").replace(/\.$/, "");
}

function formatSeoulTime(now: Date): string {
  return now.toLocaleTimeString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

type LiveIndicatorProps = {
  className?: string;
  /** 메인 GNB(밝은 배경)는 onLight — 점·문자 대비 */
  variant?: "onDark" | "onLight";
};

export default function LiveIndicator({
  className,
  variant = "onDark",
}: LiveIndicatorProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const isLight = variant === "onLight";
  const dateStr = now ? formatSeoulDate(now) : "--.--.--";
  const timeStr = now ? formatSeoulTime(now) : "--:--:--";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-2 font-mono",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={now ? `LIVE ${dateStr} ${timeStr}` : "LIVE 시계 로딩 중"}
    >
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#FF3030] animate-pulse"
        aria-hidden
      />
      <span
        className={cn(
          "inline-block h-2 w-2 shrink-0 rounded-full",
          isLight ? "bg-neutral-900" : "bg-white",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "text-xs tracking-[0.2em]",
          isLight ? "text-neutral-900" : "text-white",
        )}
      >
        LIVE
      </span>
      <span
        className={cn(
          "hidden text-xs md:inline",
          isLight ? "text-neutral-600" : "text-white/70",
        )}
      >
        {dateStr}
      </span>
      <span
        className={cn("hidden text-xs md:inline", isLight ? "text-neutral-400" : "text-white/30")}
        aria-hidden
      >
        ·
      </span>
      <span className={cn("text-xs tabular-nums", isLight ? "text-neutral-600" : "text-white/70")}>
        {timeStr}
      </span>
    </div>
  );
}
