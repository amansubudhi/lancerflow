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

export const FlowCreateSchema = z.object({
    name: z.string().optional(),
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availableActionId: z.string(),
        actionMetadata: z.any().optional()
    })).min(1, "At least one action is required")
})

export const FlowUpdateSchema = z.object({
    name: z.string().optional(),
    availableTriggerId: z.string().optional(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availableActionId: z.string(),
        actionMetadata: z.any().optional()
    })).optional()
})