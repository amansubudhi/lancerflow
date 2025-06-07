export type EmailType = "invoice" | "testimonial" | "weeklyReport";

type BaseEmailMetadata = {
    emailType: EmailType;
    userName: string;
    userEmail: string;
    clientName: string;
    clientEmail: string;
};

interface InvoiceEmailMetadata extends BaseEmailMetadata {
    emailType: "invoice";
    pdfUrl: string;
}

interface TestimonialEmailMetadata extends BaseEmailMetadata {
    emailType: "testimonial";
    formUrl: string;
}

// interface FollowUpEmailMetadata extends BaseEmailMetadata {
//     pdfUrl: string;
// }

export type EmailMetadata = InvoiceEmailMetadata | TestimonialEmailMetadata;

export type InvoiceMeta = Extract<EmailMetadata, { emailType: "invoice" }>;
export type TestimonialMeta = Extract<EmailMetadata, { emailType: "testimonial" }>;



export type FlowRunMetadata =
    | {
        type: "CLIENT_ONBOARDING";
        invoiceId: string;
        emailMetadata: EmailMetadata
    } |
    {
        type: "SCHEDULE";
        clientId: number;
        emailMetadata: EmailMetadata
    }
// {
//     type: "DELAY";
//     invoiceId: string;
//     emailMetadata: FollowUpEmailMetadata
// }

// export type EmailMetadata =
//     | (BaseEmailMetadata & {
//         emailType: "INVOICE";
//         pdfUrl?: string;
//     })

//     | (BaseEmailMetadata & {
//         emailType: "TESTIMONIAL_REQUEST";
//         formUrl: string;
//     })


// export type FlowRunMetadata =
//     | {
//         type: "CLIENT_ONBOARDING";
//         invoiceId: string;
//         emailMetadata: Extract<EmailMetadata, { emailType: "INVOICE" }>;
//     }

//     | {
//         type: "SCHEDULE";
//         clientId?: number;
//         emailMetadata: Extract<EmailMetadata, { emailType: "TESTIMONIAL_REQUEST" }>;
//     }
// export type EmailType = "INVOICE" | "WEEKLY_REPORT" | "THANK_YOU" | "TESTIMONIAL_REQUEST";

// export type EmailMetadata = {
//     emailType: EmailType;
//     pdfUrl?: string;
//     userName: string;
//     userEmail: string;
//     clientName: string;
//     clientEmail: string;
// };

// export type FlowRunMetadata =
//     | {
//         type: "CLIENT_ONBOARDING";
//         invoiceId: string;
//         emailMetadata: EmailMetadata;
//     } |
//     {
//         type: "SCHEDULE";
//         clientId: number;
//         emailMetadata: EmailMetadata;
//     }

// export interface BaseFlowRunMetadata {
//     type: string;
//     userId: number;
// }

// export interface EmailFlowRunMetadata extends BaseFlowRunMetadata {
//     type: "EMAIL",
//     emailMetadata: {
//         from: string;
//         to: string;
//         attachment: string[];
//     },
// }

// export interface TogglFlowRunMetadata extends BaseFlowRunMetadata {
//     type: "NOTIFICATION",
//     reportDay: number;
//     connectedAccountId: number;
// }

// export type FlowRunMetadata = EmailFlowRunMetadata;

// export function hasEmailMetadata(metadata: any): metadata is EmailFlowRunMetadata {
//     return (
//         metadata &&
//         metadata.type === "GMAIL_LABEL" &&
//         typeof metadata.userId === "number" &&
//         metadata.emailMetadata &&
//         typeof metadata.emailMetadata.from === "string" &&
//         typeof metadata.emailMetadata.to === "string" &&
//         typeof metadata.emailMetadata.threadId === "string"
//     )
// }

// export function hasTogglMetadata(metadata: any): metadata is TogglFlowRunMetadata {
//     return (
//         metadata &&
//         metadata.type === "NOTIFICATION" &&
//         typeof metadata.userId === "number" &&
//         typeof metadata.reportDay === "number" &&
//         typeof metadata.connectedAccountId === "number"
//     )
// }