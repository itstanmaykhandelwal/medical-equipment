
require("dotenv").config();
const { sendEmail } = require("./utils/emailService");

async function testEmail() {
    try {
        const result = await sendEmail({
            to: process.env.EMAIL_USER,
            subject: "Medical Equipment - Email Test",
            text: "Congratulations! Your backend email service is working.",
            html: "<h2>Email setup successful!</h2><p>Your backend can now send emails.</p>",
        });

        console.log("Email sent successfully!");
        console.log("Message ID:", result.messageId);
    } catch (error) {
        console.error("Email test failed:", error.message);
    }
}

testEmail();
