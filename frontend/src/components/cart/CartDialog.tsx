"use client";

import { useCartStore } from "@/store/cart_store";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useRouter } from "next/navigation";
import { SummaryRow } from "./SummaryRow";

const DELIVERY_THRESHOLD = 620;
const VAT_RATE = 0.13;

const CartDialog = () => {
  const navigate = useRouter();
  const {
    cart_items,
    remove_cart_item,
    increase_cart_quantity,
    decrease_cart_quantity,
    total,
    sub_total,
    vat,
    delivery,
    open,
    onOpenChange,
  } = useCartStore();

  const remaining = Math.max(0, DELIVERY_THRESHOLD - total);
  const deliveryProgress = Math.min((total / DELIVERY_THRESHOLD) * 100, 100);
  const isFreeDelivery = total >= DELIVERY_THRESHOLD;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-99 bg-black/50"
          />

          {/* ── Drawer ── */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 z-100 left-0 flex w-full flex-col bg-white shadow-2xl sm:max-w-sm"
          >
            {/* ── Header ── */}
            <header className="shrink-0 border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your basket
                  </h2>
                  {cart_items.length > 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      {cart_items.length}{" "}
                      {cart_items.length === 1 ? "item" : "items"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close cart"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <X size={22} />
                </button>
              </div>
            </header>

            {/* ── Empty state ── */}
            {cart_items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                  <ShoppingBag
                    className="h-10 w-10 text-orange-500"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Your basket is empty
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Add some sweets and we'll get baking.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    navigate.push("/menu");
                  }}
                  className="mt-6 flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Browse the menu
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                {/* ── Items ── */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="space-y-6 px-6 py-5">
                    {/* Free delivery bar */}
                    {!isFreeDelivery && (
                      <div>
                        <p className="mb-2 text-xs font-medium text-gray-700">
                          Add{" "}
                          <span className="font-semibold text-orange-600">
                            Rs. {remaining}
                          </span>{" "}
                          for free delivery
                        </p>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${deliveryProgress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full bg-orange-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Cart items */}
                    <div className="space-y-3">
                      <AnimatePresence initial={false}>
                        {cart_items.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
                          >
                            {/* Image */}
                            {item.main_image ? (
                              <img
                                src={item.main_image.thumbnail}
                                alt={item.name}
                                className="h-16 w-16 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xl">
                                🍽️
                              </div>
                            )}

                            {/* Info + quantity */}
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-semibold text-gray-900">
                                {item.name}
                              </h3>
                              <p className="mt-1 text-xs font-medium text-orange-600">
                                Rs. {item.price}
                              </p>

                              <div className="mt-2 flex w-fit items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  onClick={() => {
                                    decrease_cart_quantity(item.id);
                                  }}
                                  className="flex h-7 w-7 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="flex h-7 min-w-7 items-center justify-center border-x border-gray-200 px-1.5 text-xs font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  onClick={() => {
                                    increase_cart_quantity(item.id);
                                  }}
                                  className="flex h-7 w-7 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Price + remove */}
                            <div className="flex shrink-0 flex-col items-end gap-2">
                              <span className="text-sm font-semibold text-gray-900">
                                Rs. {item.price * item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label={`Remove ${item.name}`}
                                onClick={() => {
                                  remove_cart_item(item.id);
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* ── Summary + checkout ── */}
                <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-5">
                  <div className="mb-5 space-y-3">
                    <SummaryRow label="Subtotal" value={`Rs. ${total}`} />
                    <SummaryRow
                      label="Delivery"
                      value={delivery === 0 ? "FREE" : `Rs. ${delivery}`}
                    />
                    <SummaryRow
                      label={`VAT (${vat * 100}%)`}
                      value={`Rs. ${Math.round(total * VAT_RATE)}`}
                    />
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          Total
                        </span>
                        <motion.span
                          key={sub_total}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          className="text-xl font-bold text-orange-600"
                        >
                          Rs. {sub_total}
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99]"
                  >
                    Checkout · Rs. {sub_total}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDialog;
