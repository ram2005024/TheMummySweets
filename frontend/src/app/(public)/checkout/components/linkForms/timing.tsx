"use client";

import { deliverySchema } from "@/schemas/order/delivery_schema";
import { useCheckoutStore } from "@/store/checkout.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
    watch,
    formState: { errors },
  } = useForm<
    z.input<typeof deliverySchema>,
    unknown,
    z.output<typeof deliverySchema>
  >({
    resolver: zodResolver(deliverySchema),
    defaultValues: delivery,
  });

  const deliveryTiming = watch("delivery_timing");

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
      <div>
        <label>
          <input type="radio" value="ASAP" {...register("delivery_timing")} />
          As soon as possible
        </label>

        <label>
          <input
            type="radio"
            value="SCHEDULED"
            {...register("delivery_timing")}
          />
          Schedule delivery
        </label>

        {errors.delivery_timing && <p>{errors.delivery_timing.message}</p>}
      </div>

      {deliveryTiming === "SCHEDULED" && (
        <div>
          <input type="datetime-local" {...register("scheduled_time")} />

          {errors.scheduled_time && <p>{errors.scheduled_time.message}</p>}
        </div>
      )}

      <div>
        <button type="button" onClick={() => setActiveLink(1)}>
          Back
        </button>

        <button type="submit">Continue</button>
      </div>
    </form>
  );
};

export default Timing;
