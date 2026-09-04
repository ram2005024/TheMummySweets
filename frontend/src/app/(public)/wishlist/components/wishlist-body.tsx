"use client";

import ProductGridSkeleton from "@/components/menu/product-section/product-grid-skeleton";
import { useGetWishlistProducts } from "@/hooks/menu/useMenuItems";
import { useWishlistStore } from "@/store/wishlist.store";
import { MenuProduct } from "@/type/menu.type";
import { useEffect, useRef } from "react";
import NoWishlistItems from "./no-wishlist";
import WishlistProductList from "./wishlist-product";

const WishlistProductBody = () => {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetWishlistProducts();
  const { setWishlistIDS } = useWishlistStore();
  const products: MenuProduct[] =
    data?.pages.flatMap((page) => page.products.data) ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  useEffect(() => {
    if (!data?.pages) return;
    const wishlistIDS = data.pages.flatMap((val) =>
      val.products.data.map((val) => val.id),
    );
    setWishlistIDS(wishlistIDS);
  }, [data?.pages, data, setWishlistIDS]);
  return (
    <section className="sm:max-w-[80%] w-full mx-auto py-10">
      <div>
        {isPending && <ProductGridSkeleton />}
        {!isPending && products.length > 0 ? (
          <>
            <WishlistProductList />
            {/* sentinel div for auto-load */}
            {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
            {isFetchingNextPage && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Loading more...
              </p>
            )}
          </>
        ) : (
          !isPending && <NoWishlistItems />
        )}
      </div>
    </section>
  );
};

export default WishlistProductBody;
