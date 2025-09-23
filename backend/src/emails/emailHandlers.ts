import { resendClient, sender } from "../configs/resend.ts";
import { createWelcomeEmailTemplate } from "./emailTemplates.ts";

export const sendWelcomeEmail = async (email: string, name: string, clientURL: string) => {

    try {
        const { data, error } = await resendClient.emails.send({
            from: `${sender.name} <${sender.email}>`,
            to: email,
            subject: 'Welcome to Our Service!',
            html: createWelcomeEmailTemplate(name, clientURL),
        });

        if(error) {
            console.error('Error sending welcome email:', error);
            return;
        }

        console.log('Welcome email sent:', data);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};