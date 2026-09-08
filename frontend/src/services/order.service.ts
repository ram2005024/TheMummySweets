import api from "@/libs/api";
import { OrderRequest } from "@/schemas/order/order_request_schema";

export class OrderService {
  // Order api call
  static orderItems = async (payload: {
    orderData: OrderRequest;
    idemp_key: string;
  }) => {
    const res = await api.post("/order/", payload.orderData, {
      headers: {
        "x-order-idempotancy-key": payload.idemp_key,
      },
    });

    return res.data.data;
  };
}
