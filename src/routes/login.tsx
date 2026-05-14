import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { LanguageToggle, useT } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Staff Login — AURALIS" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user, role, loading } = useAuth();
  const { t } = useT();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: role === "kitchen" ? "/kitchen" : "/admin" });
    }
  }, [loading, user, role, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) toast.error(error);
    else toast.success(t("login.welcome"));
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-end"><LanguageToggle /></div>
        <div className="mb-10 flex justify-center"><Logo /></div>
        <div className="rounded-3xl glass-strong p-8 gold-glow">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold">{t("login.tag")}</div>
            <h1 className="mt-3 font-display text-3xl">{t("login.title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("login.body")}</p>
          </div>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field icon={Mail} label={t("login.email")}>
              <input
                required type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="input-base"
              />
            </Field>
            <Field icon={Lock} label={t("login.password")}>
              <input
                required type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="input-base"
              />
            </Field>
            <button
              disabled={busy}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-gold-soft disabled:opacity-60"
            >
              {busy ? t("login.signing") : <>{t("common.signIn")} <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        </div>
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-gold">{t("login.returnLanding")}</Link>
        </div>
      </div>
      <style>{`
        .input-base { width:100%; background: oklch(0.13 0.005 60 / 0.6); border:1px solid var(--color-border); border-radius:12px; padding:14px 16px 14px 44px; font-size:14px; color: var(--color-foreground); }
        [dir="rtl"] .input-base { padding: 14px 44px 14px 16px; }
        .input-base:focus { outline:none; border-color: var(--color-gold); box-shadow: 0 0 0 3px oklch(0.82 0.13 85 / 0.18); }
      `}</style>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}
