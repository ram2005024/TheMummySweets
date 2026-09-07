"use client";

import { useCartStore } from "@/store/cart_store";
import { Truck } from "lucide-react";
import Image from "next/image";

const OrderItems = () => {
  const cartItems = useCartStore((state) => state.cart_items);
  const subTotal = useCartStore((state) => state.sub_total);
  const delivery = useCartStore((state) => state.delivery);
  const vatAmount = useCartStore((state) => state.vat_amount);
  const total = useCartStore((state) => state.total);

  return (
    <div className="surface-card w-[500px] mr-auto overflow-hidden h-fit">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <h2 className="text-lg font-semibold text-ink">Order summary</h2>
      </div>

      <div className="px-5 sm:px-6">
        <div className="space-y-4 py-5">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                <Image
                  src={item.main_image.thumbnail}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {item.name}
                </p>

                <p className="text-xs text-ink-muted">Qty {item.quantity}</p>
              </div>

              <p className="shrink-0 text-sm font-semibold text-ink">
                Rs. {Math.round(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-border" />

        <div className="space-y-2.5 py-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Subtotal</span>
            <span className="font-medium text-ink">
              Rs. {subTotal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Delivery</span>
            <span className="font-medium text-ink">
              Rs. {delivery.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ink-muted">VAT (13%)</span>
            <span className="font-medium text-ink">
              Rs. {vatAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="flex items-center justify-between py-4">
          <span className="text-base font-semibold text-ink">Total</span>

          <span className="text-xl font-bold text-ink">
            Rs. {total.toLocaleString()}
          </span>
        </div>

        <div className="mb-5 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-xs text-ink-muted sm:mb-6">
          <Truck className="size-3.5 shrink-0 text-primary" />

          <span>Estimated arrival:</span>

          <span className="font-semibold text-ink">25–35 min</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItems;
