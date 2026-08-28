"use client";

import { Send, Star } from "lucide-react";
import { useState } from "react";

const ReviewCommentBox = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-4">
      {/* Rating */}
      <div>
        <p className="mb-2 text-sm font-medium">Your rating</p>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hoverRating || rating);

            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="rounded-sm p-0.5 transition-transform hover:scale-110 focus:outline-none"
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    active
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Headline */}
      <input
        type="text"
        placeholder="Headline (optional)"
        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
      />

      {/* Comment */}
      <textarea
        placeholder="How was the Masala Chai?"
        rows={4}
        className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
      />

      {/* Submit */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        <Send className="h-4 w-4" />
        Post review
      </button>
    </div>
  );
};

export default ReviewCommentBox;
