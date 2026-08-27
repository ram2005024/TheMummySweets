import { MenuService } from "@/services/menu.service";
import { menuStore } from "@/store/menu.product";
import { PaginatedResponse } from "@/type/common.type";
import { ProductReview } from "@/type/menu.type";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// To get the menu items
export const useGetMenuProducts = () => {
  const { limit, search_by, category, most_rated, fast_prepare, sort_by } =
    menuStore();
  return useInfiniteQuery({
    queryKey: [
      "menu-products",
      limit,
      search_by,
      category,
      most_rated,
      fast_prepare,
      sort_by,
    ],
    queryFn: ({ pageParam }) =>
      MenuService.getMenuItems({
        page: pageParam,
        limit,
        search_by,
        category,
        most_rated,
        fast_prepare,
        sort_by,
      }),
    getNextPageParam: (lastResult) => {
      const { meta } = lastResult;
      return meta?.has_next ? meta.page_no + 1 : undefined;
    },
    placeholderData: (prev) => prev,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// To get the multiple categories
export const useGetMenuCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: MenuService.getMultipleCategories,
  });

// To get the product reviews
export const useGetProductReviews = (
  product_id: string,
  initialData?: PaginatedResponse<ProductReview>,
) => {
  return useInfiniteQuery({
    queryKey: ["product_reviews", product_id],
    queryFn: ({ pageParam }) =>
      MenuService.getProductReviews({
        params: { page: pageParam, limit: 10 },
        product_id: product_id,
      }),
    getNextPageParam: (lastResult) => {
      if (!lastResult) return undefined;
      const { meta } = lastResult;
      return meta?.has_next ? meta.page_no + 1 : undefined;
    },
    placeholderData: (prev) => prev,
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};
