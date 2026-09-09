"use client";

import { cn } from "@/lib/utils";
import { deliverySchema } from "@/schemas/order/delivery_schema";
import {
  useCheckoutStore,
  useEphimeralCheckoutStore,
} from "@/store/checkout.store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  MapPin,
  MapPinned,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const Delivery = () => {
  const delivery = useCheckoutStore(
    (state) => state.checkoutData?.delivery_details,
  );
  const router = useRouter();
  const setCheckoutData = useCheckoutStore((state) => state.setCheckoutData);

  const setActiveLink = useEphimeralCheckoutStore(
    (state) => state.setActiveLink,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<
    z.input<typeof deliverySchema>,
    unknown,
    z.output<typeof deliverySchema>
  >({
    resolver: zodResolver(deliverySchema),
    defaultValues: delivery,
    mode: "onChange",
  });

  const onSubmit = (data: z.output<typeof deliverySchema>) => {
    setCheckoutData({
      delivery_details: data,
    });

    setActiveLink(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="surface-card overflow-hidden">
        <div className="border-b border-border px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-ink">
                Delivery Details
              </h2>

              <p className="mt-0.5 text-sm text-ink-muted">
                Where should we deliver your order?
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="receiptent_name"
                className="text-sm font-medium text-ink"
              >
                Recipient Name
              </label>

              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />

                <input
                  id="receiptent_name"
                  {...register("receiptent_name")}
                  placeholder="Enter recipient name"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              {errors.receiptent_name && (
                <p className="text-xs font-medium text-destructive">
                  {errors.receiptent_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="receiptent_phone"
                className="text-sm font-medium text-ink"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />

                <input
                  id="receiptent_phone"
                  {...register("receiptent_phone")}
                  placeholder="Enter phone number"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              {errors.receiptent_phone && (
                <p className="text-xs font-medium text-destructive">
                  {errors.receiptent_phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="delivery_address"
              className="text-sm font-medium text-ink"
            >
              Delivery Address
            </label>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3.5 size-4 text-ink-muted" />

              <textarea
                id="delivery_address"
                {...register("delivery_address")}
                placeholder="House number, street, area..."
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {errors.delivery_address && (
              <p className="text-xs font-medium text-destructive">
                {errors.delivery_address.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="delivery_landmark"
              className="text-sm font-medium text-ink"
            >
              Landmark
            </label>

            <div className="relative">
              <MapPinned className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />

              <input
                id="delivery_landmark"
                {...register("delivery_landmark")}
                placeholder="Nearby landmark"
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {errors.delivery_landmark && (
              <p className="text-xs font-medium text-destructive">
                {errors.delivery_landmark.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="delivery_note"
              className="text-sm font-medium text-ink"
            >
              Delivery Note
              <span className="ml-1 font-normal text-ink-muted">
                (Optional)
              </span>
            </label>

            <textarea
              id="delivery_note"
              {...register("delivery_note")}
              placeholder="Any special instructions for delivery?"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            {errors.delivery_note && (
              <p className="text-xs font-medium text-destructive">
                {errors.delivery_note.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-surface/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <button
            type="button"
            onClick={() => router.push("/menu")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-ink transition hover:bg-surface-2"
          >
            <ShoppingBag className="size-4" />
            Continue Shopping
          </button>

          <button
            type="submit"
            disabled={!isValid}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-primary-foreground shadow-warm-sm transition",
              !isValid
                ? "bg-muted-foreground"
                : "bg-accent-foreground  hover:-translate-y-0.5 hover:shadow-warm",
            )}
          >
            Continue
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Delivery;
