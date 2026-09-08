"use client";

import { cn } from "@/lib/utils";
import { deliverySchema } from "@/schemas/order/delivery_schema";
import { useCheckoutStore } from "@/store/checkout.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CalendarClock } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

const Timing = () => {
  const delivery = useCheckoutStore(
    (state) => state.checkoutData?.delivery_details,
  );
  const setCheckoutData = useCheckoutStore((state) => state.setCheckoutData);
  const setActiveLink = useCheckoutStore((state) => state.setActiveLink);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<
    z.input<typeof deliverySchema>,
    unknown,
    z.output<typeof deliverySchema>
  >({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      ...delivery,
      delivery_timing: delivery?.delivery_timing ?? "asap",
      scheduled_time: delivery?.scheduled_time ?? null,
    },
    mode: "onChange",
  });

  const deliveryTiming = useWatch({
    control,
    name: "delivery_timing",
  });

  const onTimingChange = async (value: "asap" | "scheduled") => {
    setValue("delivery_timing", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (value === "asap") {
      setValue("scheduled_time", null, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    await trigger();
  };

  const onSubmit = (data: z.output<typeof deliverySchema>) => {
    setCheckoutData({
      delivery_details: {
        ...delivery,
        ...data,
      },
    });
    setActiveLink(3);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="surface-card overflow-hidden">
        <div className="border-b border-border px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarClock className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-ink">
                Delivery Timing
              </h2>
              <p className="mt-0.5 text-sm text-ink-muted">
                When would you like us to deliver your order?
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink">Choose delivery time</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={cn(
                  "cursor-pointer rounded-xl border p-4 transition",
                  deliveryTiming === "asap"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <input
                  type="radio"
                  value="asap"
                  {...register("delivery_timing")}
                  onChange={() => onTimingChange("asap")}
                  className="sr-only"
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">
                      As soon as possible
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-ink-muted">
                      We'll deliver your order at the earliest possible time.
                    </p>
                  </div>

                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                      deliveryTiming === "asap"
                        ? "border-primary"
                        : "border-border",
                    )}
                  >
                    {deliveryTiming === "asap" && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </span>
                </div>
              </label>

              <label
                className={cn(
                  "cursor-pointer rounded-xl border p-4 transition",
                  deliveryTiming === "scheduled"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <input
                  type="radio"
                  value="scheduled"
                  {...register("delivery_timing")}
                  onChange={() => onTimingChange("scheduled")}
                  className="sr-only"
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">
                      Schedule delivery
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-ink-muted">
                      Choose a date and time that works for you.
                    </p>
                  </div>

                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                      deliveryTiming === "scheduled"
                        ? "border-primary"
                        : "border-border",
                    )}
                  >
                    {deliveryTiming === "scheduled" && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </span>
                </div>
              </label>
            </div>

            {errors.delivery_timing && (
              <p className="text-xs font-medium text-destructive">
                {errors.delivery_timing.message}
              </p>
            )}
          </div>

          {deliveryTiming === "scheduled" && (
            <div className="rounded-xl border border-border bg-surface/50 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-ink">
                  Select delivery date & time
                </h3>
                <p className="mt-1 text-xs text-ink-muted">
                  Choose when you would like your order delivered.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="scheduled_time"
                  className="text-sm font-medium text-ink"
                >
                  Delivery date & time
                </label>

                <input
                  id="scheduled_time"
                  type="datetime-local"
                  {...register("scheduled_time")}
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />

                {errors.scheduled_time && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.scheduled_time.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="text-xs leading-5 text-ink-muted">
            Scheduled deliveries should allow enough time for us to prepare and
            dispatch your order.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-surface/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <button
            type="button"
            onClick={() => setActiveLink(1)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-ink transition hover:bg-surface-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <button
            type="submit"
            disabled={!isValid}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition",
              "bg-accent-foreground text-primary-foreground shadow-warm-sm",
              "hover:-translate-y-0.5 hover:shadow-warm",
              "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:hover:translate-y-0",
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

export default Timing;
