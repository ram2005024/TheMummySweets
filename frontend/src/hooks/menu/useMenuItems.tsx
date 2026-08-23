import { MenuService } from "@/services/menu.service";
import { menuStore } from "@/store/menu.product";
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
    queryFn: ({ pageParam = 1 }) =>
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
