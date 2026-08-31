"use client";

import { Star } from "lucide-react";
import { FC } from "react";

interface ReviewMeta {
  avg_rating: number;
  distribution: Record<number, number>;
}

const ReviewLeaderboard: FC<{ reviews: ReviewMeta }> = ({ reviews }) => {
  const totalReviews = Object.values(reviews.distribution).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="w-full max-w-sm rounded-xl border bg-card p-4">
      {/* Rating summary */}
      <div className="flex items-center gap-3">
        <div>
          <div className="text-3xl font-bold leading-none">
            {reviews.avg_rating.toFixed(1)}
          </div>

          <div className="mt-1 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(reviews.avg_rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="h-10 w-px bg-border" />

        <span className="text-sm text-muted-foreground">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Rating distribution */}
      <div className="mt-4 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = reviews.distribution[star] ?? 0;
          const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="flex w-7 items-center gap-0.5">
                {star}
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-6 text-right text-xs text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewLeaderboard;
