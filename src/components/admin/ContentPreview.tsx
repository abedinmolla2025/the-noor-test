import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContentPreviewProps {
  contentType: string;
  title: string;
  titleArabic: string | null;
  content: string | null;
  contentArabic: string | null;
  category: string | null;
}

export const ContentPreview = ({
  contentType,
  title,
  titleArabic,
  content,
  contentArabic,
  category,
}: ContentPreviewProps) => {
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Content Preview</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{contentType}</Badge>
            {category && <Badge variant="secondary">{category}</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Arabic Content */}
        {(titleArabic || contentArabic) && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">Arabic</div>
            {titleArabic && (
              <h2 className="text-2xl font-bold text-right" dir="rtl" lang="ar">
                {titleArabic}
              </h2>
            )}
            {contentArabic && (
              <ScrollArea className="h-[200px]">
                <p className="text-lg leading-relaxed text-right whitespace-pre-wrap" dir="rtl" lang="ar">
                  {contentArabic}
                </p>
              </ScrollArea>
            )}
          </div>
        )}

        {/* English/Translation */}
        <div className="space-y-3 p-4 bg-background rounded-lg border">
          <div className="text-sm font-medium text-muted-foreground">Translation</div>
          {title && (
            <h2 className="text-2xl font-bold">
              {title}
            </h2>
          )}
          {content && (
            <ScrollArea className="h-[200px]">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {content}
              </p>
            </ScrollArea>
          )}
        </div>

        {/* Empty State */}
        {!title && !content && !titleArabic && !contentArabic && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No content to preview yet.</p>
            <p className="text-sm mt-2">Fill in the fields to see how it will look.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
