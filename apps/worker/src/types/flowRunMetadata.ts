export interface BaseFlowRunMetadata {
    type: string;
    userId: number;
}

export interface EmailFlowRunMetadata extends BaseFlowRunMetadata {
    type: "EMAIL",
    emailMetadata: {
        from: string;
        to: string;
        attachment: string[];
    },
}

export interface TogglFlowRunMetadata extends BaseFlowRunMetadata {
    type: "NOTIFICATION",
    reportDay: number;
    connectedAccountId: number;
}

export type FlowRunMetadata = EmailFlowRunMetadata;

export function hasEmailMetadata(metadata: any): metadata is EmailFlowRunMetadata {
    return (
        metadata &&
        metadata.type === "GMAIL_LABEL" &&
        typeof metadata.userId === "number" &&
        metadata.emailMetadata &&
        typeof metadata.emailMetadata.from === "string" &&
        typeof metadata.emailMetadata.to === "string" &&
        typeof metadata.emailMetadata.threadId === "string"
    )
}

export function hasTogglMetadata(metadata: any): metadata is TogglFlowRunMetadata {
    return (
        metadata &&
        metadata.type === "NOTIFICATION" &&
        typeof metadata.userId === "number" &&
        typeof metadata.reportDay === "number" &&
        typeof metadata.connectedAccountId === "number"
    )
}