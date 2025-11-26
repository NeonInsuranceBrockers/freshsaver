// /app/(app)/settings/credentials/actions.ts
"use server";

import prisma from "@/lib/db/prisma";
import { encrypt } from "@/lib/server/crypto";
import { getAuthenticatedUser } from "@/lib/auth/session";

interface SaveCredentialPayload {
  name: string;
  apiKey: string;
}

export async function saveAiApiKeyAction(
  payload: SaveCredentialPayload
): Promise<{ success: boolean; message: string; credentialId?: string }> {
  try {
    // 1. Secure the action
    const user = await getAuthenticatedUser();

    if (!payload.name || !payload.apiKey) {
      return { success: false, message: "Name and API Key are required." };
    }

    // 2. Encrypt the API key before saving it
    const encryptedKey = encrypt(payload.apiKey);

    // 3. Create Credential scoped to the Organization
    const newCredential = await prisma.credential.create({
      data: {
        userId: user.id, // The specific user who added it
        organizationId: user.organizationId, // The organization that owns it
        name: payload.name,
        type: "AI_API_KEY",
        secret: encryptedKey,
        metadata: { provider: "OpenAI" },
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
