// types/flowHandlers.ts

import { EmailMetadata } from "../types/flowRunMetadata";

export type ClientOnboardingInput = {
    invoiceId: string;
    emailMetadata: EmailMetadata;
};

export type TestimonialRequestInput = {
    emailMetadata: EmailMetadata;
    testimonialFormUrl: string;
};
