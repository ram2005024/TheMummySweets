"use client";

import { useGetCart } from "@/hooks/menu/useMenuItems";
import { useCartStore } from "@/store/cart_store";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";

const CartButton = () => {
  const { cart_items, onOpenChange, setCartItems } = useCartStore();
  const { data: cart, isLoading } = useGetCart();
  const total_quantity = cart_items.reduce((acc, val) => acc + val.quantity, 0);
  useEffect(() => {
    if (cart) setCartItems(cart);
  }, [cart]);
  if (isLoading) return null;
  return (
    <div>
      <button
        onClick={() => onOpenChange(true)}
        className="relative rounded-full p-3 transition hover:bg-orange-50"
      >
        <ShoppingCart size={20} />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
          {total_quantity}
        </span>
      </button>
    </div>
  );
};

export default CartButton;
