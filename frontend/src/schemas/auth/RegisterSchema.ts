import { z } from "zod";

export const phoneRegisterSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().optional(),
  mobile_number: z
    .string()
    .regex(/^9[78]\d{8}$/, "Enter a valid Nepali phone number"),
  password_1: z.string().min(8, "Password must be at least 8 characters"),
  password_2: z.string(),
  image:z.instanceof(File).optional()
}).refine((data) => data.password_1 === data.password_2, {
  message: "Passwords do not match",
  path: ["password_2"],
});
export type phoneRegisterType=z.infer<typeof phoneRegisterSchema>

export const emailRegisterSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().optional(),
  email: z.email("Enter a valid email address"),
  password_1: z.string().min(8, "Password must be at least 8 characters"),
  password_2: z.string(),
  image:z.instanceof(File).optional()
}).refine((data) => data.password_1 === data.password_2, {
  message: "Passwords do not match",
  path: ["password_2"],
});
export type emailRegisterType=z.infer<typeof emailRegisterSchema>

