import {
  CartItems,
  DeliverySchema,
  PaymentMethod,
} from "@/schemas/order/order_request_schema";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CheckoutData {
  delivery_details?: DeliverySchema;
  payment_method?: PaymentMethod;
  applied_coupen?: string | null;
  cart_items?: CartItems[];
}

interface checkoutStoreInterface {
  activeLink: number;
  checkoutData: CheckoutData;
  setActiveLink: (val: number) => void;
  setCheckoutData: (data: Partial<CheckoutData>) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<checkoutStoreInterface>()(
  persist(
    (set) => ({
      activeLink: 1,
      checkoutData: {},
      setActiveLink: (val) => set({ activeLink: val }),
      setCheckoutData: (data) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            ...data,
          },
        })),
      clearCheckout: () =>
        set({
          activeLink: 1,
          checkoutData: {},
        }),
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
