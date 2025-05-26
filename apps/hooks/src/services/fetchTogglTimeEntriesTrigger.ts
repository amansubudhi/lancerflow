import client from "@repo/db/client"
import axios from "axios";

export async function fetchTogglTimeEntriesTrigger() {
    try {
        const triggers = await client.trigger.findMany({
            where: {
                type: {
                    triggerType: "CRON"
                },
                isActive: true,
                connectedAccount: {
                    isNot: null,
                }
            },
            include: {
                connectedAccount: true,
                type: true,
                flow: true,
            }
        })

        for (const trigger of triggers) {
            const connectedAccount = trigger.connectedAccount;
            if (!connectedAccount) {
                console.warn(`Trigger ${trigger.id} has no connected account.`);
                continue;
            }

            const metadata = trigger.metadata as { reportDay?: number };
            const reportDay = metadata.reportDay;
            if (!reportDay) {
                console.warn(`Trigger ${trigger.id} is missing Report Day`);
                continue;
            }

            const todayIST = new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata"
            });

            const connectedAccountId = trigger.connectedAccount?.id;

            const dayNum = new Date(todayIST).getDay();
            if (reportDay === dayNum)
                await axios.post(`${process.env.HOOKS_SERVICE_URL}/trigger/${trigger.id}`, {
                    reportDay,
                    connectedAccountId: connectedAccount.id,
                });
        }
    } catch (error: any) {
        console.error(error.response?.data || error.message);
    }
}