import { CartService } from "@/services/cart.service";
import {
  CartProduct,
  CartResponseType,
  MenuProduct,
  SingleProductType,
} from "@/type/menu.type";
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
  delivery: number;
  set_delivery: (val: number) => void; //Hardcode for now
  vat_amount: number; //Hardcode for now
  total: number;
  calculate: () => void;
  debounceTime: number;
  debounceState: Map<string, ReturnType<typeof setTimeout>>;
  debounceFunction: (pid: string) => void;
  timeoutFunction: (pid: string) => ReturnType<typeof setTimeout>;
  versionState: Map<string, number>;
  setCartItems: (val: CartResponseType) => void;
}

export const useCartStore = create<CartInterface>((set, get) => ({
  setCartItems: (val) => {
    set({
      cart_items: val.items,
      total: val.total,
      sub_total: val.sub_total,
      delivery: val.delivery_fee,
      vat_amount: val.tax_amount,
    });
  },
  versionState: new Map(),
  set_delivery: (val) => set({ delivery: val }),
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
  vat_amount: 0.13, //Hardcode for now
  total: 0,
  setCartItem: async (id, product) => {
    const exists = get().cart_items.find((item) => item.id === id);
    if (!exists) {
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

      try {
        await CartService.addCart(id);
      } catch (error) {
        console.log(`Something went wrong: ${error}`);
        set({ cart_items: get().cart_items.filter((val) => val.id == id) });
      }
    } else {
      get().increase_cart_quantity(id);
    }
    get().calculate();
  },

  remove_cart_item: async (id) => {
    const previousValue = get().cart_items.find((val) => val.id == id);
    if (!previousValue) return;
    set((s) => ({
      cart_items: s.cart_items.filter((val) => val.id !== id),
    }));
    get().calculate();
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
      const sub_total = s.cart_items.reduce(
        (total, val) => total + val.quantity * val.price,
        0,
      );
      const vat_amount = sub_total * 0.13;
      const total = sub_total + vat_amount + s.delivery;
      return {
        ...s,
        total: Math.round(total),
        sub_total: Math.round(sub_total),
        vat_amount: Math.round(vat_amount),
      };
    }),
  decrease_cart_quantity: (id) => {
    const existing_cart = get().cart_items.find((val) => val.id === id);
    if (!existing_cart) return;
    const cart_count = existing_cart.quantity;
    if (cart_count == 1) get().remove_cart_item(id);

    set((s) => {
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
