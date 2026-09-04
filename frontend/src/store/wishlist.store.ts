import { WishlistService } from "@/services/wishlist.service";
import { create } from "zustand";
interface WishlistState {
  product_id: string;
  wishlist_state: boolean;
}
interface WishlistInterface {
  wishlist_limit: number;
  wishlist_search_by: string;
  wishlist_category: string;
  wishlist_most_rated: boolean;
  wishlist_fast_prepare: boolean;
  wishlist_sort_by: string;
  set_wishlist_limit: (val: number) => void;
  set_wishlist_search_by: (val: string) => void;
  set_wishlist_category: (val: string) => void;
  set_wishlist_most_rated: (val: boolean) => void;
  set_wishlist_fast_prepare: (val: boolean) => void;
  set_wishlist_sort_by: (val: string) => void;
  wishlist_count: number;
  increaseWishlistCount: () => void;
  decreaseWishlistCount: () => void;
  setWishlistCount: (val: number) => void;
  wishlistIDS: Set<string>;
  isProductOnWishlist: (val: string) => boolean;
  update_wishlist: (item_id: string) => void;
  debounceTime: number;
  debounceState: Map<WishlistState, ReturnType<typeof setTimeout>>;
  debounceFunction: (pid: string, wishlist_state: boolean) => void;
  timeoutFunction: (
    pid: string,
    wishlist_state: boolean,
  ) => ReturnType<typeof setTimeout>;
  versionState: Map<string, number>;
}

export const useWishlistStore = create<WishlistInterface>((set, get) => ({
  wishlistIDS: new Set(),
  isProductOnWishlist: (pid) => {
    const exists = get().wishlistIDS.has(pid);
    if (exists) return true;
    return false;
  },
  wishlist_limit: 10,
  wishlist_search_by: "",
  wishlist_category: "",
  wishlist_most_rated: false,
  wishlist_fast_prepare: false,
  wishlist_sort_by: "",
  set_wishlist_limit: (val: number) => set({ wishlist_limit: val }),
  set_wishlist_search_by: (val: string) => set({ wishlist_search_by: val }),
  set_wishlist_category: (val: string) => set({ wishlist_category: val }),
  set_wishlist_most_rated: (val: boolean) => set({ wishlist_most_rated: val }),
  set_wishlist_fast_prepare: (val: boolean) =>
    set({ wishlist_fast_prepare: val }),
  set_wishlist_sort_by: (val: string) => set({ wishlist_sort_by: val }),
  wishlist_count: 0,
  setWishlistCount: (val) => set({ wishlist_count: val }),
  increaseWishlistCount: () =>
    set((s) => ({ wishlist_count: s.wishlist_count + 1 })),
  decreaseWishlistCount: () =>
    set((s) => ({ wishlist_count: s.wishlist_count - 1 })),
  versionState: new Map(),
  debounceTime: 400,
  timeoutFunction: (pid, wishlist_state) => {
    // Set the debounce version version
    get().versionState.set(pid, (get().versionState.get(pid) || 0) + 1);
    const timer = setTimeout(async () => {
      const currentCount = get().versionState.get(pid) || 1;
      try {
        await WishlistService.updateWishlist({ pid, wishlist_state });
        if (currentCount < (get().versionState.get(pid) || 0)) return;
      } catch (error) {
        console.log(`Something went wrong on the server:${error}`);
        set((s) => {
          const next = new Set(s.wishlistIDS);
          next.delete(pid);
          return {
            wishlistIDS: next,
          };
        });
      }
    }, get().debounceTime);
    return timer;
  },
  debounceState: new Map(),
  debounceFunction: (product_id, wishlist_state) => {
    const isInList = [...get().debounceState.entries()].find(
      ([key]) => key.product_id == product_id,
    );

    if (isInList) {
      // Clear existing
      clearTimeout(isInList[1]);
      get().debounceState.delete(isInList[0]);
      const currentVersion = get().versionState.get(product_id) || 0;
      get().versionState.delete(product_id);
      get().versionState.set(product_id, Math.max(0, currentVersion - 1));
    }
    const setTimeoutID = get().timeoutFunction(product_id, wishlist_state);
    get().debounceState.set({ product_id, wishlist_state }, setTimeoutID);
  },
  update_wishlist: (item_id) => {
    const exists = get().wishlistIDS.has(item_id);
    if (!exists) {
      set((s) => {
        const next = new Set(s.wishlistIDS);
        next.add(item_id);
        return {
          wishlistIDS: next,
        };
      });

      get().increaseWishlistCount();
    }
    if (exists) {
      set((s) => {
        const next = new Set(s.wishlistIDS);
        next.delete(item_id);
        return {
          wishlistIDS: next,
        };
      });
      get().decreaseWishlistCount();
    }
    get().debounceFunction(item_id, exists ? false : true);
    return;
  },
  wishlistItems: [],
}));
