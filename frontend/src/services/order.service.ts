import api from "@/libs/api";
import { OrderRequest } from "@/schemas/order/order_request_schema";
import { OrderResponse } from "@/type/order.type";

export class OrderService {
  // Order api call
  static orderItems = async ({
    data,
    idemp_key,
  }: {
    data: OrderRequest;
    idemp_key: string;
  }): Promise<OrderResponse> => {
    const res = await api.post(
      "/order",
      { data },
      {
        headers: {
          "x-order-idempotancy-key": idemp_key,
        },
      },
    );
    return res.data.data;
  };
}
