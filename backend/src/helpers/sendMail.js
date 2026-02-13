import nodemailer from "nodemailer";

async function sendMail(to, subject, text, html) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent:", info.messageId)
    }
    catch (error) {
        console.log("Email error:", error);
    }
}

export default sendMail;