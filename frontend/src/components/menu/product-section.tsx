"use client";

import { useGetMenuProducts } from "@/hooks/menu/useMenuItems";
import { WishlistService } from "@/services/wishlist.service";
import { useWishlistStore } from "@/store/wishlist.store";
import { MenuProduct } from "@/type/menu.type";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ListProducts from "./product-section/list-product";
import NoProductToShow from "./product-section/no-product-to-show";
import ProductGridSkeleton from "./product-section/product-grid-skeleton";

const ProductSection = () => {
  const [isStatusLoading, setStatusLoading] = useState<boolean>(true);
  const { setWishlistIDS } = useWishlistStore();
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMenuProducts();

  const products: MenuProduct[] =
    data?.pages.flatMap((page) => page.data) ?? [];

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

  //   Fetch the product wishlist status that is presented inside the current page
  useEffect(() => {
    (async () => {
      try {
        setStatusLoading(true);
        if (!data) return;
        const latestPage = data.pages[-1];
        if (!latestPage) return;
        const loaded_ids = latestPage.data.map((val) => val.id);
        if (loaded_ids.length <= 0) return;
        const value = await WishlistService.readWishlistedIDS({
          ids: loaded_ids,
        });
        setWishlistIDS(value.wishlisted_ids);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      } finally {
        setStatusLoading(false);
      }
    })();
  }, [data?.pages, data, setWishlistIDS]);
  const isInitialPending = isPending && isStatusLoading && !data;
  return (
    <section className="bg-background">
      <div className="sm:max-w-[80%] w-full mx-auto py-10">
        {isInitialPending && <ProductGridSkeleton />}
        {products.length > 0 ? (
          <>
            <ListProducts isStatusLoading={isStatusLoading} />
            {/* sentinel div for auto-load */}
            {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
            {isFetchingNextPage && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Loading more...
              </p>
            )}
          </>
        ) : (
          <NoProductToShow />
        )}
      </div>
    </section>
  );
};

export default ProductSection;
