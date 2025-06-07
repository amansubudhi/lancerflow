import { EmailMetadata, FlowRunMetadata, InvoiceMeta, TestimonialMeta } from "../types/flowRunMetadata";


export function generateInvoiceEmailHTML(props: InvoiceMeta): string {
  const { clientName, userName, userEmail, pdfUrl } = props;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; line-height: 1.6;">
      <p>Hi ${clientName},</p>

      <p>I hope you're doing well! I'm happy to let you know that the work we discussed has been completed and delivered.</p>

      <p>Please find the invoice for this work below:</p>

      <p>
        <a href="${pdfUrl}" style="background-color: #4F46E5; color: white; padding: 10px 16px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Invoice
        </a>
      </p>

      <p>Feel free to review the invoice and let me know if you have any questions. If everything looks good, you can proceed with the payment at your convenience.</p>

      <p>Thank you for the opportunity — it’s always a pleasure collaborating with you!</p>

      <p style="margin-top: 24px;">
        Best regards,<br/>
        ${userName}<br/>
        ${userEmail}
      </p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ccc;" />

      <p style="font-size: 12px; color: #777; text-align: center;">
        This invoice was generated and sent via <strong>LancerFlow</strong>.
      </p>
    </div>
  `;
}


export function generateTestimonialHTML(props: TestimonialMeta): string {
  const { formUrl, userName, userEmail } = props;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; line-height: 1.6;">
      <p>Hi there,</p>

      <p>Thank you for working with me. Your feedback means a lot and helps me improve.</p>

      <p>Please take a moment to share your experience by filling out this short testimonial form:</p>

      <p>
        <a href="${formUrl}" style="background-color: #4F46E5; color: white; padding: 10px 16px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Leave Your Testimonial
        </a>
      </p>

      <p>If you have any questions, just reply to this email — I’m happy to help.</p>

      <p style="margin-top: 24px;">
        Best regards,<br/>
        ${userName}<br/>
        ${userEmail}
      </p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ccc;" />

      <p style="font-size: 12px; color: #777; text-align: center;">
        This email was sent via <strong>LancerFlow</strong>.
      </p>
    </div>
  `;
}


export function generateFollowUpEmail(props: InvoiceMeta) {
  const { clientName, pdfUrl, userName } = props;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; line-height: 1.6;">
      <p>Hi ${clientName},</p>

      <p>I hope you're doing well. Just a friendly reminder that the invoice I shared with you is still pending.</p>

      <p>If you’ve already completed the payment, please ignore this message. Otherwise, you can view the invoice using the button below:</p>

      <div style="text-align: center; margin: 24px 0;">
        <a href=${pdfUrl} style="background-color: #007bff; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: bold;">
          View Invoice
        </a>
      </div>

      <p>If you have any questions or concerns, feel free to reply to this email — I’m happy to assist!</p>

      <p>Thanks again,<br />
      ${userName}</p>
  </div>
  `
}
