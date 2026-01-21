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
        "dua-card w-full text-left p-4 transition-all hover:-translate-y-[1px] hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--dua-accent)/0.45)]",
        className,
      )}
    >
      <div className="grid gap-3 md:grid-cols-[1.1fr_1fr_1fr_1.4fr] md:items-start">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[hsl(var(--dua-fg-soft))] md:hidden">আরবি</p>
          <p className="truncate font-arabic text-lg leading-snug text-[hsl(var(--dua-fg))] md:text-xl">
            {arabicName}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[hsl(var(--dua-fg-soft))] md:hidden">English</p>
          <p className="truncate text-sm font-semibold tracking-tight text-[hsl(var(--dua-fg))] md:text-base">
            {englishName}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[hsl(var(--dua-fg-soft))] md:hidden">বাংলা</p>
          <p className="truncate text-sm text-[hsl(var(--dua-fg-muted))] md:text-base">
            {banglaName || "—"}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[hsl(var(--dua-fg-soft))] md:hidden">অর্থ</p>
          <p className="line-clamp-2 text-sm text-[hsl(var(--dua-fg-muted))] md:text-base">
            {meaning || "—"}
          </p>
        </div>
      </div>

      {(genderLabel || category) && (
        <div className="mt-3 flex flex-wrap items-center gap-1">
          {genderLabel ? (
            <Badge
              variant="outline"
              className="text-[11px] border-[hsl(var(--dua-fg)/0.18)] text-[hsl(var(--dua-fg-muted))]"
            >
              {genderLabel}
            </Badge>
          ) : null}
          {category ? (
            <Badge
              variant="secondary"
              className="text-[11px] bg-[hsl(var(--dua-accent)/0.18)] text-[hsl(var(--dua-accent))]"
            >
              {category}
            </Badge>
          ) : null}
        </div>
      )}
    </button>
  );
}
