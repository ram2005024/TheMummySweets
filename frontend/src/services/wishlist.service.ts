import api from "@/libs/api";
import { SuccessResponse } from "@/type/common.type";
import { MenuParams, Wishlist } from "@/type/menu.type";

export class WishlistService {
  static updateWishlist = async ({
    pid,
    wishlist_state,
  }: {
    pid: string;
    wishlist_state: boolean;
  }): Promise<SuccessResponse<null>> => {
    const res = await api.put(`/wishlist/product/${pid}`, {
      wishlist_state,
    });
    return res.data;
  };

  static readWishlist = async (params: MenuParams): Promise<Wishlist> => {
    const res = await api.get("/wishlist/", {
      params,
    });
    return res.data.data;
  };
}
