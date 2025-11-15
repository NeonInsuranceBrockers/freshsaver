// /app/api/ai/generate/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { decrypt } from "@/lib/server/crypto";
import OpenAI from "openai";

/**
 * AI Proxy API Route
 * Receives a prompt and a credentialId, then securely calls the OpenAI API.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, credentialId } = body;

    // 1. Validate incoming request
    if (!prompt || !credentialId) {
      return NextResponse.json(
        { success: false, error: "Missing 'prompt' or 'credentialId'." },
        { status: 400 }
      );
    }

    // 2. Fetch the encrypted credential from the database
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
    });

    if (!credential) {
      return NextResponse.json(
        { success: false, error: "AI credential not found." },
        { status: 404 } // Not Found
      );
    }

    // 3. Decrypt the API key on the server
    let decryptedApiKey: string;
    try {
      decryptedApiKey = decrypt(credential.secret);
    } catch (error) {
      console.error("Failed to decrypt API key:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Could not process credential. It may be corrupted.",
        },
        { status: 500 }
      );
    }

    // 4. Initialize the OpenAI client with the user's key
    const openai = new OpenAI({
      apiKey: decryptedApiKey,
    });

    console.log(`[AI API] Calling OpenAI for credential: ${credential.name}`);

    // 5. Make the call to the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or any other model
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides creative recipe ideas.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150, // Limit the response length
    });

    const recipeSuggestion = completion.choices[0]?.message?.content?.trim();

    if (!recipeSuggestion) {
      throw new Error("OpenAI returned an empty response.");
    }

    console.log(`[AI API] OpenAI call successful.`);

    // 6. Return the successful response
    return NextResponse.json({
      success: true,
      data: {
        title: "AI Generated Recipe Idea", // We can parse this better in a real app
        suggestion: recipeSuggestion,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[AI API] Error:", error);

    // 7. Handle specific errors from OpenAI (like an invalid key)
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { success: false, error: "Invalid OpenAI API Key provided." },
          { status: 401 } // Unauthorized
        );
      }
    }

    // Handle generic errors
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred with the AI service.",
      },
      { status: 500 }
    );
  }
}
