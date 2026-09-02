"use client";

import { useCartStore } from "@/store/cart_store";
import { ShoppingCart } from "lucide-react";

const CartButton = () => {
  const { cart_items, onOpenChange } = useCartStore();
  const total_quantity = cart_items.reduce((acc, val) => acc + val.quantity, 0);

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
