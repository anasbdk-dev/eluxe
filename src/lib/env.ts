// src/lib/env.ts — validate all required env vars at startup
const requiredVars = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
] as const;

const requiredServerVars = [
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "QR_SIGNING_SECRET",
] as const;

export function validateClientEnv(): void {
  const missing = requiredVars.filter((v) => !import.meta.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  // Ensure we're not accidentally using service role on the client
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";
  if (publishableKey.includes("service_role")) {
    throw new Error("CRITICAL: Service role key must never be used on the client side");
  }
}

export function validateServerEnv(): void {
  const missing = requiredServerVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing required server environment variables: ${missing.join(", ")}`);
  }
}
