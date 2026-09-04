import api from "@/libs/api";
import queryClient from "@/libs/queryClient";
import { CartService } from "@/services/cart.service";
import { MenuService } from "@/services/menu.service";
import { WishlistService } from "@/services/wishlist.service";
import { menuStore } from "@/store/menu.product";
import { useWishlistStore } from "@/store/wishlist.store";
import { ReviewResponse } from "@/type/menu.type";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

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
    refetchOnMount: "always", // 👈 forces a real fetch every time this hook mounts
  });
};
// To get the multiple categories
export const useGetMenuCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: MenuService.getMultipleCategories,
    placeholderData: (prev) => prev,
  });

// To get the product reviews
export const useGetProductReviews = (
  product_id: string,
  initialData?: ReviewResponse,
) => {
  return useInfiniteQuery({
    queryKey: ["product_reviews", product_id],
    queryFn: ({ pageParam }) =>
      MenuService.getProductReviews({
        params: { page: pageParam, limit: 5 },
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

// To get the cart
export const useGetCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: CartService.getCart,
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });
};

// To get the wishlist products
export const useGetWishlistProducts = () => {
  const {
    wishlist_limit,
    wishlist_search_by,
    wishlist_category,
    wishlist_most_rated,
    wishlist_fast_prepare,
    wishlist_sort_by,
  } = useWishlistStore();
  return useInfiniteQuery({
    queryKey: [
      "wishlist-products",
      wishlist_limit,
      wishlist_search_by,
      wishlist_category,
      wishlist_most_rated,
      wishlist_fast_prepare,
      wishlist_sort_by,
    ],
    queryFn: ({ pageParam }) =>
      WishlistService.readWishlist({
        page: pageParam,
        limit: wishlist_limit,
        search_by: wishlist_search_by,
        category: wishlist_category,
        most_rated: wishlist_most_rated,
        fast_prepare: wishlist_fast_prepare,
        sort_by: wishlist_sort_by,
      }),
    getNextPageParam: (lastResult) => {
      const { meta } = lastResult.products;
      return meta?.has_next ? meta.page_no + 1 : undefined;
    },
    placeholderData: (prev) => prev,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
  });
};

export const useDeleteWishlistProduct = () =>
  useMutation({
    mutationFn: async (product_id: string) => {
      await api.delete(`wishlist/${product_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-products"] });
      queryClient.invalidateQueries({ queryKey: ["menu-products"] });
    },
    onError: (err) => {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    },
  });
