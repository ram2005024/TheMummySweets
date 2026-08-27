import api from "@/libs/api";
import { PaginatedResponse, SuccessResponse } from "@/type/common.type";
import {
  CategoryReadBasic,
  MenuParams,
  MenuProduct,
  ProductReview,
  ReviewParam,
} from "@/type/menu.type";

export class MenuService {
  // To get menu items
  static getMenuItems = async (
    params: MenuParams,
  ): Promise<PaginatedResponse<MenuProduct[]>> => {
    const res = await api.get("/product/", {
      params,
    });
    return res.data.data;
  };
  // To get multiple categories
  static getMultipleCategories = async (): Promise<
    SuccessResponse<CategoryReadBasic[]>
  > => {
    const res = await api.get("/category/");
    return res.data;
  };
  // To get product reviews
  static getProductReviews = async ({
    params,
    product_id,
  }: {
    params: ReviewParam;
    product_id: string;
  }): Promise<PaginatedResponse<ProductReview>> => {
    const res = await api.get(`/product/reviews/${product_id}`, {
      params,
    });
    return res.data.data;
  };
}
