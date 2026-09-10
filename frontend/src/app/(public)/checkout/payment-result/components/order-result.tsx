"use client";

import { useOrderPaymentStatus } from "@/hooks/order/useOrder";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import OrderSuccess from "./order-success";
import PaymentFailed from "./payment-failed";

const OrderResult = ({ order_id }: { order_id: string }) => {
  const { data, isLoading, error } = useOrderPaymentStatus(order_id);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    }
  }, [isLoading, error, data]);

  if (isLoading || data?.payment_status === "pending") {
    return (
      <div
        ref={containerRef}
        className="flex min-h-[520px] w-full items-center justify-center px-4"
      >
        <div className="flex w-full max-w-md flex-col items-center text-center">
          {/* Spinner */}
          <div className="relative flex size-14 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[3px] border-primary/15" />

            <div className="size-14 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />

            <div className="absolute size-5 rounded-full bg-primary/10" />
          </div>

          {/* Content */}
          <h2 className="mt-7 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Confirming your payment
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">
            We&apos;re securely confirming your payment and placing your order.
            This usually takes just a few seconds.
          </p>

          {/* Small status */}
          <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />

            <span className="text-xs font-medium text-ink-muted">
              Please don&apos;t close this page
            </span>
          </div>
        </div>
      </div>
    );
  }

  // error (invalid order id, network issue)
  if (error) {
    return (
      <div
        ref={containerRef}
        className="flex flex-col items-center justify-center h-130 bg-background"
      >
        <h2 className="text-3xl font-bold text-red-600 mb-4">Invalid Order</h2>
        <p className="text-lg text-gray-700 mb-6">
          We couldn’t find your order. Please check the link or{" "}
          <a
            href="/checkout"
            className="text-blue-600 underline hover:text-blue-800"
          >
            return to checkout
          </a>
          .
        </p>
      </div>
    );
  }

  if (data?.payment_status === "paid") {
    return (
      <div
        ref={containerRef}
        className="h-150 flex items-center justify-center"
      >
        <OrderSuccess orderId={order_id} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen flex items-center justify-center"
    >
      <PaymentFailed />
    </div>
  );
};

export default OrderResult;
