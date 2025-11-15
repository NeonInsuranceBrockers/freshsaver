// /lib/server/crypto.ts
import crypto from "crypto";

const algorithm = "aes-256-cbc";

// 1. Get the key from environment variables
const secretKey = process.env.ENCRYPTION_KEY;

if (!secretKey) {
  throw new Error("ENCRYPTION_KEY is not defined in the .env file.");
}

// 2. Decode the Base64 key into a Buffer. This is the main fix.
// The key in the .env file is a 44-character Base64 string representing 32 bytes.
const key = Buffer.from(secretKey, "base64");

// 3. Validate the BYTE length of the DECODED key, not the original string length.
if (key.byteLength !== 32) {
  throw new Error(
    "Invalid ENCRYPTION_KEY: It must be a Base64 encoded string that decodes to 32 bytes."
  );
}

const IV_LENGTH = 16; // For AES-256-CBC, the IV is always 16 bytes

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  // The update and final methods return Buffers, which should be concatenated
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  // Return the IV and the encrypted data as a single hex string, separated by a colon
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
  const textParts = text.split(":");

  // The first part is the IV
  const ivString = textParts.shift();
  if (!ivString) {
    throw new Error("Invalid encrypted text format: IV is missing.");
  }
  const iv = Buffer.from(ivString, "hex");

  // The rest is the encrypted data
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  // Concatenate the decrypted buffers
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
