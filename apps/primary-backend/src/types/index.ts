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


export const createInvoiceDraftSchema = z.object({
    userId: z.number(),
    clientName: z.string(),
    clientEmail: z.string().email(),
    senderName: z.string(),
    senderEmail: z.string().email(),
    threadId: z.string(),
    flowRunId: z.string()
});

export const InvoiceUpdateSchema = z.object({
    clientName: z.string().optional(),
    clientEmail: z.string().email().optional(),
    senderName: z.string().optional(),
    senderEmail: z.string().email().optional(),
    services: z.array(z.object({
        name: z.string(),
        price: z.string()
    })).optional()
})