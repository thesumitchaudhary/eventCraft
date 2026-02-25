import transporter from "./sendVerificationMail.js";
import { Verification_Email_Template } from "../templates/verficationEmailOtp.js";
import { Welcome_Email_Template } from "../templates/wellcomeEmailTemplate.js";
import { Event_Book_Template } from "../templates/EventBookTemplate.js";

export const SendVerificationCode = async (email, verificationCode) => {
    try {
        const html =
            typeof Verification_Email_Template === "function"
                ? Verification_Email_Template(verificationCode)
                : String(Verification_Email_Template);

        const response = await transporter.sendMail({
            from: `"EventCraft" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email",
            html,
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log("Error sending verification", error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const WellcomeEmail = async (email, firstname, lastname) => {
    try {
        const template =
            typeof Welcome_Email_Template === "function"
                ? Welcome_Email_Template()
                : String(Welcome_Email_Template);

        const html = template
            .replace("{firstname}", firstname)
            .replace("{lastname}", lastname);

        const response = await transporter.sendMail({
            from: `"EventCraft" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Wellcome To Our Community",
            text: "Wellcome To Our Community",
            html,
        });

        console.log("Email send Successfully", response);
    } catch (error) {
        console.log("Email Error", error);
    }
};

export const SendEventBookingMail = async (
    email,
    firstname,
    lastname,
    eventType,
    eventTheme,
    bookingDate,
    guestCount,
    totalAmount,
    paymentStatus,
    bookingStatus
) => {
    try {
        const template =
            typeof Event_Book_Template === "function"
                ? Event_Book_Template()
                : String(Event_Book_Template);

        const html = template
            .replaceAll("{firstname}", firstname)
            .replaceAll("{lastname}", lastname)
            .replaceAll("{email}", email)
            .replaceAll("{eventType}", eventType)
            .replaceAll("{eventTheme}", eventTheme)
            .replaceAll("{bookingDate}", bookingDate)
            .replaceAll("{guestCount}", guestCount)
            .replaceAll("{totalAmount}", totalAmount)
            .replaceAll("{paymentStatus}", paymentStatus)
            .replaceAll("{bookingStatus}", bookingStatus);

        const response = await transporter.sendMail({
            from: `"EventCraft" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // or process.env.EMAIL_USER if admin-only mail is intended
            subject: "Welcome To Our Community",
            text: "Welcome To Our Community",
            html,
        });

        console.log("Event booking email sent successfully", response);
    } catch (error) {
        console.log("Email Error", error);
    }
};