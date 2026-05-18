import Link from "next/link";

type SplitSectionCtaProps = {
  href: string;
  label: string;
  ariaLabel: string;
};

/** 홈 SPLIT 섹션 CTA — 텍스트 우측 화살표, 테두리로 클릭 가능함 표시 */
export function SplitSectionCta({ href, label, ariaLabel }: SplitSectionCtaProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="split-about-latin split-section-cta group mt-8 inline-flex min-h-[2.75rem] cursor-pointer items-center gap-2.5 border border-black bg-white/40 px-4 py-2.5 text-black shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-[2px] transition-[background-color,color,box-shadow,transform] duration-200 hover:bg-black hover:text-white hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:mt-16 md:gap-3 md:px-5 md:py-3"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] md:text-[13px] md:tracking-[0.28em]">
        {label}
      </span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden
      >
        <path
          d="M3.5 9h9M10 5.5L13.5 9 10 12.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
