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
      const pmt_status = query.state.data?.payment_status;
      if (query.state.error) return false;
      if (pmt_status == "failed") {
        return false;
      } else if (pmt_status == "paid") {
        return false;
      } else return 2000;
    },
  });
};
