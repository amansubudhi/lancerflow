import { Resend } from "resend"


type SendEmailParams = {
    to: string;
    subject: string;
    htmlContent: string;
};

export default async function sendEmail({
    to,
    subject,
    htmlContent
}: SendEmailParams): Promise<{ data: any; error: any }> {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY!);
        const result = await resend.emails.send({
            from: 'LancerFlow <noreply@lancerflow.amansubudhi.tech>',
            to: [to],
            subject,
            html: htmlContent
        });

        return result;
    } catch (error) {
        console.error("Failed to send email via Resend:", error)
        throw error;
    }

}