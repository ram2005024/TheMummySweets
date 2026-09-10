import { OrderService } from "@/services/order.service";
import { useEphimeralCheckoutStore } from "@/store/checkout.store";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useOrderRequest = () =>
  useMutation({
    mutationFn: OrderService.orderItems,
  });

export const useOrderPaymentStatus = (oid: string) => {
  const { order_id } = useEphimeralCheckoutStore();
  return useQuery({
    queryKey: ["payment-status"],
    queryFn: () => OrderService.findPaymentStatus(oid),
    enabled: !!order_id,
    refetchInterval: (query) => {
      const pmt_status = query.state.data?.payment_status;
      if (pmt_status == "failed") {
        return false;
      } else if (pmt_status == "paid") {
        return false;
      } else return 2000;
    },
  });
};
