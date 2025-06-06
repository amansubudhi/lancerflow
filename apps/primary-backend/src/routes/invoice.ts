import { Router } from "express"
import db from "@repo/db/client";
import { authMiddleware } from "../middleware";
import { InvoiceUpdateSchema } from "../types";
import { calculateTotalFromServices } from "./client";

const router = Router();

router.get("/:invoiceId", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);
        const invoiceId = req.params.invoiceId;

        const invoice = await db.invoice.findFirst({
            where: {
                id: invoiceId,
                userId
            },
            include: {
                client: true
            }
        });

        res.status(200).json({
            invoice
        })
    } catch (error) {
        res.status(500).json({
            message: "Unable to get the invoice"
        })
    }
})

router.put("/:invoiceId", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);
        const invoiceId = req.params.invoiceId;

        const parsedData = InvoiceUpdateSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json({
                message: "Incorrect Inputs"
            })
        }

        const { services, status, clientsnapshot } = parsedData.data;

        const amountDue = calculateTotalFromServices(services);

        const invoice = await db.invoice.update({
            where: {
                id: invoiceId,
                userId
            },
            data: {
                services,
                amountDue,
                status,
                clientsnapshot
            }
        });

        res.status(200).json({
            invoice,
            message: "Invoice updated successfully"
        })
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to update invoice"
        })
    }
});


router.patch("/:invoiceId/mark-ready", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);
        const invoiceId = req.params.invoiceId;

        await db.invoice.update({
            where: {
                id: invoiceId,
                userId
            },
            data: {
                status: "READY"
            }
        });

        res.status(200).json({
            message: "Invoice marked ready to send"
        })
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: "Unable to update invoice status"
        })
    }
})


router.patch("/:invoiceId/mark-paid", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);
        const invoiceId = req.params.invoiceId;

        await db.invoice.update({
            where: {
                id: invoiceId,
                userId
            },
            data: {
                status: "PAID"
            }
        });

        return res.status(200).json({
            message: "Invoice marked paid"
        })
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: "Unable to update invoice status"
        })
    }
})

export const invoiceRouter = router; 