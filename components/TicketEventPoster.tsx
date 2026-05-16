"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type TicketEventPosterProps = {
  src: string;
  alt: string;
  className?: string;
};

/** 티켓 페이지 오른쪽 패널 빈 공간용 집회 포스터 */
export function TicketEventPoster({
  src,
  alt,
  className,
}: TicketEventPosterProps) {
  return (
    <aside
      className={cn(
        "hidden lg:block shrink-0 w-[min(42%,220px)] xl:w-[240px]",
        className,
      )}
      aria-label="집회 포스터"
    >
      <div className="sticky top-24 overflow-hidden border border-white/20 bg-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="240px"
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
    </aside>
  );
}
