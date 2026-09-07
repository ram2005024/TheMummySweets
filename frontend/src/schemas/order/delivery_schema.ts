import z from "zod";

export const DeliveryTimingStatus = z.enum(["ASAP", "SCHEDULED"]);
export const deliverySchema = z
  .object({
    receiptent_name: z.string().min(1, "Recipient name is required"),
    delivery_address: z.string().min(1, "Delivery address is required"),
    delivery_timing: DeliveryTimingStatus.default("ASAP"),
    delivery_note: z.string().nullable().optional(),
    scheduled_time: z.coerce.date().nullable().optional(),
    receiptent_phone: z
      .string()
      .regex(/^(97|98)\d{8}$/, "Enter a valid Nepali mobile number"),
    delivery_landmark: z.string().min(1, "Delivery landmark is required"),
  })
  .refine(
    (data) =>
      data.delivery_timing !== "SCHEDULED" ||
      (data.scheduled_time !== null && data.scheduled_time !== undefined),
    {
      message: "Scheduled time is required for scheduled delivery",
      path: ["scheduled_time"],
    },
  )
  .refine(
    (data) =>
      data.delivery_timing !== "SCHEDULED" ||
      !data.scheduled_time ||
      data.scheduled_time > new Date(),
    {
      message: "Scheduled date is in past",
      path: ["scheduled_time"],
    },
  );
