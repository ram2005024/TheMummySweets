import { ProductService } from "@/services/product.service";
import { ProductCreatePayload } from "@/type/admin/product.type";
import { useMutation } from "@tanstack/react-query";

// Create product mutation
export function useCreateProduct(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (payload: ProductCreatePayload) =>
      ProductService.createProduct(payload),
    onSuccess,
  });
}
