import { TICKET_BANK, ticketBankCopyText } from "@/lib/ticket-events";
import { CopyTextButton } from "@/components/CopyTextButton";
import { cn } from "@/lib/utils";

type TicketBankInfoProps = {
  variant?: "compact" | "full";
  className?: string;
};

export function TicketBankInfo({
  variant = "full",
  className,
}: TicketBankInfoProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "border border-white/15 px-4 py-4 space-y-3 text-[14px] font-light",
          className,
        )}
      >
        <p className="text-[12px] text-white/45 tracking-[0.2em] uppercase">
          입금 계좌
        </p>
        <p className="text-white/85 tabular-nums">
          {TICKET_BANK.bankName} {TICKET_BANK.accountNumber}
        </p>
        <p className="text-white/60 text-[13px]">
          담당자 · {TICKET_BANK.manager}
        </p>
        <CopyTextButton text={ticketBankCopyText()} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border border-white/20 px-5 py-6 sm:px-6 sm:py-8 space-y-4",
        className,
      )}
    >
      <p className="text-[12px] text-white/45 tracking-[0.2em] uppercase">
        입금 계좌
      </p>
      <p className="text-[15px] text-white/70 font-light">{TICKET_BANK.bankName}</p>
      <p className="text-xl sm:text-2xl font-light tracking-wide text-white/90 tabular-nums">
        {TICKET_BANK.accountNumber}
      </p>
      <p className="text-[14px] text-white/60 font-light">
        담당자 · {TICKET_BANK.manager}
      </p>
      <CopyTextButton text={ticketBankCopyText()} label="계좌 정보 복사하기" />
    </div>
  );
}
