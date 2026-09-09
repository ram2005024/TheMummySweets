"use client";

import { PaymentMethod } from "@/schemas/order/order_request_schema";
import {
  useCheckoutStore,
  useEphimeralCheckoutStore,
} from "@/store/checkout.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const paymentSchema = z.object({
  payment_method: PaymentMethod,
});

type PaymentForm = z.infer<typeof paymentSchema>;

const paymentOptions = [
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order arrives",
  },
  {
    value: "esewa",
    label: "eSewa",
    description: "Pay securely using your eSewa wallet",
  },
  {
    value: "stripe",
    label: "Card",
    description: "Pay securely with your debit or credit card",
  },
] as const;

const Payment = () => {
  const payment = useCheckoutStore(
    (state) => state.checkoutData?.payment_method,
  );

  const setCheckoutData = useCheckoutStore((state) => state.setCheckoutData);

  const setActiveLink = useEphimeralCheckoutStore(
    (state) => state.setActiveLink,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: payment ?? "cod",
    },
  });

  const selectedPayment = watch("payment_method");

  const onSubmit = (data: PaymentForm) => {
    setCheckoutData({
      payment_method: data.payment_method,
    });

    setActiveLink(4);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="surface-card overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-5 py-5 sm:px-7">
          <h2 className="text-xl font-semibold text-ink">
            How would you like to pay?
          </h2>

          <p className="mt-1 text-sm text-ink-muted">
            Choose your preferred payment method.
          </p>
        </div>

        {/* Payment methods */}
        <div className="p-5 sm:p-7">
          <div className="space-y-3">
            {paymentOptions.map((option) => {
              const isSelected = selectedPayment === option.value;

              return (
                <label
                  key={option.value}
                  className={`group flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/[0.04]"
                      : "border-border hover:border-primary/30 hover:bg-surface-2"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register("payment_method")}
                    className="sr-only"
                  />

                  {/* Radio */}
                  <div
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? "border-primary"
                        : "border-ink-muted/40 group-hover:border-primary/50"
                    }`}
                  >
                    {isSelected && (
                      <div className="size-2.5 rounded-full bg-primary" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">
                      {option.label}
                    </p>

                    <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                      {option.description}
                    </p>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </label>
              );
            })}
          </div>

          {errors.payment_method && (
            <p className="mt-3 text-sm font-medium text-destructive">
              {errors.payment_method.message}
            </p>
          )}

          {/* Trust note */}
          <p className="mt-5 text-xs text-ink-muted">
            Your payment details are handled securely. You can review your order
            before placing it.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-border bg-surface/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <button
            type="button"
            onClick={() => setActiveLink(2)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-ink transition hover:bg-surface-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <button
            type="submit"
            className="bg-accent-foreground inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-primary-foreground shadow-warm-sm transition hover:-translate-y-0.5 hover:shadow-warm"
          >
            Continue
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Payment;
