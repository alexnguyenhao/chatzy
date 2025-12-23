import sgMail from "@sendgrid/mail";
import logger from "../lib/logger.lib.js";

/**
 * Initialize SendGrid with API key
 */
const initializeSendGrid = () => {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    logger.warn(
      "SendGrid API key not found. Email functionality will be disabled."
    );
    return false;
  }

  sgMail.setApiKey(apiKey);
  logger.success("SendGrid initialized successfully");
  return true;
};

// Initialize on module load
const isInitialized = initializeSendGrid();

/**
 * Send email using SendGrid
 * @param {Object} emailData - { to, subject, html, text }
 */
export const sendEmail = async (emailData) => {
  if (!isInitialized) {
    console.error("❌ SendGrid not initialized. Cannot send email.");
    console.error("Please check SENDGRID_API_KEY in .env file");
    return;
  }

  try {
    console.log("📧 Preparing to send email...");
    console.log("  → To:", emailData.to);
    console.log("  → Subject:", emailData.subject);
    console.log(
      "  → From:",
      process.env.SENDGRID_FROM_EMAIL || "noreply@chatzy.com"
    );

    const msg = {
      to: emailData.to,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@chatzy.com",
      fromName: process.env.SENDGRID_FROM_NAME || "Chatzy",
      subject: emailData.subject,
      text: emailData.text || "",
      html: emailData.html,
    };

    console.log("📨 Sending email via SendGrid...");
    const response = await sgMail.send(msg);
    console.log("✅ Email sent successfully!");
    console.log("  → Response status:", response[0]?.statusCode);

    logger.success(`Email sent to ${emailData.to}`);
  } catch (error) {
    console.error("❌ SendGrid error occurred!");
    console.error("  → Error message:", error.message);
    console.error("  → Error code:", error.code);

    if (error.response) {
      console.error(
        "  → SendGrid response:",
        JSON.stringify(error.response.body, null, 2)
      );
    }

    logger.error("SendGrid error:", error);
    throw error;
  }
};

export default sendEmail;
