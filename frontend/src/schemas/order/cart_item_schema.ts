import z from "zod";

export const cartItemSchema = z.object({
  id: z.uuid(),
  quantity: z.number().int().min(1),
});
