import z from "zod";

export const DeliveryTimingStatus = z.enum(["asap", "scheduled"]);

export const deliverySchema = z
  .object({
    receiptent_name: z.string().min(1, "Recipient name is required"),

    delivery_address: z.string().min(1, "Delivery address is required"),

    delivery_timing: DeliveryTimingStatus.default("asap"),

    scheduled_time: z.coerce.date().nullable().optional(),

    receiptent_phone: z
      .string()
      .regex(/^(97|98)\d{8}$/, "Enter a valid Nepali mobile number"),

    delivery_landmark: z.string().min(1, "Delivery landmark is required"),

    delivery_note: z.string().optional(),
  })
  .refine(
    (data) =>
      data.delivery_timing !== "scheduled" || data.scheduled_time != null,
    {
      message: "Scheduled time is required for scheduled delivery",
      path: ["scheduled_time"],
    },
  )
  .refine(
    (data) =>
      data.delivery_timing !== "scheduled" ||
      !data.scheduled_time ||
      data.scheduled_time > new Date(),
    {
      message: "Scheduled date is in the past",
      path: ["scheduled_time"],
    },
  );

export type DeliverySchemaType = z.infer<typeof deliverySchema>;
