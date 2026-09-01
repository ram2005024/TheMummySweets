import { ImagePlus } from "lucide-react";
import { useImageUpload } from "../hooks/useImageUpload";
import { ProgressItem } from "./ProgressItem";

export function SideImagesGrid() {
  const { sideImages, pickSideImages, cancelSideImage } = useImageUpload();

  const remaining = 5 - sideImages.length;
  // always show exactly 5 slots
  const emptySlots = Array(remaining).fill(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Side Images</label>
        <span className="text-xs text-muted-foreground">
          {sideImages.length} / 5
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {/* Filled slots — each has its OWN progress bar */}
        {sideImages.map((img) => (
          <ProgressItem
            key={img.id}
            image={img}
            onCancel={() => cancelSideImage(img.id)}
            size="sm"
          />
        ))}

        {/* Empty slots — clicking opens file picker */}
        {emptySlots.map((_, i) => (
          <label
            key={`empty-${i}`}
            className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all"
          >
            <ImagePlus className="w-5 h-5 text-zinc-300" />
            <input
              type="file"
              accept="image/*"
              multiple // allow picking multiple at once
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  pickSideImages(e.target.files); // pass entire FileList
                }
                e.target.value = "";
              }}
            />
          </label>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        You can select multiple images at once. Max 5 total.
      </p>
    </div>
  );
}
