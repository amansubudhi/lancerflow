import { Router } from "express"
import client from "@repo/db/client";
import { authMiddleware } from "../middleware";
import { createInvoiceDraftSchema, InvoiceUpdateSchema } from "../types";
const router = Router();


router.post("/create-draft", async (req, res) => {
    try {
        const parsedBody = createInvoiceDraftSchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({
                message: "Incorrect Details"
            })
        }

        const invoice = await client.invoice.create({
            data: {
                userId: parsedBody.data.userId,
                senderName: parsedBody.data.senderName,
                senderEmail: parsedBody.data.senderEmail,
                clientName: parsedBody.data.clientName,
                clientEmail: parsedBody.data.clientEmail,
                amountDue: 0.0,
                status: "DRAFT",
                flowRunId: parsedBody.data.flowRunId
            }
        })

        res.status(200).json({
            invoiceId: invoice.id,
            message: "Invoice draft created successfully"
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: "Error creating Invoice Draft"
        })
    }
})

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);

        const invoices = await client.invoice.findMany({
            where: {
                userId
            }
        })

        res.status(200).json({
            invoices
        })
    } catch (error) {
        res.status(500).json({
            message: "Unable to get all invoices"
        })
    }
});

router.get("/:invoiceId", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);
        const invoiceId = req.params.invoiceId;

        const invoice = await client.invoice.findFirst({
            where: {
                id: invoiceId,
                userId
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

router.patch("/:invoiceId", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);
        const invoiceId = req.params.invoiceId;

        const parsedData = InvoiceUpdateSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json({
                message: "Incorrect Inputs"
            })
        }

        const invoice = await client.invoice.update({
            where: {
                id: invoiceId,
                userId
            },
            data: {
                clientEmail: parsedData.data.clientEmail,
                services: parsedData.data.services,
            }
        })

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

export const invoiceRouter = router; 