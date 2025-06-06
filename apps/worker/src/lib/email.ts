import sendEmail from "@repo/email";
import { generateInvoiceEmailHTML, generateTestimonialHTML } from "../utils/emailTemplate";
import { EmailMetadata, InvoiceMeta, TestimonialMeta } from "../types/flowRunMetadata";

export async function emailSendInvoice(emailData: InvoiceMeta) {
    const html = generateInvoiceEmailHTML(emailData);

    const { data, error } = await sendEmail({
        to: emailData.clientEmail,
        subject: `Invoice from ${emailData.userName}`,
        replyTo: emailData.userEmail,
        htmlContent: html,
    });

    if (error) {
        console.error("Failed to send email:", error);
        throw new Error("Email send failed")
    }

    return {
        status: "success",
        to: emailData.clientEmail,
        resendData: data
    }
}


export async function emailSendTestimonial(emailData: TestimonialMeta) {
    const html = generateTestimonialHTML(emailData);

    const { data, error } = await sendEmail({
        to: emailData.clientEmail,
        subject: `Testimonial request from ${emailData.userName}`,
        replyTo: emailData.userEmail,
        htmlContent: html,
    });

    if (error) {
        console.error("Failed to send email:", error);
        throw new Error("Email send failed")
    }

    return {
        status: "success",
        to: emailData.clientEmail,
        resendData: data
    }
}

