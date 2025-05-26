import client from "@repo/db/client"
import axios from "axios";

type TogglDetails = {
    userId: number;
    connectedAccountId: number;
    reportDay: number;
}
export async function fetchTogglTimeEntries({
    connectedAccountId,
    reportDay,
}: TogglDetails, userId: number) {
    try {
        const API_KEY = await client.connectedAccount.findFirst({
            where: {
                id: connectedAccountId
            },
            select: {
                apiKey: true,
            }
        });

        const userDetails = await client.user.findFirst({
            where: {
                id: userId
            },
            select: {
                name: true,
                email: true
            }
        })

        const auth = Buffer.from(`${API_KEY}:api_token`).toString('base64');

        const time_entries = await axios.get("https://api.track.toggl.com/api/v9/me/time_entries", {
            headers: {
                "Authorization": `Basic ${auth}`
            }
        })

        console.log(time_entries)
    } catch (error: any) {
        console.error(error.response?.data || error.message);
    }
}