"use client";

import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

interface Props {
  orderId?: string;
}

const PaymentFailed = ({ orderId }: Props) => {
  const handleRetry = () => {
    window.location.href = orderId
      ? `/checkout?order_id=${orderId}`
      : "/checkout";
  };

  return (
    <div className="flex min-h-130 w-full items-center justify-center px-4 py-10">
      <div className="surface-card w-full max-w-lg overflow-hidden">
        <div className="flex flex-col items-center px-6 py-10 text-center sm:px-10">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-8 text-destructive" />
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-ink">
            Payment unsuccessful
          </h1>

          <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">
            We couldn&apos;t complete your payment. Your order has not been
            placed. Please try again or choose another payment method.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRetry}
              className="gradient-warm flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-primary-foreground shadow-warm-sm transition hover:-translate-y-0.5 hover:shadow-warm"
            >
              <RefreshCw className="size-4" />
              Try again
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-ink transition hover:bg-muted"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </button>
          </div>

          {orderId && (
            <p className="mt-6 text-xs text-ink-muted">
              Order reference:{" "}
              <span className="font-medium text-ink">{orderId}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
