import { ImagePlus } from "lucide-react";
import { useImageUpload } from "../hooks/useImageUpload";
import { ProgressItem } from "./ProgressItem";

export function MainImageUpload() {
  const { mainImage, pickMainImage, cancelMainImage } = useImageUpload();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Main Image</label>

      {!mainImage ? (
        <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all">
          <ImagePlus className="w-7 h-7 text-zinc-400 mb-2" />
          <span className="text-sm text-muted-foreground">Click to upload</span>
          <span className="text-xs text-muted-foreground">
            PNG, JPG up to 10MB
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) pickMainImage(file);
              e.target.value = ""; // reset so same file can be re-picked
            }}
          />
        </label>
      ) : (
        <ProgressItem image={mainImage} onCancel={cancelMainImage} size="lg" />
      )}
    </div>
  );
}
