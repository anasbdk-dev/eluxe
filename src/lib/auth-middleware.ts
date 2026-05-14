// src/lib/auth-middleware.ts
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type AppRole = "admin" | "kitchen";

interface AuthContext {
  userId: string;
  role: AppRole;
  email: string;
}

/**
 * Middleware that validates JWT + role server-side.
 * Use this on ANY server function that touches sensitive data.
 */
export function requireRole(allowedRoles: AppRole[]) {
  return createMiddleware({ type: "function" }).server(async ({ next }) => {
    const request = getRequest();
    if (!request?.headers) {
      throw new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify role in DB — never trust JWT claims alone
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .in("role", allowedRoles)
      .limit(1)
      .single();

    if (!roleData) {
      // Log privilege escalation attempt
      console.warn(`[SECURITY] Unauthorized role access attempt by user ${data.user.id}`);
      throw new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return next({
      context: {
        userId: data.user.id,
        role: roleData.role as AppRole,
        email: data.user.email ?? "",
      } satisfies AuthContext,
    });
  });
}
