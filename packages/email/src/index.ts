import { Resend } from "resend"


type SendEmailOptions = {
    to: string;
    subject: string;
    htmlContent: string;
    replyTo?: string;
    scheduledAt?: Date;
    attachments?: [];
};

export default async function sendEmail({
    to,
    subject,
    htmlContent,
    replyTo,
    scheduledAt,
    attachments
}: SendEmailOptions): Promise<{ data: any; error: any }> {
    try {
        const sendParams: any = {
            from: 'LancerFlow <noreply@lancerflow.amansubudhi.tech>',
            to: [to],
            subject,
            html: htmlContent,
            replyTo,
            attachments
        };

        if (scheduledAt) {
            sendParams.scheduled_at = scheduledAt;
        }

        const resend = new Resend(process.env.RESEND_API_KEY!);
        const result = await resend.emails.send(sendParams);

        return result;
    } catch (error) {
        console.error("Failed to send email via Resend:", error)
        throw error;
    }

}