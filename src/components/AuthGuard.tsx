// src/components/AuthGuard.tsx — hardened version
import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, type Role } from "@/hooks/useAuth";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

interface Props {
  allow: Role[];
  children: React.ReactNode;
}

export function AuthGuard({ allow, children }: Props) {
  const { loading, user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const lastActivityRef = useRef(Date.now());

  // Auto sign-out on inactivity
  useEffect(() => {
    const updateActivity = () => { lastActivityRef.current = Date.now(); };
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, updateActivity, { passive: true }));

    const timer = setInterval(async () => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT_MS) {
        await signOut();
        navigate({ to: "/login" });
      }
    }, 60_000); // check every minute

    return () => {
      events.forEach((e) => window.removeEventListener(e, updateActivity));
      clearInterval(timer);
    };
  }, [signOut, navigate]);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (!role || !allow.includes(role)) {
      // Log unauthorized access attempt
      console.warn(`[SECURITY] Unauthorized route access by ${user.email} (role: ${role})`);
      navigate({ to: "/login" });
    }
  }, [loading, user, role, allow, navigate]);

  if (loading || !user || !role || !allow.includes(role)) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <div className="font-display text-2xl gold-text">ELUXE</div>
          <div className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Authenticating…
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
