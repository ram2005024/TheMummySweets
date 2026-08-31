import { serverAPI } from "@/libs/server_api";
import { ReviewResponse } from "@/type/menu.type";
import ReviewCommentRead from "./reiview-comment-read";
import ReviewCommentBox from "./review-comment-box";
import ReviewLeaderborad from "./review-leaderboard";

const ProductReviews = async ({ product_id }: { product_id: string }) => {
  const productReview = await serverAPI<ReviewResponse>({
    apiString: `/product/reviews/${product_id}?page=1&limit=5`,
    options: {
      revalidate: 60,
    },
  });
  return (
    <div className="flex flex-col gap-4 sm:mt-4 ">
      <span className="text-2xl font-serif font-bold">Reviews & Comments</span>
      <div className="flex max-sm:flex-col gap-3">
        {/* Reviews leadboard */}
        {productReview?.stats && (
          <ReviewLeaderborad reviews={productReview?.stats} />
        )}
        {/* Comment area */}

        <div className="flex flex-col gap-2">
          <ReviewCommentBox />
          {productReview?.data && (
            <ReviewCommentRead
              initial_data={productReview}
              product_id={product_id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
