import { Button } from "@/components/ui/button";

export type BulkContentAction = "submit_for_review" | "publish" | "unpublish";

type Props = {
  selectedCount: number;
  filteredCount: number;
  canEdit: boolean;
  canApprove: boolean;
  onSelectAllFiltered: () => void;
  onClearSelection: () => void;
  onRequestAction: (action: BulkContentAction) => void;
};

export function BulkContentActionBar({
  selectedCount,
  filteredCount,
  canEdit,
  canApprove,
  onSelectAllFiltered,
  onClearSelection,
  onRequestAction,
}: Props) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-2 z-40 rounded-xl border border-border bg-background/95 p-3 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="text-sm font-medium">Selected: {selectedCount}</div>
          {selectedCount < filteredCount && (
            <Button type="button" variant="outline" size="sm" onClick={onSelectAllFiltered}>
              Select all (filtered: {filteredCount})
            </Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={onClearSelection}>
            Clear
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canEdit}
            onClick={() => onRequestAction("submit_for_review")}
          >
            Submit for Review
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!canApprove}
            onClick={() => onRequestAction("publish")}
          >
            Publish Now
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canApprove}
            onClick={() => onRequestAction("unpublish")}
          >
            Unpublish
          </Button>
        </div>
      </div>
    </div>
  );
}
