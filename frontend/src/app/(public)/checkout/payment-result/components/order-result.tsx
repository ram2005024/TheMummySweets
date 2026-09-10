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
        className="flex flex-col items-center justify-center h-screen bg-gray-50"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Confirming your payment...
        </h2>
        <p className="text-gray-600">
          Please wait while we confirm your order.
        </p>
      </div>
    );
  }

  // error (invalid order id, network issue)
  if (error) {
    return (
      <div
        ref={containerRef}
        className="flex flex-col items-center justify-center h-screen bg-gray-50"
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
        className="h-screen flex items-center justify-center"
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
