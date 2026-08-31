"use client";

import { Heart, Share2 } from "lucide-react";

const ActionSection = ({ price }: { price: number }) => {
  return (
    <div className="space-y-3">
      {/* Quantity + Main Actions */}
      <div className="flex items-center gap-2.5">
        {/* Quantity */}
        <div className="flex h-11 items-center rounded-full border border-border bg-background px-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-muted-foreground transition hover:bg-muted"
          >
            −
          </button>

          <span className="w-7 text-center text-sm font-semibold tabular-nums">
            1
          </span>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-muted-foreground transition hover:bg-muted"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          className="h-11  rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Add to cart · Rs. {price}
        </button>

        {/* Buy Now */}
        <button
          type="button"
          className="h-11 rounded-full bg-destructive px-6 text-sm font-semibold text-destructive-foreground shadow-sm transition hover:opacity-90"
        >
          Buy now
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Heart className="h-3.5 w-3.5" />
          Wishlist
        </button>

        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
      </div>
    </div>
  );
};

export default ActionSection;
