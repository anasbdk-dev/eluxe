import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, type Role } from "@/hooks/useAuth";

interface Props {
  allow: Role[];
  children: React.ReactNode;
}

export function AuthGuard({ allow, children }: Props) {
  const { loading, user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (!role || !allow.includes(role)) {
      navigate({ to: "/login" });
    }
  }, [loading, user, role, allow, navigate]);

  if (loading || !user || !role || !allow.includes(role)) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <div className="font-display text-2xl gold-text">AURALIS</div>
          <div className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">Authenticating…</div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
