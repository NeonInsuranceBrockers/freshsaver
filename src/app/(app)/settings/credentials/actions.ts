// /app/(app)/settings/credentials/actions.ts
"use server";

import prisma from "@/lib/db/prisma";
import { encrypt } from "@/lib/server/crypto";

interface SaveCredentialPayload {
  name: string;
  apiKey: string;
}

export async function saveAiApiKeyAction(
  payload: SaveCredentialPayload
): Promise<{ success: boolean; message: string; credentialId?: string }> {
  try {
    if (!payload.name || !payload.apiKey) {
      return { success: false, message: "Name and API Key are required." };
    }

    // Encrypt the API key before saving it
    const encryptedKey = encrypt(payload.apiKey);

    const newCredential = await prisma.credential.create({
      data: {
        name: payload.name,
        type: "AI_API_KEY", // A new type for these keys
        secret: encryptedKey,
        metadata: { provider: "OpenAI" }, // Store which provider it's for
      },
    });

    return {
      success: true,
      message: "API Key saved successfully.",
      credentialId: newCredential.id,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to save AI API key:", error);
    return {
      success: false,
      message: "An error occurred while saving the key.",
    };
  }
}
