import { Router } from "express";
import { authMiddleware } from "../middleware";
import client from "@repo/db/client"
import { ClientCreateSchema, ClientUpdateSchema } from "../types";

const router = Router();

export function calculateTotalFromServices(services: any): number {
    if (!Array.isArray(services)) return 0;
    return services.reduce((total, s) => total + (s.price || 0), 0);
}

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);

        const clients = await client.client.findMany({
            where: {
                userId
            },
        })

        res.status(200).json({
            clients
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Unable to get clients'
        })
    }
})


router.get("/:clientId", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);
        const clientId = req.params.clientId;

        const clientDetail = await client.client.findFirst({
            where: {
                id: Number(clientId),
                userId,
            },
            include: {
                invoices: true
            }
        })

        if (!clientDetail) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.status(200).json({
            clientDetail
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Unable to get client details'
        })
    }
});


router.post("/", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);
        const parsedBody = ClientCreateSchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({
                message: "Invalid inputs"
            })
        }

        const { name, email, companyName, phone, notes, services, deadline } = parsedBody.data;

        const result = await client.$transaction(async (tx) => {
            const newClient = await tx.client.create({
                data: {
                    userId,
                    name,
                    email,
                    companyName,
                    phone,
                    notes,
                    deadline,
                    services
                },
            });

            const amountDue = calculateTotalFromServices(services);

            const invoice = await tx.invoice.create({
                data: {
                    userId,
                    clientId: newClient.id,
                    services,
                    amountDue,
                    status: "DRAFT",
                    clientsnapshot: {
                        name,
                        email,
                        company: companyName ?? null,
                        phone: phone ?? null,
                        notes: notes ?? null,
                    },
                },
            });

            return { newClient, invoice };
        });



        return res.status(200).json({
            client: result.newClient,
            invoice: result.invoice
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to create a new client"
        })
    }
});


router.put("/:clientId", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);
        const clientId = Number(req.params.clientId);

        const parsedData = ClientUpdateSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json({
                message: "Invalid inputs"
            });
        }

        const { name, email, companyName, phone, notes, services } = parsedData.data;

        const updatedClient = await client.client.update({
            where: {
                id: clientId,
                userId,
            },
            data: {
                name,
                email,
                companyName,
                phone,
                notes,
                services
            }
        });

        res.status(200).json({
            client: updatedClient,
            message: "Client updated successfully"
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: "Unable to update client"
        })
    }

});


export const clientRouter = router;