import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useCallback, memo } from "react";
import { ArrowRight, ChefHat, LayoutDashboard, QrCode, Sparkles, Star, Clock, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageToggle, useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AURALIS — The Restaurant Operating System" },
      {
        name: "description",
        content:
          "Cinematic QR ordering, live kitchen displays, and enterprise analytics for the world's finest restaurants.",
      },
    ],
  }),
  component: Landing,
});

// ─── Static decorative orb – CSS animation, no JS frame loop ─────────────────
const GlowOrb = memo(function GlowOrb({
  style,
  className = "",
}: {
  style: React.CSSProperties;
  className?: string;
}) {
  return <div className={`glow-orb ${className}`} style={style} aria-hidden />;
});

// ─── Stat card – no animation needed, data is static ─────────────────────────
const StatCard = memo(function StatCard({
  value,
  label,
  Icon,
}: {
  value: string;
  label: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="stat-card">
      <Icon className="stat-icon" />
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
});

// ─── Feature card – CSS hover transform, no framer-motion per card ───────────
const FeatureCard = memo(function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon-wrap">
        <Icon className="feature-icon" />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-body">{body}</p>
    </div>
  );
});

// ─── Marquee – pure CSS, zero JS ─────────────────────────────────────────────
const MarqueeTicker = memo(function MarqueeTicker() {
  const items = [
    "Omakase",
    "Fine Dining",
    "QR Ordering",
    "Kitchen Display",
    "Real-time",
    "Premium",
    "Michelin",
    "Luxury",
    "Enterprise",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap" aria-hidden>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
});

// ─── Hero card – single motion.div for the whole card ────────────────────────
const HeroCard = memo(function HeroCard({ t }: { t: (k: string) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="hero-card"
    >
      <div className="hero-card-header">
        <div className="hero-card-tag">{t("landing.tonight")}</div>
        <div className="hero-card-live-dot" />
      </div>
      <div className="hero-card-title">{t("landing.omakase")}</div>
      <p className="hero-card-body">{t("landing.omakaseBody")}</p>
      <div className="hero-card-stats">
        {[
          ["18+", t("landing.courses")],
          ["96%", t("landing.returning")],
          ["★ 1", t("landing.michelin")],
        ].map(([n, l]) => (
          <div key={l} className="hero-stat">
            <div className="hero-stat-num">{n}</div>
            <div className="hero-stat-label">{l}</div>
          </div>
        ))}
      </div>
      <div className="hero-card-footer">
        <div className="hero-pulse-dot" />
        <span className="hero-pulse-text">
          <span className="hero-pulse-gold">12 tables</span> active right now
        </span>
        <span className="hero-live-badge">Live</span>
      </div>
    </motion.div>
  );
});

// ─── Main component ───────────────────────────────────────────────────────────
export default function Landing() {
  const { t } = useT();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Only GPU-composited properties: opacity + transform (translateY/scale)
  const springCfg = { stiffness: 80, damping: 25, restDelta: 0.001 };
  const heroY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 160]), springCfg);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.65], [1, 0.94]);

  const rafPending = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      lastPos.current.x = e.clientX;
      lastPos.current.y = e.clientY;
      if (rafPending.current) return;
      rafPending.current = true;
      const el = e.currentTarget;
      requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${lastPos.current.x}px`);
        el.style.setProperty("--my", `${lastPos.current.y}px`);
        rafPending.current = false;
      });
    },
    [],
  );

  return (
    <>
      {/* Perf-critical CSS injected once */}
      <style>{CSS}</style>

      <div className="page-root" onMouseMove={handleMouseMove}>
        {/* Cursor glow: pure CSS var-driven, no JS animation frame */}
        <div className="cursor-glow" aria-hidden />

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <motion.header
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="nav-bar"
        >
          <div className="nav-inner">
            <Logo />
            <nav className="nav-links">
              <a href="#experience" className="nav-link">
                {t("landing.experience")}
              </a>
              <Link to="/reserve" className="nav-link">
                {t("landing.reserve")}
              </Link>
            </nav>
            <div className="nav-right">
              <LanguageToggle />
              <Link to="/login" className="nav-cta">
                {t("landing.staffSignIn")} <ArrowRight className="nav-cta-icon" />
              </Link>
            </div>
          </div>
        </motion.header>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="hero-section">
          {/* Static bg – no animated orbs in hero, just CSS gradient layers */}
          <div className="hero-bg" aria-hidden>
            <GlowOrb style={{ left: "8%", top: "18%", width: 560, height: 560, animationDelay: "0s" }} />
            <GlowOrb style={{ left: "68%", top: "55%", width: 440, height: 440, animationDelay: "-3s" }} />
            <div className="hero-grid" />
            <div className="hero-fade" />
          </div>

          <div className="hero-inner">
            {/* Text block */}
            <motion.div
              style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
              className="hero-text"
            >
              {/* Tag */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="hero-tag"
              >
                <Sparkles className="hero-tag-icon" />
                {t("landing.tagline")}
              </motion.div>

              {/* Headline – staggered but lightweight */}
              <h1 className="hero-headline">
                {(["landing.heroLine1", "landing.heroLine2", "landing.heroLine3", "landing.heroLine4"] as const).map(
                  (key, i) => (
                    <motion.span
                      key={key}
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.75, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className={`hero-line ${key === "landing.heroLine2" ? "hero-line-gold" : ""}`}
                    >
                      {t(key)}
                      {key === "landing.heroLine2" && (
                        <motion.span
                          className="hero-underline"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                        />
                      )}
                    </motion.span>
                  ),
                )}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className="hero-body"
              >
                {t("landing.heroBody")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="hero-ctas"
              >
                <Link to="/menu" className="btn-primary">
                  {t("landing.exploreMenu")}
                  <ArrowRight className="btn-icon" />
                </Link>
                <Link to="/reserve" className="btn-ghost">
                  {t("landing.reserveTable")}
                </Link>
                <Link to="/login" className="btn-ghost">
                  {t("landing.staffPortal")}
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="social-proof"
              >
                <div className="avatar-row">
                  {["#c4a77d", "#b8936a", "#d4b896", "#a07850"].map((c, i) => (
                    <div key={i} className="avatar" style={{ background: `linear-gradient(135deg,${c},#1a1714)` }} />
                  ))}
                </div>
                <span className="social-proof-text">
                  Trusted by <span className="social-proof-gold">500+</span> luxury restaurants
                </span>
              </motion.div>
            </motion.div>

            {/* Hero card – desktop only */}
            <div className="hero-card-wrap">
              <HeroCard t={t} />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator" aria-hidden>
            <span className="scroll-label">Scroll</span>
            <div className="scroll-line" />
          </div>
        </section>

        {/* ── MARQUEE ─────────────────────────────────────────────────────── */}
        <MarqueeTicker />

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        <section className="stats-section">
          <div className="stats-grid">
            <StatCard value="500+" label="Restaurants" Icon={Star} />
            <StatCard value="2M+" label="Orders Served" Icon={ChefHat} />
            <StatCard value="99.9%" label="Uptime" Icon={Zap} />
            <StatCard value="<200ms" label="Response Time" Icon={Clock} />
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────────── */}
        <section id="experience" className="features-section">
          <div className="features-inner">
            <div className="features-header">
              <div className="section-tag">{t("landing.experienceTag")}</div>
              <h2 className="section-title">{t("landing.experienceTitle")}</h2>
              <p className="section-body">
                Every component of AURALIS is engineered for the demands of the world's finest
                establishments.
              </p>
            </div>
            <div className="features-grid">
              <FeatureCard icon={QrCode} title={t("landing.qrTitle")} body={t("landing.qrBody")} />
              <FeatureCard icon={ChefHat} title={t("landing.kitchenTitle")} body={t("landing.kitchenBody")} />
              <FeatureCard icon={LayoutDashboard} title={t("landing.adminTitle")} body={t("landing.adminBody")} />
            </div>
          </div>
        </section>

        {/* ── TONIGHT CTA ─────────────────────────────────────────────────── */}
        <section className="tonight-section">
          <div className="tonight-inner">
            <div className="tonight-card">
              <div className="tonight-bg" aria-hidden />
              <div className="section-tag">{t("landing.tonight")}</div>
              <h3 className="tonight-title">{t("landing.omakase")}</h3>
              <p className="tonight-body">{t("landing.omakaseBody")}</p>
              <div className="tonight-ctas">
                <Link to="/menu" className="btn-primary">
                  {t("landing.exploreMenu")} <ArrowRight className="btn-icon" />
                </Link>
                <Link to="/reserve" className="btn-ghost">
                  {t("landing.reserveTable")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="site-footer">
          <div className="footer-inner">
            <Logo />
            <p className="footer-copy">© {new Date().getFullYear()} {t("landing.footer")}</p>
            <div className="footer-links">
              <Link to="/login" className="footer-link">Staff Portal</Link>
              <Link to="/reserve" className="footer-link">Reserve</Link>
              <Link to="/menu" className="footer-link">Menu</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// ─── All CSS in one string – injected once, parsed once ──────────────────────
const CSS = `
/* Reset & base */
.page-root {
  position: relative;
  min-height: 100svh;
  overflow-x: hidden;
  --mx: 50vw;
  --my: 50vh;
}

/* Cursor glow – driven by CSS vars set via onMouseMove, NO animation frame */
.cursor-glow {
  position: fixed;
  pointer-events: none;
  z-index: 100;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, oklch(0.82 0.13 85 / 0.055), transparent 70%);
  mix-blend-mode: screen;
  left: calc(var(--mx) - 210px);
  top: calc(var(--my) - 210px);
  /* transform driven by CSS, no JS rAF */
  will-change: left, top;
  transition: left 0.12s linear, top 0.12s linear;
}

/* Glow orb – CSS keyframe, GPU composited */
.glow-orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, oklch(0.82 0.13 85 / 0.11), oklch(0.62 0.13 70 / 0.04), transparent 70%);
  filter: blur(60px);
  will-change: transform, opacity;
  animation: orbPulse 7s ease-in-out infinite;
  pointer-events: none;
}
@keyframes orbPulse {
  0%,100% { transform: scale(1); opacity: 0.6; }
  50%      { transform: scale(1.18); opacity: 0.85; }
}

/* Nav */
.nav-bar {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid oklch(0.82 0.13 85 / 0.18);
  background: linear-gradient(180deg, oklch(0.18 0.006 60 / 0.85), oklch(0.13 0.005 60 / 0.7));
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
}
.nav-inner {
  margin: 0 auto;
  max-width: 80rem;
  display: flex;
  height: 4rem;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}
.nav-links {
  display: none;
  align-items: center;
  gap: 2rem;
  font-size: 0.875rem;
}
@media (min-width: 768px) { .nav-links { display: flex; } }
.nav-link {
  color: oklch(0.65 0.012 80);
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link:hover { color: oklch(0.82 0.13 85); }
.nav-right { display: flex; align-items: center; gap: 0.5rem; }
.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  border: 1px solid oklch(0.82 0.13 85 / 0.18);
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s, border-color 0.2s;
}
.nav-cta:hover { background: oklch(0.22 0.008 60); border-color: oklch(0.82 0.13 85 / 0.4); }
.nav-cta-icon { width: 0.75rem; height: 0.75rem; }

/* Hero */
.hero-section {
  position: relative;
  isolation: isolate;
  display: flex;
  min-height: 100svh;
  align-items: center;
  padding: 6rem 1.5rem 4rem;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}
.hero-grid {
  position: absolute;
  inset: 0;
  opacity: 0.028;
  background-image:
    linear-gradient(oklch(0.82 0.13 85) 1px, transparent 1px),
    linear-gradient(90deg, oklch(0.82 0.13 85) 1px, transparent 1px);
  background-size: 60px 60px;
}
.hero-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, oklch(0.13 0.005 60));
}
.hero-inner {
  margin: 0 auto;
  display: grid;
  width: 100%;
  max-width: 80rem;
  gap: 4rem;
}
@media (min-width: 1024px) {
  .hero-inner { grid-template-columns: 1.2fr 1fr; align-items: center; }
}
.hero-text { display: flex; flex-direction: column; gap: 0; }

/* Hero tag */
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  border: 1px solid oklch(0.82 0.13 85 / 0.18);
  background: linear-gradient(180deg, oklch(1 0 0 / 0.04), oklch(1 0 0 / 0.01));
  backdrop-filter: blur(18px);
  padding: 0.375rem 1rem;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: oklch(0.82 0.13 85);
  width: fit-content;
  margin-bottom: 1.5rem;
}
.hero-tag-icon { width: 0.75rem; height: 0.75rem; }

/* Headline */
.hero-headline {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 7rem);
  line-height: 0.93;
  margin: 0 0 2rem;
}
.hero-line { display: block; }
.hero-line-gold {
  font-style: italic;
  background: linear-gradient(135deg, oklch(0.92 0.09 88) 0%, oklch(0.82 0.13 85) 50%, oklch(0.62 0.13 70) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
}
.hero-underline {
  display: block;
  position: absolute;
  bottom: 4px;
  left: -8px;
  right: -8px;
  height: 1px;
  background: linear-gradient(90deg, transparent, oklch(0.82 0.13 85), transparent);
  transform-origin: left;
}

.hero-body {
  font-size: 1rem;
  line-height: 1.7;
  color: oklch(0.65 0.012 80);
  max-width: 36rem;
  margin: 0 0 2.5rem;
}
.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 9999px;
  background: oklch(0.82 0.13 85);
  padding: 1rem 1.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: oklch(0.13 0.005 60);
  text-decoration: none;
  transition: background 0.2s, box-shadow 0.3s, transform 0.15s;
  will-change: transform;
}
.btn-primary:hover {
  background: oklch(0.88 0.09 88);
  box-shadow: 0 12px 40px -12px oklch(0.82 0.13 85 / 0.65);
  transform: translateY(-1px);
}
.btn-primary:active { transform: translateY(0); }
.btn-icon { width: 1rem; height: 1rem; flex-shrink: 0; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  border: 1px solid oklch(0.28 0.012 80 / 0.6);
  padding: 1rem 1.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s, border-color 0.2s;
}
.btn-ghost:hover { background: oklch(0.22 0.008 60); border-color: oklch(0.82 0.13 85 / 0.3); }

/* Social proof */
.social-proof { display: flex; align-items: center; gap: 1rem; }
.avatar-row { display: flex; }
.avatar {
  width: 2rem; height: 2rem;
  border-radius: 50%;
  border: 2px solid oklch(0.13 0.005 60);
  margin-left: -0.5rem;
}
.avatar:first-child { margin-left: 0; }
.social-proof-text { font-size: 0.75rem; color: oklch(0.65 0.012 80); }
.social-proof-gold { color: oklch(0.82 0.13 85); }

/* Hero card */
.hero-card-wrap { display: none; }
@media (min-width: 1024px) { .hero-card-wrap { display: block; } }
.hero-card {
  border-radius: 1.5rem;
  background: linear-gradient(180deg, oklch(0.18 0.006 60 / 0.85), oklch(0.13 0.005 60 / 0.7));
  backdrop-filter: blur(24px) saturate(140%);
  border: 1px solid oklch(0.82 0.13 85 / 0.12);
  box-shadow: 0 0 0 1px oklch(0.82 0.13 85 / 0.2), 0 20px 60px -20px oklch(0.82 0.13 85 / 0.35);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  /* CSS shimmer on hover – no JS */
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}
.hero-card:hover { transform: translateY(-4px) rotateY(-3deg); }
.hero-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, oklch(0.82 0.13 85 / 0.05), transparent 50%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.hero-card:hover::after { opacity: 1; }

.hero-card-header { display: flex; align-items: center; justify-content: space-between; }
.hero-card-tag {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: oklch(0.82 0.13 85);
}
.hero-card-live-dot {
  width: 0.5rem; height: 0.5rem;
  border-radius: 50%;
  background: oklch(0.72 0.19 145);
  /* CSS pulse ring */
  position: relative;
}
.hero-card-live-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid oklch(0.72 0.19 145 / 0.5);
  animation: livePing 1.6s ease-out infinite;
}
@keyframes livePing {
  0%   { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(2.2); opacity: 0; }
}

.hero-card-title { font-family: var(--font-display); font-size: 1.875rem; }
.hero-card-body { font-size: 0.875rem; color: oklch(0.65 0.012 80); }
.hero-card-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.hero-stat {
  border-radius: 1rem;
  border: 1px solid oklch(0.82 0.13 85 / 0.18);
  background: oklch(0.13 0.005 60 / 0.4);
  padding: 0.75rem;
  text-align: center;
  transition: transform 0.2s, background 0.2s;
}
.hero-stat:hover { transform: translateY(-3px); background: oklch(0.18 0.006 60 / 0.6); }
.hero-stat-num {
  font-family: var(--font-display);
  font-size: 1.25rem;
  background: linear-gradient(135deg, oklch(0.92 0.09 88), oklch(0.62 0.13 70));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-stat-label { font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.2em; color: oklch(0.65 0.012 80); }

.hero-card-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.75rem;
  background: oklch(0.13 0.005 60 / 0.4);
  padding: 0.75rem;
}
.hero-pulse-dot {
  width: 0.75rem; height: 0.75rem;
  border-radius: 50%;
  background: oklch(0.82 0.13 85);
  flex-shrink: 0;
  position: relative;
}
.hero-pulse-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: oklch(0.82 0.13 85);
  animation: livePing 2s ease-out infinite;
}
.hero-pulse-text { font-size: 0.75rem; color: oklch(0.65 0.012 80); flex: 1; }
.hero-pulse-gold { color: oklch(0.82 0.13 85); font-weight: 500; }
.hero-live-badge { font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.2em; color: oklch(0.82 0.13 85 / 0.6); }

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.scroll-label { font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.3em; color: oklch(0.65 0.012 80 / 0.4); }
.scroll-line {
  width: 1px;
  height: 3rem;
  background: linear-gradient(to bottom, oklch(0.82 0.13 85 / 0.5), transparent);
  animation: scrollPulse 2.2s ease-in-out infinite;
  transform-origin: top;
}
@keyframes scrollPulse {
  0%,100% { transform: scaleY(0.3); opacity: 0.4; }
  50%      { transform: scaleY(1);   opacity: 1; }
}

/* Marquee – pure CSS, no JS */
.marquee-wrap {
  overflow: hidden;
  border-top: 1px solid oklch(0.82 0.13 85 / 0.12);
  border-bottom: 1px solid oklch(0.82 0.13 85 / 0.12);
  padding: 1rem 0;
}
.marquee-track {
  display: flex;
  gap: 3rem;
  width: max-content;
  animation: marquee 28s linear infinite;
  will-change: transform;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  color: oklch(0.65 0.012 80 / 0.5);
  white-space: nowrap;
}
.marquee-dot { width: 0.25rem; height: 0.25rem; border-radius: 50%; background: oklch(0.82 0.13 85 / 0.4); flex-shrink: 0; }

/* Stats */
.stats-section { padding: 5rem 1.5rem; }
.stats-grid {
  margin: 0 auto;
  max-width: 80rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-radius: 1.25rem;
  overflow: hidden;
  gap: 1px;
  background: oklch(0.28 0.012 80 / 0.3);
}
@media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
.stat-card {
  background: oklch(0.17 0.006 60 / 0.3);
  padding: 2rem;
  text-align: center;
  transition: background 0.25s;
}
.stat-card:hover { background: oklch(0.82 0.13 85 / 0.05); }
.stat-icon { width: 1.25rem; height: 1.25rem; color: oklch(0.82 0.13 85 / 0.4); margin: 0 auto 0.75rem; transition: color 0.25s; }
.stat-card:hover .stat-icon { color: oklch(0.82 0.13 85); }
.stat-value {
  font-family: var(--font-display);
  font-size: 2.5rem;
  background: linear-gradient(135deg, oklch(0.92 0.09 88) 0%, oklch(0.82 0.13 85) 50%, oklch(0.62 0.13 70) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.stat-label { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.25em; color: oklch(0.65 0.012 80); margin-top: 0.25rem; }

/* Features */
.features-section { position: relative; padding: 6rem 1.5rem; overflow: hidden; }
.features-inner { margin: 0 auto; max-width: 80rem; }
.features-header { max-width: 36rem; margin-bottom: 4rem; }
.section-tag { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.3em; color: oklch(0.82 0.13 85); margin-bottom: 0.75rem; }
.section-title { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.75rem); line-height: 1.1; margin: 0 0 1rem; }
.section-body { font-size: 0.9375rem; color: oklch(0.65 0.012 80); max-width: 32rem; }
.features-grid { display: grid; gap: 1.25rem; }
@media (min-width: 768px) { .features-grid { grid-template-columns: repeat(3, 1fr); } }

/* Feature card – CSS tilt via perspective, no JS listener per card */
.feature-card {
  border-radius: 1.5rem;
  background: linear-gradient(180deg, oklch(1 0 0 / 0.04), oklch(1 0 0 / 0.01));
  backdrop-filter: blur(18px);
  border: 1px solid oklch(1 0 0 / 0.06);
  padding: 2rem;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: default;
  transition: box-shadow 0.5s, transform 0.3s;
  will-change: transform;
}
.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, oklch(0.82 0.13 85 / 0.05), transparent 50%, oklch(0.82 0.13 85 / 0.03));
  opacity: 0;
  transition: opacity 0.5s;
}
.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 0 0 1px oklch(0.82 0.13 85 / 0.2), 0 20px 60px -20px oklch(0.82 0.13 85 / 0.35);
}
.feature-card:hover::before { opacity: 1; }
.feature-icon-wrap {
  width: 3rem; height: 3rem;
  border-radius: 1rem;
  background: oklch(0.82 0.13 85 / 0.1);
  display: grid;
  place-items: center;
  margin-bottom: 1.5rem;
  transition: transform 0.3s, background 0.3s;
}
.feature-card:hover .feature-icon-wrap { transform: scale(1.1) rotate(4deg); background: oklch(0.82 0.13 85 / 0.18); }
.feature-icon { width: 1.5rem; height: 1.5rem; color: oklch(0.82 0.13 85); }
.feature-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin: 0 0 0.75rem;
  transition: background 0.5s, -webkit-background-clip 0.5s;
}
.feature-card:hover .feature-title {
  background: linear-gradient(135deg, oklch(0.92 0.09 88), oklch(0.62 0.13 70));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.feature-body { font-size: 0.875rem; line-height: 1.65; color: oklch(0.65 0.012 80); }

/* Tonight */
.tonight-section { padding: 4rem 1.5rem 6rem; }
.tonight-inner { margin: 0 auto; max-width: 80rem; }
.tonight-card {
  border-radius: 1.5rem;
  border: 1px solid oklch(0.82 0.13 85 / 0.15);
  background: linear-gradient(135deg, oklch(0.18 0.012 80 / 0.8), oklch(0.14 0.01 70 / 0.9), oklch(0.18 0.015 85 / 0.8));
  box-shadow: 0 0 80px oklch(0.82 0.13 85 / 0.08), inset 0 0 80px oklch(0.13 0.005 60 / 0.5);
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.tonight-bg {
  position: absolute;
  inset: 0;
  opacity: 0.028;
  background-image: radial-gradient(circle, oklch(0.82 0.13 85) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}
.tonight-title { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); margin: 0.5rem 0 1rem; }
.tonight-body { font-size: 0.9375rem; color: oklch(0.65 0.012 80); max-width: 32rem; margin: 0 auto 2.5rem; }
.tonight-ctas { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }

/* Footer */
.site-footer {
  border-top: 1px solid oklch(0.82 0.13 85 / 0.18);
  padding: 3rem 1.5rem;
  position: relative;
}
.site-footer::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, oklch(0.82 0.13 85 / 0.4), transparent);
}
.footer-inner {
  margin: 0 auto;
  max-width: 80rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
@media (min-width: 768px) { .footer-inner { flex-direction: row; justify-content: space-between; } }
.footer-copy { font-size: 0.75rem; color: oklch(0.65 0.012 80); text-align: center; }
.footer-links { display: flex; gap: 1rem; }
.footer-link { font-size: 0.75rem; color: oklch(0.65 0.012 80 / 0.4); text-decoration: none; transition: color 0.2s; }
.footer-link:hover { color: oklch(0.82 0.13 85); }
`;
