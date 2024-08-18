import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Email Verification",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });
        console.log("Email sent successfully", response);
    } catch (error) {
        console.log("Error sending email", error);
        throw new Error("Error sending email", error);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "abe59a35-6dcc-4503-8f65-4e62bad74d47",
            template_variables: {
                "company_info_name": "Leave Management System",
                "name": name
            }
        });

        console.log("Welcome Email sent successfully", response);

    } catch (error) {
        console.log("Error sending email", error);
        throw new Error("Error sending email", error);
    }
};