import { z } from "zod";


// Phone login schema
export const phoneLoginSchema=z.object({
mobile_number:z.string().regex(/^9[78]\d{8}$/,"Invalid phone number"),
password:z.string().min(8)
})
export type phoneLoginType=z.infer<typeof phoneLoginSchema>

// Email login schema

export const emailLoginSchema=z.object({
    email:z.email(),
password:z.string().min(8)
})
export type emailLoginType=z.infer<typeof emailLoginSchema>
