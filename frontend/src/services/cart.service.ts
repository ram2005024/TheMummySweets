import api from "@/libs/api";
import { SuccessResponse } from "@/type/common.type";
import { CartResponseType } from "@/type/menu.type";

function create_or_get_guest_session() {
  let guestSessionID = localStorage.getItem("guest-session-id");
  if (!guestSessionID) {
    guestSessionID = crypto.randomUUID();
    localStorage.setItem("guest-session-id", guestSessionID);
  }
  return guestSessionID;
}

export class CartService {
  static addCart = async (
    product_id: string,
  ): Promise<SuccessResponse<null>> => {
    const res = await api.post(
      `/cart/${product_id}`,
      {},
      {
        headers: {
          "guest-session-id": create_or_get_guest_session(),
        },
      },
    );
    return res.data;
  };

  static updateCart = async ({
    product_id,
    quantity,
  }: {
    product_id: string;
    quantity: number;
  }): Promise<SuccessResponse<null>> => {
    const res = await api.patch(
      `/cart/${product_id}`,
      { quantity },
      {
        headers: {
          "guest-session-id": create_or_get_guest_session(),
        },
      },
    );
    return res.data;
  };

  static deleteCart = async (
    product_id: string,
  ): Promise<SuccessResponse<null>> => {
    const res = await api.delete(`/cart/${product_id}`, {
      headers: {
        "guest-session-id": create_or_get_guest_session(),
      },
    });
    return res.data;
  };

  static getCart = async (): Promise<CartResponseType> => {
    const res = await api.get(`/cart/`, {
      headers: {
        "guest-session-id": create_or_get_guest_session(),
      },
    });
    return res.data.data;
  };

  static clearCart = async (): Promise<SuccessResponse<null>> => {
    const res = await api.delete(`/cart/`, {
      headers: {
        "guest-session-id": create_or_get_guest_session(),
      },
    });
    return res.data;
  };
}
