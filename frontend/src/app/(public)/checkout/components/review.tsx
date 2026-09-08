"use client";

import { useOrderRequest } from "@/hooks/order/useOrder";
import { OrderRequest } from "@/schemas/order/order_request_schema";
import { useCartStore } from "@/store/cart_store";
import {
  useCheckoutStore,
  useEphimeralCheckoutStore,
} from "@/store/checkout.store";
import { ErrorResponse } from "@/type/common.type";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Pencil,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Review = () => {
  const checkoutData = useCheckoutStore((state) => state.checkoutData);
  const setActiveLink = useCheckoutStore((state) => state.setActiveLink);
  const setCheckoutData = useCheckoutStore((state) => state.setCheckoutData);
  const idemp_key = useEphimeralCheckoutStore(
    (state) => state.orderIdempotancyKey,
  );
  const cartItems = useCartStore((state) => state.cart_items);

  const delivery = checkoutData?.delivery_details;
  const payment = checkoutData?.payment_method;
  const appliedCoupon = checkoutData?.applied_coupen;

  const [coupon, setCoupon] = useState(appliedCoupon ?? "");
  const [couponError, setCouponError] = useState("");

  const paymentLabel = {
    cod: "Cash on Delivery",
    esewa: "eSewa",
    stripe: "Card",
  }[payment ?? "cod"];
  const orderMutation = useOrderRequest();
  const handleApplyCoupon = () => {
    const value = coupon.trim();

    if (!value) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    setCouponError("");
    setCheckoutData({ applied_coupen: value });
  };

  const handleRemoveCoupon = () => {
    setCoupon("");
    setCouponError("");
    setCheckoutData({ applied_coupen: null });
  };

  const handleSubmit = () => {
    if (!delivery || !payment) return;

    const orderData: OrderRequest = {
      delivery_details: delivery,
      payment_method: payment,
      applied_coupen: appliedCoupon ?? null,
      cart_items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    };
    orderMutation.mutate(
      { data: orderData, idemp_key },
      {
        onError: (err) => {
          const error = err as AxiosError<ErrorResponse<null>>;
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Something went wrong",
          );
        },
        onSuccess: (data) => {
          if (data.client_secret && data.order_status == "placed") {
            console.log("Order placed");
          } else {
            console.log("Order payment pending");
          }
        },
      },
    );
  };

  return (
    <div className="overflow-hidden surface-card ">
      <div className="border-b border-border px-5 py-5 sm:px-7">
        <h2 className="text-xl font-semibold text-ink">Review Order</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Check your details before placing your order.
        </p>
      </div>

      <div className="space-y-4 p-5 sm:p-7">
        <section className="rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <MapPin className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-ink">
                Delivery Details
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setActiveLink(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80"
            >
              <Pencil className="size-3.5" />
              Edit
            </button>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-ink-muted">Name</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {delivery?.receiptent_name}
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-muted">Phone</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {delivery?.receiptent_phone}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-ink-muted">Delivery Address</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {delivery?.delivery_address}
              </p>

              {delivery?.delivery_landmark && (
                <p className="mt-1 text-xs text-ink-muted">
                  Landmark: {delivery.delivery_landmark}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs text-ink-muted">Delivery Time</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {delivery?.delivery_timing === "SCHEDULED"
                  ? delivery.scheduled_time
                    ? new Date(delivery.scheduled_time).toLocaleString()
                    : "Scheduled"
                  : "As soon as possible"}
              </p>
            </div>

            {delivery?.delivery_note && (
              <div>
                <p className="text-xs text-ink-muted">Note</p>
                <p className="mt-1 text-sm font-medium text-ink">
                  {delivery.delivery_note}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <CreditCard className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-ink">Payment</h3>
            </div>

            <button
              type="button"
              onClick={() => setActiveLink(3)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80"
            >
              <Pencil className="size-3.5" />
              Edit
            </button>
          </div>

          <div className="p-4">
            <p className="text-sm font-medium text-ink">{paymentLabel}</p>
            <p className="mt-1 text-xs text-ink-muted">
              Selected payment method
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Tag className="size-4 text-primary" />

            <div>
              <h3 className="text-sm font-semibold text-ink">Have a coupon?</h3>
              <p className="text-xs text-ink-muted">
                Apply a coupon to your order.
              </p>
            </div>
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-600" />

                <div>
                  <p className="text-sm font-semibold text-ink">
                    {appliedCoupon}
                  </p>
                  <p className="text-xs text-emerald-600">Coupon applied</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="rounded-md p-1.5 text-ink-muted hover:bg-surface-2 hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value);
                    setCouponError("");
                  }}
                  placeholder="Enter coupon code"
                  className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-card px-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-surface-2 h-10 rounded-lg border border-border  px-4 text-sm font-semibold text-ink transition hover:border-primary/40 hover:bg-primary/5"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="mt-2 text-xs font-medium text-destructive">
                  {couponError}
                </p>
              )}
            </>
          )}
        </section>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-surface/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <button
          type="button"
          onClick={() => setActiveLink(3)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-ink transition hover:bg-surface-2"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-accent-foreground inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-primary-foreground shadow-warm-sm transition hover:-translate-y-0.5 hover:shadow-warm"
        >
          Place Order
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default Review;
