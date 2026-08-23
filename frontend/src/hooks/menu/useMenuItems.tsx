import { MenuService } from "@/services/menu.service";
import { menuStore } from "@/store/menu.product";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// To get the menu items
export const useGetMenuProducts = () => {
  const {
    page,
    limit,
    search_by,
    category,
    most_rated,
    fast_prepare,
    sort_by,
  } = menuStore();
  return useQuery({
    queryKey: ["menu-products", page],
    queryFn: () =>
      MenuService.getMenuItems({
        page,
        limit,
        search_by,
        category,
        most_rated,
        fast_prepare,
        sort_by,
      }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};

//
