import api from "@/libs/api";
import { PaginatedResponse, SuccessResponse } from "@/type/common.type";
import { CategoryReadBasic, MenuParams, MenuProduct } from "@/type/menu.type";

export class MenuService {
  static getMenuItems = async (
    params: MenuParams,
  ): Promise<PaginatedResponse<MenuProduct[]>> => {
    const res = await api.get("/product/", {
      params,
    });
    return res.data.data;
  };
  static getMultipleCategories = async (): Promise<
    SuccessResponse<CategoryReadBasic[]>
  > => {
    const res = await api.get("/category/");
    return res.data;
  };
}
