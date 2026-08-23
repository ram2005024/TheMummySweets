import api from "@/libs/api";
import { PaginatedResponse } from "@/type/common.type";
import { MenuParams, MenuProduct } from "@/type/menu.type";

export class MenuService {
  static getMenuItems = async (
    params: MenuParams,
  ): Promise<PaginatedResponse<MenuProduct[]>> => {
    const res = await api.get("/product/", {
      params,
    });
    return res.data.data;
  };
}
