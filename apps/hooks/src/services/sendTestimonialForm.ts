import db from "@repo/db/client"
import axios from "axios";
import { startOfDay, endOfDay, subDays } from "date-fns"


export async function sendReadyInvoices() {
    try {

        const tenDaysAgo = subDays(new Date(), 10);

        const triggers = await db.trigger.findMany({
            where: {
                type: {
                    triggerType: "SCHEDULE"
                },
                isActive: true,

            },
            include: {
                type: true,
                flow: {
                    include: {
                        user: true,
                    }
                }
            }
        });


        for (const trigger of triggers) {
            const userId = trigger.flow.userId;

            const clients = await db.client.findMany({
                where: {
                    userId,
                    testimonialRequested: false,
                    deadline: {
                        gte: startOfDay(tenDaysAgo),
                        lte: endOfDay(tenDaysAgo)
                    },
                },
                include: {
                    invoices: {
                        where: {
                            status: "PAID"
                        }
                    }
                }
            });

            for (const client of clients) {
                if (client.invoices.length === 0) continue;



                const emailMetadata = {
                    clientName: client.name,
                    clientEmail: client.email,
                    userName: trigger.flow.user?.name,
                    userEmail: trigger.flow.user?.email,
                    pdfUrl: trigger.flow.user?.testimonialFormUrl,
                }

                try {
                    await axios.post(`${process.env.HOOKS_SERVICE_URL}/trigger/${trigger.id}`, {
                        type: trigger.type.triggerType,
                        emailMetadata
                    });

                    await db.client.update({
                        where: { id: client.id },
                        data: { testimonialRequested: true }
                    });

                    console.log(`Sent testimonial request for client ${client.email} (user ${userId})`);
                } catch (err) {
                    console.error(`Failed to send hook for client ${client.id}:`, err);

                }
            }
        }
    } catch (error) {
        console.error(error)
    }
}
