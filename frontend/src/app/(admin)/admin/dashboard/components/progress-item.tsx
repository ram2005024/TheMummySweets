import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ImageSlot } from "@/type/admin/product.type";
import { RotateCcw, X } from "lucide-react";
import Image from "next/image";

interface Props {
  slot: ImageSlot;
  onCancel: () => void;
  onRetry?: () => void;
  size?: "sm" | "lg";
}

export function ProgressItem({ slot, onCancel, onRetry, size = "sm" }: Props) {
  const isUploading = slot.status === "uploading";
  const isDone = slot.status === "done";
  const isError = slot.status === "error";

  return (
    <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-white">
      {/* Preview */}
      <div
        className={cn(
          "relative overflow-hidden",
          size === "lg" ? "h-44" : "h-20",
        )}
      >
        <Image
          width={40}
          height={40}
          src={slot.preview}
          alt="preview"
          className="w-full h-full object-cover"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {slot.progress}%
            </span>
          </div>
        )}
      </div>

      {/* Cancel / Remove */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full"
        onClick={onCancel}
      >
        <X className="w-3 h-3" />
      </Button>

      {/* Progress bar */}
      <div className="p-2 space-y-1">
        <Progress
          value={slot.progress}
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
            {isUploading && `Uploading ${slot.progress}%`}
            {isDone && "Uploaded"}
            {isError && "Failed"}
            {slot.status === "cancelled" && "Cancelled"}
          </span>

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
