// /app/api/notify/email/route.ts

import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Get the API key from environment variables
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;

// Set the API key for the SendGrid mail client
if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
} else {
  console.error(
    "SendGrid API Key is not configured. Email sending will be disabled."
  );
}

/**
 * API Route to send an email.
 * Expects a POST request with `to`, `subject`, and `body`.
 */
export async function POST(request: Request) {
  // 1. Validate server configuration
  if (!sendgridApiKey || !fromEmail) {
    return NextResponse.json(
      {
        success: false,
        error: "Email service is not configured on the server.",
      },
      { status: 500 }
    );
  }

  try {
    // 2. Parse request body
    const body = await request.json();
    const { to, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing 'to', 'subject', or 'message' field.",
        },
        { status: 400 }
      );
    }

    console.log(`[Email API] Attempting to send email to: ${to}`);

    // 3. Construct the message payload for SendGrid
    const msg = {
      to: to,
      from: fromEmail, // Use your verified sender email
      subject: subject,
      html: `<p>${message}</p>`, // You can use HTML in the body
      text: message, // A plain text version for compatibility
    };

    // 4. Send the email
    await sgMail.send(msg);

    console.log(`[Email API] Email sent successfully to ${to}`);

    // 5. Return success response
    return NextResponse.json({
      success: true,
      message: "Email sent successfully.",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Email API] Error sending SendGrid email:", error);
    if (error.response) {
      console.error(error.response.body); // SendGrid provides detailed error info
    }
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}
