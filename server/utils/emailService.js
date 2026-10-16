const nodemailer = require("nodemailer");

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials are not configured.");
    }

    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS.replace(/\s/g, ""),
        },
    });
};

const sendEmail = async ({ to, subject, text, html }) => {
    if (!to || !subject || (!text && !html)) {
        throw new Error("Recipient, subject and content are required.");
    }

    const transporter = createTransporter();

    return transporter.sendMail({
        from: {
            name: process.env.EMAIL_FROM_NAME || "Medical Equipment Store",
            address: process.env.EMAIL_USER,
        },
        to,
        subject,
        text,
        html,
    });
};

module.exports = { sendEmail };
