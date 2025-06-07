import db from "@repo/db/client";
import sendEmail from "@repo/email";
import { FlowRunMetadata, InvoiceMeta } from "../types/flowRunMetadata";
import { generateFollowUpEmail } from "../utils/emailTemplate";

export async function delayHandlers(metadata: Extract<FlowRunMetadata, { type: "CLIENT_ONBOARDING" }>) {
    console.log("Reached here");
    const emailMeta = metadata.emailMetadata as InvoiceMeta

    const html = await generateFollowUpEmail(emailMeta);

    console.log("Got back html");

    const { data, error } = await sendEmail({
        to: emailMeta.clientEmail,
        subject: "Friendly Reminder: Your Invoice is Pending",
        replyTo: metadata.emailMetadata.userEmail,
        htmlContent: html,
        scheduledAt: new Date(Date.now() + 3 * 60 * 1000),
        //Date.now() + 7 * 24 * 60 * 60 * 1000 For 7 days
    });

    console.log("After send block");

    if (error) {
        console.error("Failed to send email:", error);
        throw new Error("Email send failed");
    } else {
        console.log("Email scheduled successfully:", data);

        await db.invoice.update({
            where: {
                id: metadata.invoiceId,
            },
            data: {
                followUpSent: true,
                followUpEmailId: data.id,
            }
        })
    }
}