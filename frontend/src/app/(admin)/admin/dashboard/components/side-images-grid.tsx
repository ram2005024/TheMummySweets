import { useImageUpload } from "@/hooks/admin/useImageUpload";
import { ImagePlus } from "lucide-react";
import { ProgressItem } from "./progress-item";

export function SideImagesGrid() {
  const { sideImages, pickSideImages, cancelSideImage } = useImageUpload();

  const remaining = 5 - sideImages.length;
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
        {/* Filled slots — each with its own progress */}
        {sideImages.map((slot) => (
          <ProgressItem
            key={slot.id}
            slot={slot}
            onCancel={() => cancelSideImage(slot.id)}
            size="sm"
          />
        ))}

        {/* Empty slots */}
        {emptySlots.map((_, i) => (
          <label
            key={`empty-${i}`}
            className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all"
          >
            <ImagePlus className="w-5 h-5 text-zinc-300" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) pickSideImages(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Select multiple images at once. Max 5 total.
      </p>
    </div>
  );
}
