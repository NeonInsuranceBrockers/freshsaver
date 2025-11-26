// /app/api/ai/generate/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db/prisma";
import { decrypt } from "@/lib/server/crypto";
import OpenAI from "openai";

/**
 * AI Proxy API Route
 * Receives a prompt and a credentialId, then securely calls the OpenAI API.
 * SECURED: Only allows access to credentials owned by the user's organization.
 */
export async function POST(request: Request) {
  try {
    // 1. Authenticate the User
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Authorize via Database (Get Organization ID)
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { organizationId: true, status: true },
    });

    if (!user || user.status === "UNAUTHORIZED" || !user.organizationId) {
      return NextResponse.json(
        { success: false, error: "Access Denied: No Organization linked." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { prompt, credentialId } = body;

    // 3. Validate incoming request
    if (!prompt || !credentialId) {
      return NextResponse.json(
        { success: false, error: "Missing 'prompt' or 'credentialId'." },
        { status: 400 }
      );
    }

    // 4. Fetch the encrypted credential SCOPED to the Organization
    // We use findFirst instead of findUnique to add the organizationId filter
    const credential = await prisma.credential.findFirst({
      where: {
        id: credentialId,
        organizationId: user.organizationId, // <--- CRITICAL SECURITY CHECK
      },
    });

    // --- DEMO MODE CHECK ---
    let decryptedApiKey: string = "";
    let useDemoMode = false;

    if (!credential) {
      console.warn(
        `[AI API] Credential ${credentialId} not found for Org ${user.organizationId}. Switching to Demo Mode.`
      );
      // Note: In a real strict app, we might just error here.
      // But for your demo flow, we fall back to mock data if the key is missing/inaccessible.
      useDemoMode = true;
    } else {
      // 5. Decrypt the API key on the server
      try {
        decryptedApiKey = decrypt(credential.secret);
      } catch (error) {
        console.error("Failed to decrypt API key:", error);
        useDemoMode = true;
      }
    }

    let recipeSuggestion = "";

    if (!useDemoMode) {
      try {
        const openai = new OpenAI({
          apiKey: decryptedApiKey,
        });

        console.log(
          `[AI API] Calling OpenAI for credential: ${credential?.name}`
        );

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that provides creative recipe ideas.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 150,
        });

        recipeSuggestion =
          completion.choices[0]?.message?.content?.trim() || "";
      } catch (error) {
        console.error(
          "[AI API] OpenAI call failed. Switching to Demo Mode.",
          error
        );
        useDemoMode = true;
      }
    }

    // --- FALLBACK MOCK RESPONSE ---
    if (useDemoMode || !recipeSuggestion) {
      recipeSuggestion = `[DEMO MODE] Here is a simulated recipe based on your prompt: "${prompt}". \n\n1. Mix ingredients.\n2. Cook at 350°F.\n3. Enjoy your saved food! \n\n(Please configure a valid OpenAI API Key in your Organization Settings to get real AI suggestions.)`;
    }

    console.log(`[AI API] Returning response (Demo: ${useDemoMode})`);

    // 6. Return the successful response
    return NextResponse.json({
      success: true,
      data: {
        title: useDemoMode
          ? "Demo Recipe Suggestion"
          : "AI Generated Recipe Idea",
        suggestion: recipeSuggestion,
        isDemo: useDemoMode,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[AI API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred with the AI service.",
      },
      { status: 500 }
    );
  }
}
