import { Button } from "@/components/ui/button";

export function UploadPreview({
  imagePreviewUrl,
  onRemove,
}: {
  imagePreviewUrl: string;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted/40">
        <img alt="Selected meal preview" className="size-full object-cover" src={imagePreviewUrl} />
      </div>
      <Button onClick={onRemove} size="sm" type="button" variant="ghost">
        Remove image
      </Button>
    </div>
  );
}
