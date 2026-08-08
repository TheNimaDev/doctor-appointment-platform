/** Parameters required to send an email. */
export interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}
