import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  arabicName: string;
  englishName: string;
  banglaName?: string;
  meaning?: string;
  category?: string;
  genderLabel?: string;
  onClick?: () => void;
  className?: string;
};

export default function NameTableRow({
  arabicName,
  englishName,
  banglaName,
  meaning,
  category,
  genderLabel,
  onClick,
  className,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "dua-card w-full text-left p-2.5 transition-all hover:-translate-y-[1px] hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--dua-accent)/0.45)] md:p-4",
        className,
      )}
    >
      {/* Keep everything side-by-side; on small screens allow horizontal scroll instead of stacking */}
      <div className="overflow-x-auto">
        <div className="grid min-w-[32rem] grid-cols-[1.05fr_.95fr_.95fr_1.25fr] items-start gap-1.5 md:min-w-0 md:grid-cols-[1.1fr_1fr_1fr_1.4fr] md:gap-3">
          {/* Arabic */}
          <div className="min-w-0">
            <p className="text-[9px] font-medium text-[hsl(var(--dua-fg-soft))] md:text-[11px]">আরবি</p>
            <p className="font-arabic text-[15px] leading-[1.85] text-[hsl(var(--dua-fg))] md:text-xl">
              {arabicName}
            </p>
            {(genderLabel || category) && (
              <div className="mt-1 flex flex-wrap items-center gap-1 md:mt-2">
                {genderLabel ? (
                  <Badge
                    variant="outline"
                    className="text-[9px] border-[hsl(var(--dua-fg)/0.18)] px-1.5 py-0 text-[hsl(var(--dua-fg-muted))] md:px-2 md:py-0.5 md:text-[11px]"
                  >
                    {genderLabel}
                  </Badge>
                ) : null}
                {category ? (
                  <Badge
                    variant="secondary"
                    className="text-[9px] bg-[hsl(var(--dua-accent)/0.18)] px-1.5 py-0 text-[hsl(var(--dua-accent))] md:px-2 md:py-0.5 md:text-[11px]"
                  >
                    {category}
                  </Badge>
                ) : null}
              </div>
            )}
          </div>

          {/* English */}
          <div className="min-w-0">
            <p className="text-[9px] font-medium text-[hsl(var(--dua-fg-soft))] md:text-[11px]">English</p>
            <p className="truncate text-xs font-semibold tracking-tight text-[hsl(var(--dua-fg))] md:text-base">
              {englishName}
            </p>
          </div>

          {/* Bangla */}
          <div className="min-w-0">
            <p className="text-[9px] font-medium text-[hsl(var(--dua-fg-soft))] md:text-[11px]">বাংলা</p>
            <p className="truncate text-xs text-[hsl(var(--dua-fg-muted))] md:text-base">
              {banglaName || "—"}
            </p>
          </div>

          {/* Meaning */}
          <div className="min-w-0">
            <p className="text-[9px] font-medium text-[hsl(var(--dua-fg-soft))] md:text-[11px]">অর্থ</p>
            <p className="line-clamp-1 text-xs leading-relaxed text-[hsl(var(--dua-fg-muted))] md:line-clamp-2 md:text-base">
              {meaning || "—"}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
