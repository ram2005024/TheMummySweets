import api, { serverapi } from "@/libs/api";
import { PaginatedResponse, SuccessResponse } from "@/type/common.type";
import {
  CategoryReadBasic,
  MenuParams,
  MenuProduct,
  SingleProductType,
} from "@/type/menu.type";

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
  static getServerProduct = async (
    product_id: string,
  ): Promise<SingleProductType> => {
    const res = await serverapi.get(`/product/${product_id}`);
    return res.data.data;
  };
}
