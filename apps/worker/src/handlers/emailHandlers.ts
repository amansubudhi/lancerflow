import db from "@repo/db/client";
import { FlowRunMetadata } from "../types/flowRunMetadata";
import { emailSendInvoice, emailSendTestimonial } from "../lib/email";


export async function emailHandlers(metadata: FlowRunMetadata) {

    switch (metadata.emailMetadata.emailType) {
        case "invoice":
            if (metadata.type === "CLIENT_ONBOARDING") {
                const result = await emailSendInvoice(metadata.emailMetadata);

                if (result.status === "success") {
                    await db.invoice.update({
                        where: {
                            id: metadata.invoiceId,
                        },
                        data: {
                            status: "SENT",
                            sentEmailId: result.resendData.id,
                        }
                    })
                }
            }
            break;

        case "testimonial":
            if (metadata.type === "SCHEDULE") {
                const result1 = await emailSendTestimonial(metadata.emailMetadata);

                if (result1.status === "success") {
                    await db.client.update({
                        where: {
                            id: metadata.clientId,
                        },
                        data: {
                            testimonialRequested: true
                        }
                    })
                }
            }
            break;
    }

};


