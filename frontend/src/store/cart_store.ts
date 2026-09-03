import { CartService } from "@/services/cart.service";
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
  debounceTime: number;
  debounceState: Map<string, ReturnType<typeof setTimeout>>;
  debounceFunction: (pid: string) => void;
  timeoutFunction: (pid: string) => ReturnType<typeof setTimeout>;
  versionState: Map<string, number>;
  setCartItems: (val: CartProduct[]) => void;
}

export const useCartStore = create<CartInterface>((set, get) => ({
  setCartItems: (val) => {
    set({ cart_items: val });
  },
  versionState: new Map(),
  debounceTime: 400,
  timeoutFunction: (pid) => {
    // Set the debounce version version
    get().versionState.set(pid, (get().versionState.get(pid) || 0) + 1);
    const timer = setTimeout(async () => {
      const currentCount = get().versionState.get(pid) || 1;
      get().debounceState.get(pid);
      const currentItem = get().cart_items.find((val) => val.id === pid);
      if (!currentItem) return;
      try {
        await CartService.updateCart({
          product_id: pid,
          quantity: currentItem.quantity,
        });
        if (currentCount < (get().versionState.get(pid) || 0)) return;
      } catch (error) {
        console.log(`Something went wrong on the server:${error}`);
        set((s) => ({
          cart_items: s.cart_items.map((val) =>
            val.id === pid ? currentItem : val,
          ),
        }));
      }
    }, get().debounceTime);
    return timer;
  },
  debounceState: new Map<string, ReturnType<typeof setTimeout>>(),
  debounceFunction: (product_id) => {
    // Clear timeout if same product is in the debounce list
    const isInList = get().debounceState.get(product_id);
    if (isInList) {
      // Clear existing
      clearTimeout(isInList);
      get().debounceState.delete(product_id);
      const currentVersion = get().versionState.get(product_id) || 0;
      get().versionState.delete(product_id);
      get().versionState.set(product_id, Math.max(0, currentVersion - 1));
    }
    const setTimeoutID = get().timeoutFunction(product_id);
    get().debounceState.set(product_id, setTimeoutID);
  },
  cart_items: [],
  open: false,
  onOpenChange: (val) => set({ open: val }),
  sub_total: 0,
  delivery: 60, //Hardcode for now
  vat: 0.13, //Hardcode for now
  total: 0,
  setCartItem: (id, product) => {
    const exists = get().cart_items.find((item) => item.id === id);
    if (!exists)
      set((s) => {
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
      });

    get().calculate();
  },

  remove_cart_item: async (id) => {
    set((s) => ({
      cart_items: s.cart_items.filter((val) => val.id !== id),
    }));
    get().calculate();
    const previousValue = get().cart_items.find((val) => val.id == id);
    if (!previousValue) return;
    try {
      await CartService.deleteCart(id);
    } catch (error) {
      console.log(`Something went wrong on the server:${error}`);
      set({
        cart_items: get().cart_items.map((val) =>
          val.id == id ? previousValue : val,
        ),
      });
    }
  },
  clear_cart: async () => {
    set({ cart_items: [] });
    get().calculate();
    const previousValue = get().cart_items;
    if (!previousValue) return;
    try {
      await CartService.clearCart();
    } catch (error) {
      console.log(`Something went wrong on the server:${error}`);
      set({
        cart_items: previousValue,
      });
    }
  },
  increase_cart_quantity: (id) => {
    set((s) => ({
      cart_items: s.cart_items.map((value) =>
        value.id === id ? { ...value, quantity: value.quantity + 1 } : value,
      ),
    }));
    get().calculate();
    get().debounceFunction(id);
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
    get().debounceFunction(id);
  },
}));
