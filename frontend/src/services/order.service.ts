import api from "@/libs/api";
import { OrderRequest } from "@/schemas/order/order_request_schema";
import { OrderResponse, OrderStatus } from "@/type/order.type";

export class OrderService {
  // Order api call
  static orderItems = async (payload: {
    orderData: OrderRequest;
    idemp_key: string;
  }): Promise<OrderResponse> => {
    const res = await api.post("/order/", payload.orderData, {
      headers: {
        "x-order-idempotancy-key": payload.idemp_key,
      },
    });

    return res.data.data;
  };
  static findPaymentStatus = async (order_id: string): Promise<OrderStatus> => {
    const res = await api.get(`order/status/${order_id}`);
    return res.data.data;
  };
}
