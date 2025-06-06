import { z } from "zod";
import { InvoiceStatus } from "@repo/db/client";

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

export const UserUpdateSchema = z.object({
    testimonialFormUrl: z.string().optional()
});

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

export const ClientCreateSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    notes: z.string().optional(),
    deadline: z.preprocess(
        (val) => typeof val === 'string' || val instanceof Date ? new Date(val) : undefined,
        z.date()
    ),
    services: z.array(z.object({
        name: z.string(),
        price: z.number().nonnegative()
    })).optional()
});

export const ClientUpdateSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    notes: z.string().optional(),
    services: z.array(z.object({
        name: z.string(),
        price: z.number()
    })).optional(),
});

export const InvoiceUpdateSchema = z.object({
    services: z.array(z.object({
        name: z.string(),
        price: z.number().nonnegative(),
    })).optional(),

    clientsnapshot: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        companyName: z.string().optional(),
        phone: z.string().optional(),
        notes: z.string().optional()
    }).optional(),

    status: z.nativeEnum(InvoiceStatus).optional(),
    invoiceHtml: z.string().optional(),
})