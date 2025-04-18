import express from "express";
import client from "@repo/db/client"
import dotenv from "dotenv"

dotenv.config()

import "./services/cronJobService"

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;


app.post("/trigger/:triggerId", async (req, res) => {
    const triggerId = req.params.triggerId;
    const metadata = req.body;

    try {
        const trigger = await client.trigger.findUnique({
            where: {
                id: triggerId
            },
            select: {
                flowId: true
            }
        })

        if (!trigger) {
            return res.status(404).json({ message: "Trigger not found " })
        }

        const flowId = trigger.flowId

        await client.$transaction(async tx => {
            const run = await tx.flowRun.create({
                data: {
                    flowId,
                    metadata,
                }
            });

            await tx.flowRunOutbox.create({
                data: {
                    flowRunId: run.id
                }
            })
        })

        res.status(200).json({
            message: "Flow run crated Successfully"
        })

    } catch (error) {
        console.error("Error in trigger handler:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
})


app.get("/", (_, res) => {
    res.send("Hooks service is running");
});


app.listen(PORT)



