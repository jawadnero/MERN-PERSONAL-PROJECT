const nodeMailer = require("nodemailer");


const sendEmail = async(to, subject, text) => {
    try {
        const host = process.env.EMAIL_HOST || "smtp.gmail.com";
        const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
        const secure = process.env.EMAIL_SECURE === "true";

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
        }

        const transporter = nodeMailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail