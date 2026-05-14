// src/server.ts
import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// ── Security headers applied to every response ──────────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-XSS-Protection": "1; mode=block",

  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // removed unsafe-eval
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

// ── Simple in-memory rate limiter (Cloudflare Durable Objects recommended for prod) ──
interface RateLimitEntry { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(
  ip: string,
  route: "login" | "order" | "reserve" | "api" | "default",
): boolean {
  const limits: Record<string, { max: number; windowMs: number }> = {
    login:   { max: 10,  windowMs: 60_000 },   // 10 attempts/min
    order:   { max: 20,  windowMs: 60_000 },   // 20 orders/min per IP
    reserve: { max: 5,   windowMs: 300_000 },  // 5 reservations/5min
    api:     { max: 200, windowMs: 60_000 },
    default: { max: 500, windowMs: 60_000 },
  };

  const { max, windowMs } = limits[route] ?? limits.default;
  const now = Date.now();
  const key = `${route}:${ip}`;
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  if (entry.count > max) return true;
  return false;
}

function getRateLimitRoute(pathname: string): "login" | "order" | "reserve" | "api" | "default" {
  if (pathname.includes("/login") || pathname.includes("/auth")) return "login";
  if (pathname.includes("/order")) return "order";
  if (pathname.includes("/reserve") || pathname.includes("/reservation")) return "reserve";
  if (pathname.startsWith("/api/")) return "api";
  return "default";
}

function applySecurityHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    newHeaders.set(k, v);
  }
  // Remove headers that leak server info
  newHeaders.delete("X-Powered-By");
  newHeaders.delete("Server");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

function tooManyRequestsResponse(): Response {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please slow down." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": "60",
        ...SECURITY_HEADERS,
      },
    },
  );
}

function isSuspiciousRequest(request: Request): boolean {
  const ua = request.headers.get("user-agent") ?? "";
  const suspicious = [
    /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i,
    /python-requests/i, /go-http-client/i, /curl\//i,
  ];
  // Allow curl in development — remove this exception in production
  if (suspicious.some((re) => re.test(ua))) return true;

  // Block obviously malformed accept headers
  const accept = request.headers.get("accept") ?? "";
  if (accept === "" && request.method === "POST") return true;

  return false;
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: {
      "content-type": "text/html; charset=utf-8",
      ...SECURITY_HEADERS,
    },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try { payload = JSON.parse(body); } catch { return false; }
  if (!payload || Array.isArray(payload) || typeof payload !== "object") return false;
  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) return false;
  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) return response;
  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    const ip = request.headers.get("cf-connecting-ip")
      ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? "unknown";

    // Block suspicious scanners/bots
    if (isSuspiciousRequest(request)) {
      console.warn(`[SECURITY] Blocked suspicious request from ${ip}: ${url.pathname}`);
      return new Response("Forbidden", { status: 403, headers: SECURITY_HEADERS });
    }

    // Rate limiting
    const route = getRateLimitRoute(url.pathname);
    if (isRateLimited(ip, route)) {
      console.warn(`[RATE_LIMIT] ${ip} hit limit on ${route}: ${url.pathname}`);
      return tooManyRequestsResponse();
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return applySecurityHeaders(normalized);
    } catch (error) {
      console.error("[SERVER_ERROR]", error);
      return brandedErrorResponse();
    }
  },
};
