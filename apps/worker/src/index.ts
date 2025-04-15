import { Kafka, Partitioners } from "kafkajs"
import client from "@repo/db/client"


const kafka = new Kafka({
    clientId: 'worker-service',
    brokers: ['localhost:9092']
})

const TOPIC_NAME = 'flow-events'

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker' })
    await consumer.connect();

    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
    await producer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            })

            if (!message.value?.toString()) {
                return;
            }

            const parsedValue = JSON.parse(message.value.toString());
            const flowRunId = parsedValue.flowRunId;
            const stage = parsedValue.stage;

            const flowRunDetails = await client.flowRun.findFirst({
                where: {
                    id: flowRunId
                },
                include: {
                    flow: {
                        include: {
                            actions: {
                                include: {
                                    type: true
                                }
                            }
                        }
                    }
                }
            });

            //send a query to get back the flow id
            //send a query to get back the actions associated to this flow id
            //find the available actions

            const currentAction = flowRunDetails?.flow.actions.find(x => x.sortingOrder === stage);

            if (!currentAction) {
                console.log("Current action not found")
                return;
            }

            const flowRunMetadata = flowRunDetails?.metadata;

            if (currentAction.type.actionType === "EMAIL") {
                console.log("Sending out Email")
            }

            if (currentAction.type.actionType === "NOTIFICATION") {
                console.log("Sending out Notification");
            }

            await new Promise(r => setTimeout(r, 500));

            const flowId = message.value?.toString();
            const lastStage = (flowRunDetails?.flow.actions.length || 1) - 1;

            if (lastStage !== stage) {
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            stage: stage + 1,
                            flowRunId
                        })
                    }]
                })
            }

            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString()
            }])
        }
    })
}

main();
