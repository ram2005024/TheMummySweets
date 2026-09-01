import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { RotateCcw, X } from "lucide-react";
import { ImageFile } from "../types/product.types";

interface ProgressItemProps {
  image: ImageFile;
  onCancel: () => void; // cancel upload or remove
  onRetry?: () => void; // retry on error
  size?: "sm" | "lg";
}

export function ProgressItem({
  image,
  onCancel,
  onRetry,
  size = "sm",
}: ProgressItemProps) {
  const isUploading = image.status === "uploading";
  const isError = image.status === "error";
  const isDone = image.status === "done";

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden border border-zinc-200 bg-white",
        size === "lg" ? "w-full" : "w-full",
      )}
    >
      {/* Image Preview */}
      <div
        className={cn(
          "relative overflow-hidden",
          size === "lg" ? "h-44" : "h-20",
        )}
      >
        <img
          src={image.preview}
          alt="preview"
          className="w-full h-full object-cover"
        />

        {/* Dim overlay while uploading */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {image.progress}%
            </span>
          </div>
        )}
      </div>

      {/* Cancel / Remove button — always visible */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full shadow"
        onClick={onCancel}
      >
        <X className="w-3 h-3" />
      </Button>

      {/* Progress bar + status */}
      <div className="p-2 space-y-1">
        <Progress
          value={image.progress}
          className={cn(
            "h-1.5",
            isError && "[&>div]:bg-red-500",
            isDone && "[&>div]:bg-green-500",
            isUploading && "[&>div]:bg-blue-500",
          )}
        />
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-[10px]",
              isError
                ? "text-red-500"
                : isDone
                  ? "text-green-600"
                  : "text-muted-foreground",
            )}
          >
            {isUploading && `Uploading ${image.progress}%`}
            {isDone && "Uploaded"}
            {isError && "Upload failed"}
            {image.status === "cancelled" && "Cancelled"}
          </span>

          {/* Retry button on error */}
          {isError && onRetry && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-5 h-5"
              onClick={onRetry}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
