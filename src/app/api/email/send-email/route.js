import { sendEmail } from "@/integration/sendGrid";
import fs from "fs";

export async function POST(req) {
  const body = await req.text();
  const parsedBody = JSON.parse(body);
  const { to, from, subject, html, attachments } = parsedBody;

  if (!to || !from || !subject || !html) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Missing required fields",
      }),
      {
        status: 400,
      }
    );
  }

  let emailAttachments = [];

  if (attachments && attachments.length) {
    emailAttachments = attachments.map((attachment) => {
      const { content, filename, contentType } = attachment;
      if (!content || !filename || !contentType) {
        return null;
      }

      try {
        // Write the base64 content to a file for testing
        const base64Data = content.split(",")[1]; // Clean up base64 data
        fs.writeFileSync(`./${filename}`, base64Data, "base64"); // Use 'base64' encoding
      } catch (error) {
        console.error("Error writing attachment to file:", error);
      }

      return {
        content: content.split(",")[1],
        filename: filename,
        type: contentType,
        disposition: "attachment",
      };
    });
  }
  return await sendEmail({
    to,
    from,
    subject,
    html,
    // attachments: emailAttachments?.length > 0 ? emailAttachments : undefined,
    attachments: emailAttachments,
  })
    .then((response) => {
      console.log("Email sent successfully:", response);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email sent successfully",
        }),
        {
          status: 200,
        }
      );
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error sending email",
          error: error.message,
        }),
        {
          status: 500,
        }
      );
    });
}
