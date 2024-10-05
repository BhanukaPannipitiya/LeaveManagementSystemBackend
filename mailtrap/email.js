import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";
import {transporter} from "./nodemailer.js";

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

export const sendAdminEmail = async (email, verificationToken) => {
    try {
        const mailOptions = {
          from: 'no-reply@yourapp.com',
          to: email,
          subject: 'Password verification OTP',
          text: `Your OTP code is: ${verificationToken}. It is valid for 15 minutes.`
        };
    
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
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

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });

        console.log("Password Reset Email sent successfully", response);

    } catch (error) {
        console.log("Error sending Password Reset Email", error);
        throw new Error("Error sending Password Reset Email", error);
    }
}

export const sendPasswordResetSuccessEmail = async (email) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        });

        console.log("Password Reset Success Email sent successfully", response);

    } catch (error) {
        console.log("Error sending Password Reset Success Email", error);
        throw new Error("Error sending Password Reset Success Email", error);
    }
}