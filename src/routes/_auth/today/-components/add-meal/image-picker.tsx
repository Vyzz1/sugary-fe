import { useEffect, useRef } from "react";
import { Camera, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadPreview } from "./upload-preview";

export type ImagePickerIntent = "camera" | "library" | "upload" | "manual";

const consumedAutoOpenKeys = new Set<number>();

export function ImagePicker({
  imagePreviewUrl,
  onFileChange,
  onRemove,
  preferredIntent,
  autoOpenKey,
  errorMessage,
}: {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  preferredIntent: ImagePickerIntent;
  autoOpenKey: number;
  errorMessage?: string;
}) {
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const libraryInputRef = useRef<HTMLInputElement | null>(null);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const lastAutoOpenKeyRef = useRef<number | null>(null);

  useEffect(() => {
    if (lastAutoOpenKeyRef.current === autoOpenKey || consumedAutoOpenKeys.has(autoOpenKey)) {
      return;
    }

    lastAutoOpenKeyRef.current = autoOpenKey;
    consumedAutoOpenKeys.add(autoOpenKey);

    if (preferredIntent === "camera") {
      cameraInputRef.current?.click();
    } else if (preferredIntent === "library") {
      libraryInputRef.current?.click();
    } else if (preferredIntent === "upload") {
      desktopInputRef.current?.click();
    }
  }, [autoOpenKey, preferredIntent]);

  const handlePick = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      onFileChange(file);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Image</p>
        <p className="text-sm text-muted-foreground">
          Add a meal photo if it helps document what was eaten.
        </p>
      </div>

      {imagePreviewUrl ? (
        <UploadPreview imagePreviewUrl={imagePreviewUrl} onRemove={onRemove} />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            className="md:hidden"
            onClick={() => cameraInputRef.current?.click()}
            type="button"
          >
            <Camera className="size-4" />
            Take photo
          </Button>
          <Button
            onClick={() =>
              (window.matchMedia("(max-width: 767px)").matches
                ? libraryInputRef.current
                : desktopInputRef.current
              )?.click()
            }
            type="button"
            variant="outline"
          >
            <ImagePlus className="size-4" />
            <span className="md:hidden">Choose from library</span>
            <span className="hidden md:inline">Upload image</span>
          </Button>
        </div>
      )}

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <input
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePick()}
        ref={cameraInputRef}
        type="file"
      />
      <input
        accept="image/*"
        className="hidden"
        onChange={handlePick()}
        ref={libraryInputRef}
        type="file"
      />
      <input
        accept="image/*"
        className="hidden"
        onChange={handlePick()}
        ref={desktopInputRef}
        type="file"
      />
    </div>
  );
}
