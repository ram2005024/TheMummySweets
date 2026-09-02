import { CartProduct, MenuProduct, SingleProductType } from "@/type/menu.type";
import { create } from "zustand";

interface CartInterface {
  cart_items: CartProduct[];
  setCartItem: (id: string, value: SingleProductType | MenuProduct) => void;
  increase_cart_quantity: (item_id: string) => void;
  decrease_cart_quantity: (item_id: string) => void;
  remove_cart_item: (item_id: string) => void;
  clear_cart: () => void;
  open: boolean;
  onOpenChange: (val: boolean) => void;
  sub_total: number;
  delivery: number; //Hardcode for now
  vat: number; //Hardcode for now
  total: number;
  calculate: () => void;
}

export const useCartStore = create<CartInterface>((set, get) => ({
  cart_items: [],
  open: false,
  onOpenChange: (val) => set({ open: val }),
  sub_total: 0,
  delivery: 60, //Hardcode for now
  vat: 0.13, //Hardcode for now
  total: 0,
  setCartItem: (id, product) => {
    set((s) => {
      const exists = s.cart_items.find((item) => item.id === id);
      if (!exists)
        return {
          cart_items: [
            ...s.cart_items,
            {
              id: product.id,
              main_image: product.main_image,
              name: product.product_name,
              price: product.price,
              quantity: 1,
              quantized_unit: product.grouped_unit,
            },
          ],
        };
      return {
        cart_items: s.cart_items.map((val) =>
          val.id === id ? { ...val, quantity: val.quantity + 1 } : val,
        ),
      };
    });
    get().calculate();
  },

  remove_cart_item: (id) => {
    set((s) => ({
      cart_items: s.cart_items.filter((val) => val.id !== id),
    }));
    get().calculate();
  },
  clear_cart: () => {
    set((s) => {
      return {
        cart_items: [],
      };
    });
    get().calculate();
  },
  increase_cart_quantity: (id) => {
    set((s) => ({
      cart_items: s.cart_items.map((value) =>
        value.id === id ? { ...value, quantity: value.quantity + 1 } : value,
      ),
    }));
    get().calculate();
  },
  calculate: () =>
    set((s) => {
      if (s.cart_items.length <= 0) return s;
      const total = s.cart_items.reduce(
        (total, val) => val.quantity * val.price,
        0,
      );
      const subtotal = total + s.vat * total + s.delivery;
      return {
        total: total,
        sub_total: Math.round(subtotal),
      };
    }),
  decrease_cart_quantity: (id) => {
    set((s) => {
      const existing_cart = s.cart_items.find((val) => val.id === id);
      if (!existing_cart || existing_cart.quantity === 1) return s;
      return {
        cart_items: s.cart_items.map((val) =>
          val.id === id ? { ...val, quantity: val.quantity - 1 } : val,
        ),
      };
    });
    get().calculate();
  },
}));
