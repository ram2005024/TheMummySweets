"use client";

import { deliverySchema } from "@/schemas/order/delivery_schema";
import { useCheckoutStore } from "@/store/checkout.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const Delivery = () => {
  const delivery = useCheckoutStore(
    (state) => state.checkoutData?.delivery_details,
  );
  const setCheckoutData = useCheckoutStore((state) => state.setCheckoutData);
  const setActiveLink = useCheckoutStore((state) => state.setActiveLink);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    z.input<typeof deliverySchema>,
    unknown,
    z.output<typeof deliverySchema>
  >({
    resolver: zodResolver(deliverySchema),
    defaultValues: delivery,
  });

  const onSubmit = (data: z.output<typeof deliverySchema>) => {
    setCheckoutData({
      delivery_details: data,
    });
    setActiveLink(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("receiptent_name")} />
      {errors.receiptent_name && <p>{errors.receiptent_name.message}</p>}

      <input {...register("receiptent_phone")} />
      {errors.receiptent_phone && <p>{errors.receiptent_phone.message}</p>}

      <input {...register("delivery_address")} />
      {errors.delivery_address && <p>{errors.delivery_address.message}</p>}

      <input {...register("delivery_landmark")} />
      {errors.delivery_landmark && <p>{errors.delivery_landmark.message}</p>}

      <textarea {...register("delivery_note")} />

      <div>
        <button type="button">Continue Shopping</button>

        <button type="submit">Continue</button>
      </div>
    </form>
  );
};

export default Delivery;
