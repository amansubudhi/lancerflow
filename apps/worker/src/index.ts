import "./config/env"

import { Kafka, Partitioners } from "kafkajs"
import db from "@repo/db/client"
import { EmailMetadata, FlowRunMetadata } from "./types/flowRunMetadata"
import { emailSendInvoice, emailSendTestimonial } from "./lib/email"
import { emailHandlers } from "./handlers/emailHandlers"
import { delayHandlers } from "./handlers/delayHandlers"



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

            const flowRunDetails = await db.flowRun.findFirst({
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

            const userId = flowRunDetails?.flow.userId;

            const currentAction = flowRunDetails?.flow.actions.find(x => x.sortingOrder === stage);

            if (!currentAction) {
                console.log("Current action not found")
                return;
            }

            const flowRunMetadata = flowRunDetails?.metadata as unknown as FlowRunMetadata;

            switch (currentAction.type.actionType) {
                case "EMAIL":
                    // if ("emailMetadata" in flowRunMetadata) {
                    //     const emailData: EmailMetadata = flowRunMetadata.emailMetadata;
                    await emailHandlers(flowRunMetadata);

                    // switch (emailData.emailType) {
                    //     case "INVOICE":
                    //         if (result.status === 'success') {
                    //             await db.invoice.update({
                    //                 where: {
                    //                     id: invoiceId,
                    //                 },
                    //                 data: {
                    //                     status: "SENT",
                    //                     sentEmailId: result.resendData.id!,
                    //                 }
                    //             })
                    //         };
                    //         break;
                    //     case "TESTIMONIAL_REQUEST":
                    //         const result = await emailSendTestimonial(emailData);
                    //         if (result.status === 'success') {
                    //             await db.client.update({
                    //                 where: {
                    //                     id: clientId,
                    //                 },
                    //                 data: {
                    //                     testimonialRequested: true
                    //                 }
                    //             })
                    //         }
                    // }
                    // }
                    // if ("emailMetadata" in flowRunMetadata) {
                    //     const emailData: EmailMetadata = flowRunMetadata.emailMetadata;
                    //     let result;
                    //     if (emailData.emailType === "INVOICE") {
                    //         result = await emailSendInvoice(emailData);
                    //     } else if (emailData.emailType === "TESTIMONIAL_REQUEST") {
                    //         result = await emailSendTestimonial(emailData);
                    //     }
                    //     if (result && result.status === 'success') {
                    //         await emailHandlers(flowRunMetadata, result);
                    //     }
                    //     console.log(result);
                    // } else {
                    //     console.error("emailMetadata missing in metadata");
                    // }

                    break;
                case "DELAY":
                    console.log("Reached DELAY ACTION");
                    if (flowRunMetadata.type === "CLIENT_ONBOARDING") {
                        await delayHandlers(flowRunMetadata);
                    }
                    break;
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
