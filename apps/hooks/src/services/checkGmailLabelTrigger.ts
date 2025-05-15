import client from "@repo/db/client"
import { google } from "googleapis";
import { createOAuthClient, getLabelIdByName, listMessagesWithLabel } from "../utils/gmail";
import axios, { head } from "axios";

export async function checkGmailLabelTriggers() {
    try {
        const triggers = await client.trigger.findMany({
            where: {
                type: {
                    triggerType: "GMAIL_LABEL"
                },
                isActive: true,
                connectedAccount: {
                    isNot: null,
                },
            },
            include: {
                connectedAccount: true,
                type: true,
                flow: true,
            }
        })

        for (const trigger of triggers) {
            console.log(trigger.flow.name)
            const connectedAccount = trigger.connectedAccount;
            if (!connectedAccount) {
                console.warn(`Trigger ${trigger.id} has no connected account.`);
                continue;
            }

            const metadata = trigger.metadata as { label?: string };
            const label = metadata.label;
            if (!label) {
                console.warn(`Trigger ${trigger.id} is missing label metadata.`);
                continue;
            }


            const oAuthClient = createOAuthClient({
                accessToken: connectedAccount.accessToken,
                refreshToken: connectedAccount.refreshToken,
                expiryDate: connectedAccount.expiresAt,
                clientId: process.env.GMAIL_CLIENT_ID!,
                clientSecret: process.env.GMAIL_CLIENT_SECRET!
            });

            try {
                const gmail = google.gmail({ version: "v1", auth: oAuthClient });

                const labelId = await getLabelIdByName(gmail, label);
                if (!labelId) {
                    console.warn(`Label ${label} not found for trigger ${trigger.id}`);
                    continue;
                }

                const messageIds = await listMessagesWithLabel(gmail, labelId);

                for (const messageId of messageIds) {

                    const alreadyProcessed = await client.processedEmailMessage.findUnique({
                        where: {
                            triggerId_messageId: {
                                triggerId: trigger.id,
                                messageId: messageId,
                            }
                        }
                    });

                    if (alreadyProcessed) {
                        continue;
                    }

                    await client.processedEmailMessage.create({
                        data: {
                            triggerId: trigger.id,
                            messageId,
                            userId: trigger.flow.userId,
                        }
                    });

                    console.log("Got the mail with the correct label")

                    const fullMessage = await gmail.users.messages.get({
                        userId: 'me',
                        id: messageId,
                        format: 'full'
                    });

                    const payload = fullMessage.data.payload;
                    const headers = payload?.headers || [];

                    function getHeader(name: string) {
                        return headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';
                    }

                    const type = trigger.type.triggerType;
                    const userId = trigger.flow.userId;

                    const emailMetadata = {
                        messageId,
                        subject: getHeader('Subject'),
                        from: getHeader('From'),
                        to: getHeader('To'),
                        date: getHeader('Date'),
                        snippet: fullMessage.data.snippet,
                        threadId: fullMessage.data.threadId,
                        labelIds: fullMessage.data.labelIds
                    }

                    await axios.post(`${process.env.HOOKS_SERVICE_URL}/trigger/${trigger.id}`, {
                        type,
                        userId,
                        emailMetadata
                    });
                }
            } catch (err) {
                console.error(`Error processing Gmail label for trigger ${trigger.id}:`, err);
            }
        }
    } catch (err) {
        console.error("Error fetching Gmail label triggers:", err);

    }
}
