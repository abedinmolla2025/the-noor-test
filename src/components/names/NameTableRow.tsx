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
        "dua-card w-full text-left p-3 transition-all hover:-translate-y-[1px] hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--dua-accent)/0.45)] md:p-4",
        className,
      )}
    >
      {/* Keep everything side-by-side; on small screens allow horizontal scroll instead of stacking */}
      <div className="overflow-x-auto">
        <div className="grid min-w-[38rem] grid-cols-[1.1fr_1fr_1fr_1.4fr] items-start gap-2 md:min-w-0 md:gap-3">
          {/* Arabic */}
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-[hsl(var(--dua-fg-soft))] md:text-[11px]">আরবি</p>
            <p className="font-arabic text-base leading-[1.9] text-[hsl(var(--dua-fg))] md:text-xl">
              {arabicName}
            </p>
            {(genderLabel || category) && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1 md:mt-2">
                {genderLabel ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] border-[hsl(var(--dua-fg)/0.18)] text-[hsl(var(--dua-fg-muted))] md:text-[11px]"
                  >
                    {genderLabel}
                  </Badge>
                ) : null}
                {category ? (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-[hsl(var(--dua-accent)/0.18)] text-[hsl(var(--dua-accent))] md:text-[11px]"
                  >
                    {category}
                  </Badge>
                ) : null}
              </div>
            )}
          </div>

          {/* English */}
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-[hsl(var(--dua-fg-soft))] md:text-[11px]">English</p>
            <p className="truncate text-sm font-semibold tracking-tight text-[hsl(var(--dua-fg))] md:text-base">
              {englishName}
            </p>
          </div>

          {/* Bangla */}
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-[hsl(var(--dua-fg-soft))] md:text-[11px]">বাংলা</p>
            <p className="truncate text-sm text-[hsl(var(--dua-fg-muted))] md:text-base">
              {banglaName || "—"}
            </p>
          </div>

          {/* Meaning */}
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-[hsl(var(--dua-fg-soft))] md:text-[11px]">অর্থ</p>
            <p className="line-clamp-2 text-sm leading-relaxed text-[hsl(var(--dua-fg-muted))] md:text-base">
              {meaning || "—"}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
