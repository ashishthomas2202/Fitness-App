// utils/sendgridHelper.js
// const sgMail = require("@sendgrid/mail");
import sgMail from "@sendgrid/mail";

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email using SendGrid
 * @param {string} to - The recipient's email address
 * @param {string} from - The sender's email address
 * @param {string} subject - The subject of the email
 * @param {string} html - The HTML body of the email
 * @returns {Promise} - A promise that resolves when the email is sent
 */
const sendEmail = async ({ to, from, subject, html, attachments }) => {
  const msg = {
    to,
    from,
    subject,
    html,
    attachments: attachments,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("Error details:", error.response.body);
    }
  }
};

module.exports = { sendEmail };
