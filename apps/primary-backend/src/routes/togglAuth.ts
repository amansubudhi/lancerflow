import { Router } from "express";
import client from "@repo/db/client"

const router = Router();

router.post("/connect", async (req, res) => {
    try {
        //const userId = Number(req.id);
        const userId = 3;
        const API_KEY = req.body.API_KEY;

        const existingAccount = await client.connectedAccount.findFirst({
            where: {
                userId,
                provider: 'Toggl'
            },
        });

        if (existingAccount) {
            return res.status(409).json({
                message: "Toggl account already Exists"
            })
        }

        await client.connectedAccount.create({
            data: {
                userId,
                provider: 'Toggl',
                type: "API_KEY",
                apiKey: API_KEY
            }
        });

        res.status(200).json({
            message: 'Toggl account connected successfully'
        })
    } catch (err: any) {
        console.error('Error connecting Toggl account:', err);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})


export const togglauthRouter = router;