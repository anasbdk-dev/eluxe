import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, ChefHat, LayoutDashboard, QrCode, Sparkles, Star, Clock, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageToggle, useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AURALIS — The Restaurant Operating System" },
      { name: "description", content: "Cinematic QR ordering, live kitchen displays, and enterprise analytics for the world's finest restaurants." },
    ],
  }),
  component: Landing,
});

// Floating particle component
function Particle({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, oklch(0.82 0.13 85 / 0.6), oklch(0.82 0.13 85 / 0))`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Animated counter
function Counter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {value}{suffix}
    </motion.span>
  );
}

// Section reveal animation
function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Magnetic button effect
function MagneticButton({ children, className = "", to }: { children: React.ReactNode; className?: string; to: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPos({ x, y });
  };

  return (
    <motion.div
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      <Link ref={ref} to={to} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}

// Glowing orb background effect
function GlowOrb({ x, y, size, color }: { x: string; y: string; size: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none blur-3xl"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// Feature card with hover tilt
function FeatureCard({ icon: Icon, title, body, index }: { icon: any; title: string; body: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 12;
    setTilt({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: 10 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ transformStyle: "preserve-3d" }}
        className="rounded-3xl glass p-8 hover:gold-glow transition-all duration-500 cursor-default group relative overflow-hidden h-full"
      >
        {/* Shimmer on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, oklch(0.82 0.13 85 / 0.05) 0%, transparent 50%, oklch(0.82 0.13 85 / 0.03) 100%)",
          }}
        />
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="h-12 w-12 rounded-2xl bg-gold/10 grid place-items-center text-gold mb-6"
        >
          <Icon className="h-6 w-6" />
        </motion.div>
        <h3 className="font-display text-2xl mb-3 group-hover:gold-text transition-all duration-500">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      </motion.div>
    </motion.div>
  );
}

// Scrolling ticker text
function MarqueeTicker() {
  const items = ["Omakase", "Fine Dining", "QR Ordering", "Kitchen Display", "Real-time", "Premium", "Michelin", "Luxury", "Enterprise"];
  return (
    <div className="relative overflow-hidden py-4 border-y hairline my-0">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground/50 flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-gold/40 inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Landing() {
  const { t } = useT();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const heroY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), springConfig);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.92]);
  const titleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), springConfig);

  // Particles config
  const particles = Array.from({ length: 18 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 4,
    duration: Math.random() * 4 + 4,
  }));

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ scrollBehavior: "smooth" }}>
      {/* Custom cursor glow */}
      <motion.div
        className="fixed pointer-events-none z-[100] rounded-full mix-blend-screen"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, oklch(0.82 0.13 85 / 0.06), transparent 70%)",
          x: cursorPos.x - 200,
          y: cursorPos.y - 200,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 40 }}
      />

      {/* ── NAVBAR ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-40 border-b hairline glass-strong"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {["experience", "reserve"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {item === "reserve" ? (
                  <Link to="/reserve" className="text-muted-foreground hover:text-gold transition-colors">
                    {t("landing.reserve")}
                  </Link>
                ) : (
                  <a href="#experience" className="text-muted-foreground hover:text-gold transition-colors">
                    {t("landing.experience")}
                  </a>
                )}
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2"
          >
            <LanguageToggle />
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-secondary hover:border-gold/40 transition-all"
            >
              {t("landing.staffSignIn")} <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative isolate flex min-h-screen items-center px-6 pt-24 overflow-hidden"
        onMouseEnter={() => setIsHoveringHero(true)}
        onMouseLeave={() => setIsHoveringHero(false)}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <GlowOrb x="10%" y="20%" size={600} color="oklch(0.82 0.13 85 / 0.12)" />
          <GlowOrb x="70%" y="60%" size={500} color="oklch(0.62 0.13 70 / 0.08)" />
          <GlowOrb x="40%" y="80%" size={400} color="oklch(0.82 0.13 85 / 0.06)" />

          {/* Animated grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(oklch(0.82 0.13 85) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.13 85) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Floating particles */}
          {particles.map((p, i) => (
            <Particle key={i} {...p} />
          ))}

          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          {/* Hero text */}
          <motion.div style={{ y: titleY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 rounded-full border hairline glass px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-gold mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-3 w-3" />
              </motion.div>
              {t("landing.tagline")}
            </motion.div>

            <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.92] text-balance">
              {["landing.heroLine1", "landing.heroLine2", "landing.heroLine3", "landing.heroLine4"].map((key, i) => (
                <motion.span
                  key={key}
                  initial={{ opacity: 0, y: 40, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                  style={{ transformOrigin: "left center", perspective: 800 }}
                >
                  {key === "landing.heroLine2" ? (
                    <span className="gold-text italic relative">
                      {t(key)}
                      <motion.span
                        className="absolute -inset-x-2 bottom-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </span>
                  ) : (
                    t(key)
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground"
            >
              {t("landing.heroBody")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <MagneticButton
                to="/menu"
                className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:bg-gold-soft transition-all hover:shadow-[0_12px_40px_-12px_oklch(0.82_0.13_85_/_0.7)] active:scale-95"
              >
                {t("landing.exploreMenu")}
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </MagneticButton>

              <Link
                to="/reserve"
                className="inline-flex items-center gap-2 rounded-full border hairline px-7 py-4 text-sm font-medium hover:bg-secondary hover:border-gold/30 transition-all"
              >
                {t("landing.reserveTable")}
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border hairline px-7 py-4 text-sm font-medium hover:bg-secondary transition-all"
              >
                {t("landing.staffPortal")}
              </Link>
            </motion.div>

            {/* Social proof dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {["#c4a77d", "#b8936a", "#d4b896", "#a07850"].map((c, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background" style={{ background: `linear-gradient(135deg, ${c}, oklch(0.13 0.005 60))` }} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                Trusted by <span className="text-gold">500+</span> luxury restaurants
              </span>
            </motion.div>
          </motion.div>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: heroY, perspective: 1000 }}
            className="hidden lg:block"
          >
            <motion.div
              whileHover={{ rotateY: -5, rotateX: 3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              style={{ transformStyle: "preserve-3d" }}
              className="space-y-3 rounded-3xl glass-strong p-6 gold-border gold-glow relative overflow-hidden"
            >
              {/* Card shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
                style={{
                  background: "linear-gradient(90deg, transparent, oklch(0.82 0.13 85 / 0.06), transparent)",
                }}
              />

              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{t("landing.tonight")}</div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-emerald-400"
                />
              </div>

              <div className="font-display text-3xl">{t("landing.omakase")}</div>
              <p className="text-sm text-muted-foreground">{t("landing.omakaseBody")}</p>

              <div className="grid grid-cols-3 gap-3 pt-3 text-center">
                {[
                  ["18+", t("landing.courses"), "★"],
                  ["96%", t("landing.returning"), "↑"],
                  ["★ 1", t("landing.michelin"), "✦"],
                ].map(([n, l, icon], i) => (
                  <motion.div
                    key={l}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.05 }}
                    className="rounded-2xl border hairline bg-background/40 px-3 py-3 cursor-default transition-all"
                  >
                    <div className="font-display text-xl gold-text">{n}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{l}</div>
                  </motion.div>
                ))}
              </div>

              {/* Live orders indicator */}
              <div className="mt-2 rounded-xl bg-background/40 p-3 flex items-center gap-3">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-gold" />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gold"
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  <span className="text-gold font-medium">12 tables</span> active right now
                </span>
                <span className="ms-auto text-[10px] uppercase tracking-wider text-gold/60">Live</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <MarqueeTicker />

      {/* ── STATS BAR ── */}
      <RevealSection className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/30 rounded-2xl overflow-hidden">
            {[
              { value: "500+", label: "Restaurants", icon: Star },
              { value: "2M+", label: "Orders Served", icon: ChefHat },
              { value: "99.9%", label: "Uptime", icon: Zap },
              { value: "<200ms", label: "Response Time", icon: Clock },
            ].map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-card/30 p-8 text-center group hover:bg-gold/5 transition-colors"
              >
                <Icon className="h-5 w-5 text-gold/40 mx-auto mb-3 group-hover:text-gold transition-colors" />
                <div className="font-display text-4xl gold-text">
                  <Counter value={value} />
                </div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── EXPERIENCE / FEATURES ── */}
      <section id="experience" className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <GlowOrb x="80%" y="20%" size={500} color="oklch(0.82 0.13 85 / 0.05)" />
          <GlowOrb x="5%" y="70%" size={400} color="oklch(0.62 0.13 70 / 0.05)" />
        </div>

        <div className="mx-auto max-w-7xl">
          <RevealSection className="mb-16 max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-3">{t("landing.experienceTag")}</div>
            <h2 className="font-display text-5xl md:text-6xl leading-tight">{t("landing.experienceTitle")}</h2>
            <p className="mt-4 text-muted-foreground max-w-lg">
              Every component of AURALIS is engineered for the demands of the world's finest establishments.
            </p>
          </RevealSection>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: QrCode, title: t("landing.qrTitle"), body: t("landing.qrBody") },
              { icon: ChefHat, title: t("landing.kitchenTitle"), body: t("landing.kitchenBody") },
              { icon: LayoutDashboard, title: t("landing.adminTitle"), body: t("landing.adminBody") },
            ].map((p, i) => (
              <FeatureCard key={p.title} {...p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TONIGHT SECTION ── */}
      <RevealSection className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            whileInView={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
            viewport={{ once: false }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="rounded-3xl overflow-hidden relative p-12 md:p-20 text-center"
            style={{
              background: "linear-gradient(135deg, oklch(0.18 0.012 80 / 0.8), oklch(0.14 0.01 70 / 0.9), oklch(0.18 0.015 85 / 0.8))",
              border: "1px solid oklch(0.82 0.13 85 / 0.15)",
              boxShadow: "0 0 80px oklch(0.82 0.13 85 / 0.08), inset 0 0 80px oklch(0.13 0.005 60 / 0.5)",
            }}
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, oklch(0.82 0.13 85) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-[11px] uppercase tracking-[0.4em] text-gold mb-4">{t("landing.tonight")}</div>
              <h3 className="font-display text-4xl md:text-6xl mb-4">{t("landing.omakase")}</h3>
              <p className="text-muted-foreground max-w-xl mx-auto mb-10">{t("landing.omakaseBody")}</p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:bg-gold-soft transition-all hover:shadow-[0_12px_40px_-12px_oklch(0.82_0.13_85_/_0.8)]"
                >
                  {t("landing.exploreMenu")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/reserve"
                  className="inline-flex items-center gap-2 rounded-full border hairline px-8 py-4 text-sm font-medium hover:bg-white/5 transition-all"
                >
                  {t("landing.reserveTable")}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </RevealSection>

      {/* ── FOOTER ── */}
      <footer className="border-t hairline px-6 py-12 relative overflow-hidden">
        <motion.div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, oklch(0.82 0.13 85 / 0.4), transparent)" }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} {t("landing.footer")}
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground/40">
            <Link to="/login" className="hover:text-gold transition-colors">Staff Portal</Link>
            <Link to="/reserve" className="hover:text-gold transition-colors">Reserve</Link>
            <Link to="/menu" className="hover:text-gold transition-colors">Menu</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
