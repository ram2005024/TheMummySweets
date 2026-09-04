"use client";
import { useGetWishlistProducts } from "@/hooks/menu/useMenuItems";
import { useWishlistStore } from "@/store/wishlist.store";
import WishListCategoryAndFilter from "./wishlist-category-section";
const WishlistHeader = () => {
  const { wishlist_count } = useWishlistStore();
  const { data } = useGetWishlistProducts();

  // flatten products
  const products = data?.pages.flatMap((page) => page.products.data) ?? [];

  // meta info (from first page)
  const meta = data?.pages[0]?.products.meta;
  return (
    <div className="mb-8">
      {/* Title */}
      <h1 className="text-3xl font-serif font-extrabold  tracking-tight">
        Your Wishlist
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {wishlist_count && wishlist_count > 0
          ? `${wishlist_count} treats waiting for a warm moment`
          : "Your favorite treats, saved for later"}
      </p>

      <p className="mt-7 text-[15px] font-light text-[#544f4c]">
        Showing {products.length} of {meta?.filtered_total ?? 0} products.
      </p>

      {/* Filtering section */}
      <WishListCategoryAndFilter />
    </div>
  );
};

export default WishlistHeader;
