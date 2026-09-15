import { OrderService } from "@/services/order.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useOrderRequest = () =>
  useMutation({
    mutationFn: OrderService.orderItems,
  });

export const useOrderPaymentStatus = (oid: string) => {
  return useQuery({
    queryKey: ["payment-status"],
    queryFn: () => OrderService.findPaymentStatus(oid),
    refetchInterval: (query) => {
      const order_status = query.state.data;
      if (query.state.error) return false;
      if (order_status == "placed") {
        return false;
      } else return 2000;
    },
  });
};
