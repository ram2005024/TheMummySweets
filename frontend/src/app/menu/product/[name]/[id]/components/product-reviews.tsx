import { serverAPI } from "@/libs/server_api";
import { ReviewResponse } from "@/type/menu.type";

const ProductReviews = async ({ product_id }: { product_id: string }) => {
  const productReview = await serverAPI<ReviewResponse>({
    apiString: `/product/reviews/${product_id}`,
    options: {
      revalidate: 60,
    },
  });
  return (
    <div className="flex flex-col gap-4 sm:mt-4 ">
      <span className="text-2xl font-serif font-bold">Reviews & Comments</span>
      <div className="flex max-sm:flex-col gap-3">
        {/* Reviews leadboard */}
      </div>
    </div>
  );
};

export default ProductReviews;
