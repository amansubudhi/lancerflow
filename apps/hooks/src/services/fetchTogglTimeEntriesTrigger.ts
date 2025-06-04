import db from "@repo/db/client"
import axios from "axios";

export async function fetchTogglTimeEntriesTrigger() {
    try {
        const triggers = await db.trigger.findMany({
            where: {
                type: {
                    triggerType: "SCHEDULE"
                },
                isActive: true,
                connectedAccount: {
                    is: {
                        provider: "TOGGL",
                    }
                }
            },
            include: {
                connectedAccount: true,
                type: true,
                flow: {
                    include: {
                        user: true
                    }
                },
            }
        })

        for (const trigger of triggers) {

            const metadata = trigger.metadata as { reportDay?: number };
            const reportDay = metadata.reportDay;
            if (!reportDay) {
                console.warn(`Trigger ${trigger.id} is missing Report Day`);
                continue;
            }

            const todayIST = new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata"
            });


            const emailMetadata = {
                userName: trigger.flow.user.name,
                userEmail: trigger.flow.user.email
            }
            const dayNum = new Date(todayIST).getDay();
            if (reportDay === dayNum)
                await axios.post(`${process.env.HOOKS_SERVICE_URL}/trigger/${trigger.id}`, {
                    reportDay,
                    connectedAccountId: trigger.connectedAccountId,
                    emailMetadata
                });
        }
    } catch (error: any) {
        console.error(error.response?.data || error.message);
    }
}