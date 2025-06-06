import db from "@repo/db/client"
import axios from "axios";
import { startOfDay, endOfDay, subDays, addDays } from "date-fns"


export async function sendTestimonialForm() {
    try {

        console.log("Reaching here");
        const today = new Date();
        const tenDaysAgo = subDays(today, 10);
        const start = startOfDay(tenDaysAgo);
        const end = endOfDay(tenDaysAgo);

        console.log("Ten Days Ago:", tenDaysAgo);
        console.log("Start of Ten Days Ago:", start);
        console.log("End of Ten Days Ago:", end);


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

        console.log("Found triggers:", triggers.length);
        for (const trigger of triggers) {
            const userId = trigger.flow.userId;

            // const clients = await db.client.findMany({
            //     where: {
            //         userId,
            //         testimonialRequested: false,
            //         invoices: {
            //             some: {
            //                 status: "PAID"
            //             }
            //         }
            //     },
            //     include: {
            //         invoices: {
            //             where: {
            //                 status: "PAID",
            //             }
            //         }
            //     }
            // });

            const clients = await db.client.findMany({
                where: {
                    userId,
                    testimonialRequested: false,
                    deadline: {
                        gte: startOfDay(tenDaysAgo),
                        lte: endOfDay(addDays(tenDaysAgo, 1))
                    },
                    invoices: {
                        some: {
                            status: "PAID"
                        }
                    }
                },
                include: {
                    invoices: {
                        where: {
                            status: "PAID"
                        }
                    }
                }
            });

            console.log("Found clients:", clients.length);
            console.log(clients[0]);

            for (const client of clients) {
                if (client.invoices.length === 0) continue;



                const emailMetadata = {
                    emailType: "testimonial",
                    clientName: client.name,
                    clientEmail: client.email,
                    userName: trigger.flow.user?.name,
                    userEmail: trigger.flow.user?.email,
                    formUrl: trigger.flow.user?.testimonialFormUrl,
                }

                try {
                    await axios.post(`${process.env.HOOKS_SERVICE_URL}/trigger/${trigger.id}`, {
                        clientId: client.id,
                        type: trigger.type.triggerType,
                        emailMetadata
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
