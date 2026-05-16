"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type CopyTextButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyTextButton({
  text,
  label = "복사하기",
  className,
}: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "border border-white/40 px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-light text-white/90 hover:bg-white hover:text-black transition-all",
        className,
      )}
    >
      {copied ? "복사됨" : label}
    </button>
  );
}
