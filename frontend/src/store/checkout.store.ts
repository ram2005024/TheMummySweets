import {
  CartItems,
  DeliverySchema,
  PaymentMethodType,
} from "@/schemas/order/order_request_schema";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CheckoutData {
  delivery_details?: DeliverySchema;
  payment_method?: PaymentMethodType;
  applied_coupen?: string | null;
  cart_items?: CartItems[];
}

interface checkoutStoreInterface {
  checkoutData: CheckoutData;
  setCheckoutData: (data: Partial<CheckoutData>) => void;
  clearCheckout: () => void;
}
interface ephimeralCheckoutStore {
  activeLink: number;
  setActiveLink: (val: number) => void;
  orderIdempotancyKey: string;
  client_secret: string | null;
  order_id: string | null;
  set_client_secret: (val: string) => void;
  set_order_id: (val: string) => void;
}
export const useEphimeralCheckoutStore = create<ephimeralCheckoutStore>(
  (set) => ({
    orderIdempotancyKey: crypto.randomUUID(),
    client_secret: null,
    order_id: null,
    set_order_id: (val) => set({ order_id: val }),
    set_client_secret: (val) => set({ client_secret: val }),
    activeLink: 1,
    setActiveLink: (val) => set({ activeLink: val }),
  }),
);
export const useCheckoutStore = create<checkoutStoreInterface>()(
  persist(
    (set) => ({
      checkoutData: {},
      setCheckoutData: (data) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            ...data,
          },
        })),
      clearCheckout: () =>
        set({
          checkoutData: {},
        }),
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
