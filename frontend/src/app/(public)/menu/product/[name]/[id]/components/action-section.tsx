"use client";

import { useGetWishlistedIDS } from "@/hooks/menu/useMenuItems";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart_store";
import { useWishlistStore } from "@/store/wishlist.store";
import { SingleProductType } from "@/type/menu.type";
import { Heart, Share2 } from "lucide-react";
import { useEffect } from "react";

const ActionSection = ({
  price,
  id,
  value,
}: {
  price: number;
  id: string;
  value: SingleProductType;
}) => {
  const { setCartItem, cart_items, decrease_cart_quantity } = useCartStore();
  const currentCartCount =
    cart_items.find((val) => val.id == id)?.quantity || 0;
  const { isProductOnWishlist, update_wishlist, setWishlistIDS } =
    useWishlistStore();
  const { data, isFetching } = useGetWishlistedIDS([id]);
  useEffect(() => {
    if (!data) return;
    setWishlistIDS(data.wishlisted_ids);
  }, [isFetching, data, setWishlistIDS]);
  return (
    <div className="space-y-3">
      {/* Quantity + Main Actions */}
      <div className="flex items-center gap-2.5">
        {/* Quantity */}
        <div className="flex h-11 items-center rounded-full border border-border bg-background px-2">
          <button
            onClick={() => decrease_cart_quantity(id)}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-muted-foreground transition hover:bg-muted"
          >
            −
          </button>

          <span className="w-7 text-center text-sm font-semibold tabular-nums">
            {currentCartCount}
          </span>

          <button
            onClick={() => setCartItem(id, value)}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-muted-foreground transition hover:bg-muted"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={() => setCartItem(id, value)}
          className="h-11  rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Add to cart · Rs. {price}
        </button>

        {/* Buy Now */}
        <button
          type="button"
          className="h-11 rounded-full bg-destructive px-6 text-sm font-semibold text-destructive-foreground shadow-sm transition hover:opacity-90"
        >
          Buy now
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => update_wishlist(id)}
          type="button"
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
          )}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5",
              isProductOnWishlist(id) && "fill-red-600 text-red-600",
            )}
          />
          Wishlist
        </button>

        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
      </div>
    </div>
  );
};

export default ActionSection;
