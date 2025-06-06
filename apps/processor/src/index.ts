import { Kafka, Partitioners } from "kafkajs";
import db from "@repo/db/client"

const kafka = new Kafka({
    clientId: 'processor-service',
    brokers: ['localhost:9092']
})

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
})


const TOPIC_NAME = 'flow-events'
const POLL_INTERVAL = 5000;

async function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
}

async function main() {
    await producer.connect()
    console.log("Processor service started")

    while (true) {
        try {
            const outboxRows = await db.flowRunOutbox.findMany({
                where: {},
                take: 10
            });

            if (outboxRows.length === 0) {
                await sleep(POLL_INTERVAL);
                continue;
            }

            await producer.send({
                topic: TOPIC_NAME,
                messages: outboxRows.map((row) => ({
                    value: JSON.stringify({
                        flowRunId: row.flowRunId,
                        stage: 0
                    })
                }))
            })

            await db.flowRunOutbox.deleteMany({
                where: {
                    id: {
                        in: outboxRows.map(row => row.id)
                    }
                }
            })

            console.log(`Produced ${outboxRows.length} messages`);
        } catch (error) {
            console.error("Error in processor loop:", error);
        }

        await sleep(POLL_INTERVAL)
    }
}

main().catch((err) => {
    console.error("Fatal error in processor service:", err);
    process.exit(1);
});
