import {
  CartItems,
  DeliverySchema,
  PaymentMethodType,
} from "@/schemas/order/order_request_schema";
import { OrderStatus } from "@/type/order.type";
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
  locationEnabled: boolean;
  setLocationEnabled: (val: boolean) => void;
}
interface ephimeralCheckoutStore {
  activeLink: number;
  setActiveLink: (val: number) => void;
  orderIdempotancyKey: string;
  client_secret: string | null;
  order_id: string | null;
  order_status: OrderStatus;
  set_order_status: (val: OrderStatus) => void;
  set_client_secret: (val: string) => void;
  set_order_id: (val: string) => void;
  checkout_amount: number;
  set_checkout_amount: (val: number) => void;
  generateNewOrderIdempotancyKey: () => void;
}
export const useEphimeralCheckoutStore = create<ephimeralCheckoutStore>(
  (set) => ({
    order_status: OrderStatus.PENDING_PAYMENT,
    set_order_status: (val) => set({ order_status: val }),
    orderIdempotancyKey: crypto.randomUUID(),
    generateNewOrderIdempotancyKey: () =>
      set({ orderIdempotancyKey: crypto.randomUUID() }),
    client_secret: null,
    order_id: null,
    checkout_amount: 0,
    set_checkout_amount: (val) => set({ checkout_amount: val }),
    set_order_id: (val) => set({ order_id: val }),
    set_client_secret: (val) => set({ client_secret: val }),
    activeLink: 1,
    setActiveLink: (val) => set({ activeLink: val }),
  }),
);
export const useCheckoutStore = create<checkoutStoreInterface>()(
  persist(
    (set) => ({
      locationEnabled: false,
      setLocationEnabled: (val) => set({ locationEnabled: val }),
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
