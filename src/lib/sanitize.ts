// src/lib/sanitize.ts

/** Strip HTML tags to prevent stored XSS */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/** Sanitize user-facing text fields */
export function sanitizeText(input: string, maxLen = 500): string {
  return stripHtml(input)
    .replace(/[<>"'`]/g, "")
    .slice(0, maxLen)
    .trim();
}

/** Validate that a string is a safe URL (only http/https) */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/** Validate image URL points to an allowed domain/format */
export function isAllowedImageUrl(url: string): boolean {
  if (!isSafeUrl(url)) return false;
  const parsed = new URL(url);
  const allowedHosts = [
    "images.unsplash.com",
    "cdn.supabase.co",
    // Add your CDN domains here
  ];
  if (!allowedHosts.some((h) => parsed.hostname.endsWith(h))) return false;
  const ext = parsed.pathname.split(".").pop()?.toLowerCase() ?? "";
  return ["jpg", "jpeg", "png", "webp", "avif"].includes(ext);
}

/** Schema for order notes — strip anything suspicious */
export const safeNoteSchema = (maxLen = 500) =>
  (input: unknown) => {
    if (typeof input !== "string") return "";
    return sanitizeText(input, maxLen);
  };
