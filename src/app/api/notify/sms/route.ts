// /app/api/notify/sms/route.ts

import { NextResponse } from "next/server";
import twilio from "twilio";

// Initialize the Twilio client using the credentials from your .env file
// The Twilio library automatically looks for these environment variables.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * API Route to send an SMS message.
 * Expects a POST request with a JSON body containing `to` and `body`.
 */
export async function POST(request: Request) {
  // 1. Validate that all required environment variables are present.
  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error("Twilio environment variables are not configured.");
    return NextResponse.json(
      { success: false, error: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    // 2. Parse the request body to get the recipient's number and the message.
    const body = await request.json();
    const { to, message } = body;

    // 3. Basic validation for the incoming data.
    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: "Missing 'to' or 'message' field." },
        { status: 400 }
      );
    }

    // In a production app, you would add more robust validation for the 'to' phone number format.

    console.log(`[SMS API] Attempting to send SMS to: ${to}`);

    // 4. Use the Twilio client to send the SMS.
    const twilioResponse = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to, // The recipient's phone number
    });

    console.log(
      `[SMS API] Twilio message sent successfully. SID: ${twilioResponse.sid}`
    );

    // 5. Return a success response.
    return NextResponse.json({ success: true, messageSid: twilioResponse.sid });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[SMS API] Error sending Twilio message:", error);

    // Return a structured error response.
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send SMS." },
      { status: 500 }
    );
  }
}
