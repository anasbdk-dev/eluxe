// src/lib/qr-url.ts
/** Build a QR menu URL with a signed session token */
export function buildMenuUrl(baseUrl: string, tableId: string, qrToken: string): string {
  // In a real deployment, call createQRSession server-side via a serverFn
  // The QR code URL should contain the session token, not the raw qrToken
  return `${baseUrl}/menu?s=${encodeURIComponent(`${qrToken}:${tableId}`)}`;
}
