import { z } from "zod";

export const productSchema = z.object({
  product_name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters" })
    .max(100, { message: "Product name is too long" }),

  product_description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description is too long" })
    .optional(),

  category_label: z.string().min(1, { message: "Category label is required" }),

  category_ids: z
    .array(z.string().uuid({ message: "Invalid category ID" }))
    .min(1, { message: "Select at least one category" }),

  price: z.number().positive({ message: "Price must be greater than 0" }),
  discount_percentage: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({
        error: "Field required",
      })
      .min(0, { error: "Discount can't be negative" })
      .max(100, { error: "Discount can't be more than 100%" }),
  ),

  average_preparation_time: z
    .number({
      error: "Field required",
    })
    .int({ message: "Must be an integer" })
    .positive({ message: "Must be a positive number" }),

  stock_quantity: z
    .number({
      error: "Field required",
    })
    .int({ message: "Must be an integer" })
    .min(0, { message: "Stock cannot be negative" }),

  ingredients: z.array(z.object({ value: z.string().min(1) })).default([]),

  grouped_unit: z.enum(["ltr", "ml", "pcs", "na"]).default("na"),
  grouped_quantity: z.number().int().min(0).default(0),
  is_available: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
