import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChefHat, LayoutDashboard, QrCode, Sparkles, Utensils } from "lucide-react";
import { Logo } from "@/components/Logo";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AURALIS — The Restaurant Operating System" },
      { name: "description", content: "Cinematic QR ordering, live kitchen displays, and enterprise analytics for the world's finest restaurants." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-40 border-b hairline glass-strong">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#experience" className="text-muted-foreground hover:text-gold">Experience</a>
            <a href="#system" className="text-muted-foreground hover:text-gold">System</a>
            <Link to="/reserve" className="text-muted-foreground hover:text-gold">Reserve</Link>
          </nav>
          <Link to="/admin" className="hidden md:inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-secondary">
            Staff Portal <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate flex min-h-screen items-center px-6 pt-24">
        <div className="absolute inset-0 -z-10">
          <img src={hero} alt="" width={1920} height={1280} className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 rounded-full border hairline glass px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-gold"
            >
              <Sparkles className="h-3 w-3" /> The Restaurant OS
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1 }}
              className="mt-6 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-balance"
            >
              Where every<br />
              <span className="gold-text italic">table</span> becomes<br />
              an experience.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground"
            >
              AURALIS is the operating system behind the world's most demanding kitchens —
              instant QR ordering, real-time kitchen orchestration, and an enterprise-grade
              admin built for the calm precision of fine dining.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/menu"
                search={{ table: "1" }}
                className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-gold-soft hover:shadow-[0_20px_60px_-15px_oklch(0.82_0.13_85_/_0.6)]"
              >
                Explore Menu <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/reserve" className="inline-flex items-center gap-2 rounded-full border hairline px-7 py-4 text-sm font-medium hover:bg-secondary">
                Reserve a Table
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="space-y-3 rounded-3xl glass-strong p-6 gold-border">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Tonight at AURALIS</div>
              <div className="font-display text-3xl">Seven-course Omakase</div>
              <p className="text-sm text-muted-foreground">An evolving menu shaped by tonight's market and the chef's intuition. Reserved for thirty guests.</p>
              <div className="grid grid-cols-3 gap-3 pt-3 text-center">
                {[["18+", "Courses"], ["96%", "Returning"], ["★ 1", "Michelin"]].map(([n, l]) => (
                  <div key={l} className="rounded-2xl border hairline bg-background/40 px-3 py-3">
                    <div className="font-display text-xl gold-text">{n}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
          Scroll
        </div>
      </section>

      {/* PILLARS */}
      <section id="experience" className="relative px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold">The Experience</div>
            <h2 className="mt-3 font-display text-5xl">An ecosystem, end to end.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: QrCode, title: "Smart QR Tables", body: "Each table has its own destiny. One scan opens the menu — table identity flows automatically into every order.", to: "/menu", search: { table: "12" }, cta: "Try a guest table" },
              { icon: ChefHat, title: "Live Kitchen Display", body: "Tickets land instantly with timers, table context, and status pipeline tuned for tablet-mounted kitchens.", to: "/kitchen", cta: "Open kitchen" },
              { icon: LayoutDashboard, title: "Enterprise Admin", body: "Menu, orders, tables, reservations, and revenue analytics in one cohesive command center.", to: "/admin", cta: "Open admin" },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl glass p-8 hover:gold-glow transition-shadow"
              >
                <p.icon className="h-8 w-8 text-gold" />
                <h3 className="mt-6 font-display text-2xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <Link
                  to={p.to as string}
                  search={p.search as never}
                  className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold hover:gap-3 transition-all"
                >
                  {p.cta} <ArrowRight className="h-3 w-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section id="system" className="relative px-6 pb-32">
        <div className="mx-auto max-w-7xl rounded-[2rem] glass-strong p-10 md:p-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Demo access</div>
              <h2 className="mt-3 font-display text-4xl text-balance">Walk through every surface.</h2>
              <p className="mt-4 text-muted-foreground">
                Three coordinated environments — guest, kitchen, management — built to feel like one continuous service.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <QuickLink to="/menu" search={{ table: "5" }} icon={Utensils} label="Guest menu" sub="Table 5" />
              <QuickLink to="/menu" search={{ table: "VIP1" }} icon={Sparkles} label="VIP suite" sub="VIP 1" />
              <QuickLink to="/kitchen" icon={ChefHat} label="Kitchen display" sub="Live tickets" />
              <QuickLink to="/admin" icon={LayoutDashboard} label="Admin" sub="Full dashboard" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t hairline px-6 py-10 text-center text-xs text-muted-foreground">
        <Logo className="justify-center" />
        <p className="mt-4">© {new Date().getFullYear()} AURALIS Hospitality Systems. Crafted for fine dining.</p>
      </footer>
    </div>
  );
}

function QuickLink({ to, search, icon: Icon, label, sub }: any) {
  return (
    <Link
      to={to}
      search={search}
      className="group flex items-center gap-4 rounded-2xl border hairline bg-background/40 p-4 transition-all hover:border-gold/40 hover:bg-secondary"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1">
        <span className="block font-medium">{label}</span>
        <span className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{sub}</span>
      </span>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-gold" />
    </Link>
  );
}
