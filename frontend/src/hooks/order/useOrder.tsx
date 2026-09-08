import { OrderService } from "@/services/order.service";
import { useMutation } from "@tanstack/react-query";

export const useOrderRequest = () =>
  useMutation({
    mutationFn: OrderService.orderItems,
  });
