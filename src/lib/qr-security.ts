// src/lib/qr-security.ts
import { createHmac, randomBytes } from "crypto";

const QR_SECRET = process.env.QR_SIGNING_SECRET ?? "change-me-in-production-32chars!!";
const QR_SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4-hour sessions

export interface QRSessionPayload {
  tableId: string;
  qrToken: string;   // The static token from DB (used as lookup key)
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

/** Create a signed, time-limited session URL for a table QR code */
export function createQRSession(tableId: string, qrToken: string): string {
  const payload: QRSessionPayload = {
    tableId,
    qrToken,
    issuedAt: Date.now(),
    expiresAt: Date.now() + QR_SESSION_TTL_MS,
    nonce: randomBytes(8).toString("hex"),
  };

  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString("base64url");
  const signature = createHmac("sha256", QR_SECRET).update(encoded).digest("hex");

  return `${encoded}.${signature}`;
}

/** Verify a QR session token and return payload or null if invalid */
export function verifyQRSession(sessionToken: string): QRSessionPayload | null {
  try {
    const [encoded, signature] = sessionToken.split(".");
    if (!encoded || !signature) return null;

    const expectedSig = createHmac("sha256", QR_SECRET).update(encoded).digest("hex");

    // Constant-time comparison to prevent timing attacks
    if (!timingSafeEqual(signature, expectedSig)) return null;

    const payload: QRSessionPayload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf-8"),
    );

    if (Date.now() > payload.expiresAt) return null;

    return payload;
  } catch {
    return null;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/** Generate a short-lived order nonce to prevent replay attacks */
export function generateOrderNonce(): string {
  return randomBytes(16).toString("hex");
}
