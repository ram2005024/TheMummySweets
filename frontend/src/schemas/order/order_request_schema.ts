import z from "zod";
import { cartItemSchema } from "./cart_item_schema";
import { deliverySchema, DeliveryTimingStatus } from "./delivery_schema";
export const PaymentMethod = z.enum(["stripe", "esewa", "cod"]);
export const orderRequestSchema = z.object({
  delivery_details: deliverySchema,
  payment_method: PaymentMethod,
  applied_coupen: z.string().nullable().optional(),
  cart_items: z.array(cartItemSchema),
});

export type DeliverySchema = z.infer<typeof deliverySchema>;
export type CartItems = z.infer<typeof cartItemSchema>;
export type OrderRequest = z.infer<typeof orderRequestSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethod>;
export type DeliveryTimingStatus = z.infer<typeof DeliveryTimingStatus>;
