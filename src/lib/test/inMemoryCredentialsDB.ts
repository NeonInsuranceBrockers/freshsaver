// src/lib/test/inMemoryCredentialsDB.ts

interface Credential {
  id: string;
  name: string;
  type: "API_KEY" | "OAUTH";
  secret: string; // The sensitive data, simulated here
  metadata: Record<string, unknown>;
}

const initialCredentials: Credential[] = [
  // Credential for the Partner Integration Node (Grocery Order)
  {
    id: "cred-alpha-100",
    name: "Grocery Partner API Key",
    type: "API_KEY",
    secret: "sk_live_groc_xyz123abc",
    metadata: {
      partnerName: "GroceryMart",
      endpoint: "https://api.grocerymart.com",
    },
  },
  // Credential for the Smart Fridge Webhook/Partner Integration
  {
    id: "cred-beta-200",
    name: "Smart Fridge Endpoint Token",
    type: "OAUTH",
    secret: "oauth_fridge_token_999",
    metadata: {
      deviceId: "FSR-4000",
    },
  },
  // Credential that will be intentionally missing in the flow config
  {
    id: "cred-test-missing",
    name: "Placeholder Credential",
    type: "API_KEY",
    secret: "placeholder_secret",
    metadata: {},
  },
];

const credentialStore = new Map<string, Credential>(
  initialCredentials.map((c) => [c.id, c])
);

/**
 * Retrieves a credential by its ID (referenced in the flow node config).
 * Simulates the secure lookup of sensitive data during flow execution.
 *
 * @param credentialId The ID stored in the flow node configuration.
 * @returns The Credential object or null if not found.
 */
export function getCredentialById(credentialId: string): Credential | null {
  // Simulate asynchronous database retrieval
  return credentialStore.get(credentialId) || null;
}
