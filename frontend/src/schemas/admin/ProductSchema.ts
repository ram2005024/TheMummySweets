import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description too long"),

  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be greater than 0"),

  prepTime: z
    .number({ invalid_type_error: "Prep time is required" })
    .int()
    .positive("Must be a positive number"),

  category: z.string().min(1, "Please select a category"),

  isAvailable: z.boolean().default(true),
});

// Infer the type directly from schema — no need to write it manually
export type ProductFormValues = z.infer<typeof productSchema>;
