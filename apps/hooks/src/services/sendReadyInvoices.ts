import db from "@repo/db/client"
import axios from "axios";


export async function sendReadyInvoices() {
    try {
        const triggers = await db.trigger.findMany({
            where: {
                type: {
                    triggerType: "CLIENT_ONBOARDING"
                },
                isActive: true,
            },
            include: {
                type: true,
                flow: {
                    include: {
                        user: true
                    }
                }
            }
        });


        for (const trigger of triggers) {
            const userId = trigger.flow.userId;

            const clients = await db.client.findMany({
                where: {
                    userId,
                    deadline: { lte: new Date() },
                },
                include: {
                    invoices: {
                        where: {
                            status: "SENT"
                        }
                    }
                }
            });

            for (const client of clients) {
                if (client.invoices.length === 0) continue;

                const invoice = client.invoices[0];

                const emailMetadata = {
                    clientName: client.name,
                    clientEmail: client.email,
                    userName: trigger.flow.user.name,
                    userEmail: trigger.flow.user.email,
                    pdfUrl: invoice?.pdfUrl,
                }

                try {
                    await axios.post(`${process.env.HOOKS_SERVICE_URL}/trigger/${trigger.id}`, {
                        type: trigger.type.triggerType,
                        invoiceId: invoice?.id,
                        emailMetadata
                    });

                    // await db.invoice.update({
                    //     where: { id: invoice.id },
                    //     data: { status: "EMAILED" },
                    // });

                    console.log(`Invoice email sent for invoice ${invoice?.id} (client ${client.email})`);

                } catch (error) {
                    console.error(`Failed to send invoice email for invoice ${invoice?.id}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error in sendReadyInvoices cron:', error);

    }
}
