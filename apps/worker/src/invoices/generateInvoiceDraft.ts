import axios from "axios";
import sendEmail from "@repo/email";

type InvoiceDetails = {
    clientDetails: string;
    senderDetails: string;
    threadId: string;
    flowRunId: string;
    userId: number;
}

type CreateDraftSuccessResponse = {
    invoiceId: string;
    message: string;
}

type CreateDraftErrorResponse = {
    message: string;
}

export default async function createInvoiceDraft({
    clientDetails,
    senderDetails,
    threadId,
    flowRunId,
    userId }: InvoiceDetails): Promise<void> {
    const { name: clientName, email: clientEmail } = extractNameAndEmail(clientDetails);
    const { name: senderName, email: senderEmail } = extractNameAndEmail(senderDetails);

    try {
        console.log(process.env.PRIMARY_BACKEND_URL)
        const response = await axios.post<CreateDraftSuccessResponse>(`${process.env.PRIMARY_BACKEND_URL}/api/invoices/create-draft`, {
            clientName,
            clientEmail,
            senderName,
            senderEmail,
            threadId,
            flowRunId,
            userId
        }, {
            validateStatus: (status) => status < 500,
        }
        );

        if (response.status !== 200) {
            const errorData = response.data as CreateDraftErrorResponse;
            console.error("Failed to create invoice draft:", errorData.message);
            return;
        }

        const invoiceId = response.data.invoiceId;
        console.log("Invoice draft created successfully:", invoiceId);

        const html = `<p> Your draft invoice ID: <strong>${invoiceId}</strong></p>`;

        const { data, error } = await sendEmail({
            to: senderEmail,
            subject: "Invoice draft Created",
            htmlContent: html,
        });

        if (error) {
            console.error("Failed to send email:", error);
        } else {
            console.log("Email sent successfully:", data);
        }
    } catch (err: any) {
        console.error("Unexpected error creating invoice draft:", err?.message || err);
    }

}


type EmailParts = {
    name: string;
    email: string;
}

function extractNameAndEmail(emailString: string): EmailParts {
    let name = "";
    let email = "";

    const nameEmailRegex = /"([^"]+)"\s*<([^>]+)>/;
    const nameEmailMatch = emailString.match(nameEmailRegex);

    if (nameEmailMatch) {
        name = nameEmailMatch[1] ?? "";
        email = nameEmailMatch[2] ?? "";
    } else {
        const emailOnlyRegex = /<([^>]+)>/;
        const emailOnlyMatch = emailString.match(emailOnlyRegex);

        if (emailOnlyMatch) {
            email = emailOnlyMatch[1] ?? "";
        } else {
            email = emailString.trim();
        }
    }

    return { name, email };
}