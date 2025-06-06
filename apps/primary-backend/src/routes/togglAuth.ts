import { Router } from "express";
import db from "@repo/db/client"

const router = Router();

router.post("/connect", async (req, res) => {
    try {
        //const userId = Number(req.id);
        const userId = 3;
        const API_KEY = req.body.API_KEY;

        const existingAccount = await db.connectedAccount.findFirst({
            where: {
                userId,
                provider: "TOGGL"
            },
        });

        if (existingAccount) {
            return res.status(409).json({
                message: "Toggl account already Exists"
            })
        }

        await db.connectedAccount.create({
            data: {
                userId,
                provider: "TOGGL",
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