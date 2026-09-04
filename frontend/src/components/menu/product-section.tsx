"use client";

import { useGetMenuProducts } from "@/hooks/menu/useMenuItems";
import { MenuProduct } from "@/type/menu.type";
import { useEffect, useRef } from "react";
import ListProducts from "./product-section/list-product";
import NoProductToShow from "./product-section/no-product-to-show";
import ProductGridSkeleton from "./product-section/product-grid-skeleton";

const ProductSection = () => {
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

  return (
    <section className="bg-background">
      <div className="sm:max-w-[80%] w-full mx-auto py-10">
        {isPending && <ProductGridSkeleton />}
        {products.length > 0 ? (
          <>
            <ListProducts />
            {/* sentinel div for auto-load */}
            {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
            {isFetchingNextPage && !isPending && (
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
