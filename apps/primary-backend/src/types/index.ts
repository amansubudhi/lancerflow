import { z } from "zod";

export const SignupSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    password: z.string().min(6).optional(),
    provider: z.enum(["LOCAL", "GOOGLE"]),
    providerId: z.string().optional()
})

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().optional(),
    provider: z.enum(["LOCAL", "GOOGLE"]),
    providerId: z.string().optional()
})