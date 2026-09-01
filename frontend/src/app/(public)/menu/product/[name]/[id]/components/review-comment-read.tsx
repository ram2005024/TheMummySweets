"use client";

import { useGetProductReviews } from "@/hooks/menu/useMenuItems";
import { ProductReview, ReviewResponse } from "@/type/menu.type";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Send, Star } from "lucide-react";
import Image from "next/image";

interface Props {
  initial_data: ReviewResponse;
  product_id: string;
}

const formatDate = (date: string) => {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  } catch {
    return "";
  }
};

const getInitials = (name: string) => {
  const words = name.trim().split(" ");

  if (words.length === 1) {
    return words[0]?.charAt(0).toUpperCase() || "U";
  }

  return (
    (words[0]?.charAt(0) || "") + (words[words.length - 1]?.charAt(0) || "")
  ).toUpperCase();
};

const ReviewAvatar = ({
  name,
  image,
  size = "md",
}: {
  name: string;
  image?: string;
  size?: "sm" | "md";
}) => {
  const dimensions = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={size === "sm" ? 32 : 40}
        height={size === "sm" ? 32 : 40}
        className={`${dimensions} shrink-0 rounded-full object-cover ring-1 ring-border`}
      />
    );
  }

  return (
    <div
      className={`${dimensions} ${textSize} flex shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground ring-1 ring-border`}
    >
      {getInitials(name)}
    </div>
  );
};

const ReviewStars = ({ rating }: { rating: number }) => {
  const safeRating = Math.min(Math.max(rating, 0), 5);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= safeRating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/20"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

const ReviewCommentRead = ({ initial_data, product_id }: Props) => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetProductReviews(product_id, initial_data);

  const reviews: ProductReview[] =
    data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  return (
    <div className="w-full max-w-3xl sm:p-5">
      {/* Empty state */}
      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center bg-card ">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
          </div>

          <p className="mt-3 font-medium">No reviews yet</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to share your experience.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const userName = review.user.profile.full_name || "Anonymous";

            const userImage = review.user.profile.image;

            const comments = review.comments ?? [];

            return (
              <article
                key={review.id}
                className="rounded-xl border bg-card p-4 sm:p-5"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <ReviewAvatar name={userName} image={userImage} />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                          {userName}
                        </p>

                        {review.user.profile.rank && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {review.user.profile.rank}
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <ReviewStars rating={review.rating} />
                </div>

                {/* Review Content */}
                <div className="mt-4 space-y-1.5">
                  {review.review_title && (
                    <h3 className="text-sm font-semibold text-foreground">
                      {review.review_title}
                    </h3>
                  )}

                  {review.review_description && (
                    <p className="text-sm leading-6 text-muted-foreground">
                      {review.review_description}
                    </p>
                  )}
                </div>

                {/* Review Actions */}
                <div className="mt-4 flex items-center gap-5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Helpful</span>
                    <span>({review.like_count ?? 0})</span>
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    <MessageCircle className="h-4 w-4" />

                    <span>
                      {comments.length === 0
                        ? "Comment"
                        : `${comments.length} ${
                            comments.length === 1 ? "Comment" : "Comments"
                          }`}
                    </span>
                  </button>
                </div>

                {/* Comments */}
                {comments.length > 0 && (
                  <div className="mt-4 space-y-3 border-l-2 pl-4">
                    {comments.map((comment) => {
                      const commentUser =
                        comment.user.profile.full_name || "Anonymous";

                      return (
                        <div key={comment.id} className="flex gap-2.5">
                          <ReviewAvatar
                            name={commentUser}
                            image={comment.user.profile.image}
                            size="sm"
                          />

                          <div className="min-w-0 flex-1 rounded-lg bg-muted/50 px-3 py-2.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold">
                                {commentUser}
                              </span>

                              {comment.user.profile.rank && (
                                <span className="text-[10px] text-muted-foreground">
                                  {comment.user.profile.rank}
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Comment Input */}
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="h-9 min-w-0 flex-1 rounded-lg border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <button
                    type="button"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90"
                    aria-label="Send comment"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}

          {/* Load More */}
          {hasNextPage && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-lg border bg-background px-5 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading..." : "Load more reviews"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCommentRead;
