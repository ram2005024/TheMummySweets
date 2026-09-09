"use client";

import { useEphimeralCheckoutStore } from "@/store/checkout.store";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

interface Props {
  orderId: string;
}

const StripePayment = ({ orderId }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const { checkout_amount } = useEphimeralCheckoutStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/payment-result?order_id=${orderId}`,
      },
    });

    if (error) {
      setError(error.message ?? "Payment failed.");
      setLoading(false);
    }
  };

  return (
    <div className="surface-card w-full overflow-hidden">
      <div className="border-b border-border px-5 py-5 sm:px-7">
        <h2 className="text-xl font-semibold text-ink">
          Complete your payment
        </h2>

        <p className="mt-1 text-sm text-ink-muted">
          Enter your payment details to complete your order.
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-7">
        <PaymentElement />

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        <button
          type="button"
          disabled={!stripe || !elements || loading}
          onClick={handlePayment}
          className="gradient-warm flex h-11 w-full items-center justify-center rounded-xl px-6 text-sm font-semibold text-primary-foreground shadow-warm-sm transition hover:-translate-y-0.5 hover:shadow-warm disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Processing..." : `Pay Rs. ${checkout_amount}`}
        </button>
      </div>
    </div>
  );
};

export default StripePayment;
