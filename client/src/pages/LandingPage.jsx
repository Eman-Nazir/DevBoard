import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Kanban, Users, BarChart2,
  Zap, Shield, GitBranch, ArrowRight, Check,
  Star, Globe, Lock, Activity, Bell, Code2,
  ChevronRight, Sparkles,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const FEATURES = [
  { icon: Kanban, title: "Kanban boards", desc: "Drag-and-drop task management with real-time sync across your team. Every move is instant.", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
  { icon: Users, title: "Team workspaces", desc: "Multi-tenant workspaces with role-based access. Admins, members, and viewers each see what they need.", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  { icon: Zap, title: "Real-time updates", desc: "Socket.io powers live presence. See your teammates' changes the moment they happen — no refresh needed.", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  { icon: BarChart2, title: "Analytics dashboard", desc: "Burndown charts, velocity tracking, and completion rates. Know exactly where your project stands.", color: "text-green-400 bg-green-400/10 border-green-400/20" },
  { icon: Shield, title: "Secure by default", desc: "JWT auth with refresh token rotation, RBAC on every endpoint, and rate limiting built in.", color: "text-red-400 bg-red-400/10 border-red-400/20" },
  { icon: GitBranch, title: "GitHub integration", desc: "Link your repo to a project. Push and PR events appear in your activity feed automatically.", color: "text-gray-400 bg-gray-400/10 border-gray-400/20" },
];

const STACK = [
  { name: "React 18", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20" },
  { name: "Node.js", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  { name: "Express", color: "text-gray-400", bg: "bg-gray-400/10 border-gray-400/20" },
  { name: "MongoDB", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  { name: "Socket.io", color: "text-white", bg: "bg-white/5 border-white/10" },
  { name: "JWT Auth", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20" },
  { name: "Tailwind CSS", color: "text-sky-400", bg: "bg-sky-400/10 border-sky-400/20" },
  { name: "Framer Motion", color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20" },
  { name: "React Query", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  { name: "Recharts", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  { name: "Mongoose", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  { name: "Zod", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
];

const PLAN_FEATURES = [
  { text: "Unlimited workspaces", icon: Globe },
  { text: "Unlimited projects & tasks", icon: Kanban },
  { text: "Real-time collaboration", icon: Zap },
  { text: "Analytics & burndown charts", icon: BarChart2 },
  { text: "GitHub webhook integration", icon: GitBranch },
  { text: "Role-based access control", icon: Lock },
  { text: "Activity logs", icon: Activity },
  { text: "Real-time notifications", icon: Bell },
];

const STATS = [
  { value: "6", label: "Core modules built" },
  { value: "20+", label: "API endpoints" },
  { value: "100%", label: "Real-time sync" },
  { value: "0", label: "Setup required" },
];

// ── Kanban preview cards ───────────────────────────────────────────────────────
const KanbanPreview = () => (
  <div className="relative w-full max-w-2xl mx-auto mt-16">
    {/* Glow behind the preview */}
    <div className="absolute inset-0 bg-violet-600/20 blur-3xl rounded-3xl" />

    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
      {/* Fake topbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-950">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <div className="flex-1 mx-4 h-5 bg-gray-800 rounded-md" />
        <div className="w-16 h-5 bg-violet-600/40 rounded-md" />
      </div>

      {/* Fake kanban columns */}
      <div className="flex gap-3 p-4 overflow-hidden">
        {[
          { title: "Todo", color: "#6366f1", tasks: ["Set up auth", "Design DB schema"], count: 2 },
          { title: "In Progress", color: "#f59e0b", tasks: ["Build API endpoints", "Kanban drag-drop"], count: 2 },
          { title: "Done", color: "#10b981", tasks: ["Project setup", "MongoDB connect"], count: 2 },
        ].map((col, ci) => (
          <div key={ci} className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-2.5 px-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="text-white text-xs font-medium">{col.title}</span>
              <span className="text-gray-600 text-xs bg-gray-800 px-1.5 rounded-full ml-auto">{col.count}</span>
            </div>
            <div className="space-y-2">
              {col.tasks.map((task, ti) => (
                <motion.div
                  key={ti}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.15 + ti * 0.1 }}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-2.5"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: col.color + "20",
                        color: col.color,
                        fontSize: "10px",
                      }}
                    >
                      {ti === 0 ? "high" : "medium"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs font-medium">{task}</p>
                  <div className="flex items-center justify-end mt-2">
                    <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs">
                      {["A", "B", "C"][ci]}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── NavBar ─────────────────────────────────────────────────────────────────────
const NavBar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
    <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center">
          <LayoutDashboard size={14} className="text-white" />
        </div>
        <span className="text-white font-semibold text-sm tracking-tight">DevBoard</span>
      </div>
      <div className="hidden sm:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full p-1">
        {[
          { href: "#features", label: "Features" },
          { href: "#stack", label: "Stack" },
          { href: "#pricing", label: "Pricing" },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="relative text-gray-400 hover:text-white text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors duration-200 hover:bg-white/[0.06]"
          >
            {label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Sign in</Link>
        <Link to="/register" className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
          Get started
        </Link>
      </div>
    </div>
  </nav>
);

// ── Page ───────────────────────────────────────────────────────────────────────
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <NavBar />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-8 px-6 text-center relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1.5 rounded-full mb-6">
              <Sparkles size={11} />
              Full-stack MERN · Real-time · Production-ready
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
          >
            Project management
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              built for devs
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            DevBoard gives dev teams a real-time Kanban board, analytics dashboard,
            and GitHub integration — all in one clean, fast interface.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex items-center justify-center gap-3 flex-wrap mb-8"
          >
            <Link to="/register"
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-600/25 hover:-translate-y-0.5"
            >
              Start for free <ArrowRight size={16} />
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Sign in
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex items-center justify-center gap-8 flex-wrap mb-4"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-white text-2xl font-bold">{value}</p>
                <p className="text-gray-600 text-xs">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Kanban preview */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <KanbanPreview />
        </motion.div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 border-t border-gray-800/60">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-medium text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1.5 rounded-full mb-4 inline-block">
              Everything you need
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Not another bloated PM tool
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Just the features dev teams actually use — built with the stack they already know.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className={`bg-gray-900 border rounded-xl p-6 hover:border-gray-600 transition-all group cursor-default border-gray-800`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${color}`}>
                  <Icon size={18} />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1 mt-4 text-gray-700 group-hover:text-violet-400 transition-colors">
                  <span className="text-xs">Learn more</span>
                  <ChevronRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ────────────────────────────────────────────────────────── */}
      <section id="stack" className="py-20 px-6 border-t border-gray-800/60 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-medium text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1.5 rounded-full mb-4 inline-block">
              Tech stack
            </span>
            <h2 className="text-3xl font-bold mb-4">Built with modern tools</h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm">
              Every technology chosen for a reason — scalable, maintainable, and production-ready.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {STACK.map(({ name, color, bg }, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl border font-medium cursor-default transition-all ${color} ${bg}`}
              >
                <Code2 size={13} />
                {name}
              </motion.span>
            ))}
          </motion.div>

          {/* Architecture callout */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { label: "Frontend", value: "React + Vite + Tailwind + Framer Motion", color: "border-cyan-500/30 bg-cyan-500/5" },
              { label: "Backend", value: "Node.js + Express + Socket.io + JWT", color: "border-green-500/30 bg-green-500/5" },
              { label: "Database", value: "MongoDB Atlas + Mongoose + Indexes", color: "border-amber-500/30 bg-amber-500/5" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-xl border p-4 text-center ${color}`}>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
                <p className="text-white text-sm font-medium">{value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 border-t border-gray-800/60">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-medium text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full mb-4 inline-block">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple. Free. Forever.</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              No credit card. No limits. No hidden fees. Just sign up and start building.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Main pricing card */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="lg:col-span-3 bg-gray-900 border border-violet-500/30 rounded-2xl p-8 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-2xl">Free</span>
                      <span className="text-xs bg-violet-600/20 text-violet-400 border border-violet-400/20 px-2 py-0.5 rounded-full font-medium">
                        Forever
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">Everything included from day one</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-white">$0</p>
                    <p className="text-gray-600 text-xs">/ month</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                  {PLAN_FEATURES.map(({ text, icon: Icon }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-violet-400" />
                      </div>
                      <span className="text-gray-300 text-sm">{text}</span>
                    </div>
                  ))}
                </div>

                <Link to="/register"
                  className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-600/20"
                >
                  Create your workspace <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Side info cards */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-6"
              >
                <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center mb-4">
                  <Star size={18} className="text-amber-400" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">Open source ready</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Full MERN stack codebase. Deploy anywhere — Vercel, Render, Railway, or your own server.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
                className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-6"
              >
                <div className="w-10 h-10 bg-green-400/10 border border-green-400/20 rounded-xl flex items-center justify-center mb-4">
                  <Zap size={18} className="text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">Up in seconds</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Register, create a workspace, invite your team, and start tracking — all in under a minute.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}
                className="bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/20 rounded-2xl p-6"
              >
                <p className="text-white font-semibold text-sm mb-1">Ready to ship? 🚀</p>
                <p className="text-gray-400 text-xs mb-3">Join devs already using DevBoard</p>
                <Link to="/register"
                  className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                >
                  Get started free <ChevronRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800/60 py-10 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center">
                <LayoutDashboard size={14} className="text-white" />
              </div>
              <span className="text-white font-semibold text-sm">DevBoard</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Features</a>
              <a href="#stack" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Stack</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Pricing</a>
              <Link to="/login" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Sign in</Link>
              <Link to="/register" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Register</Link>
            </div>
          </div>
          <div className="border-t border-gray-800/60 pt-6 flex items-center justify-between flex-wrap gap-3">
            <p className="text-gray-700 text-xs">
              Built with React · Node.js · MongoDB · Socket.io · Tailwind CSS
            </p>
            <p className="text-gray-700 text-xs">DevBoard — Project management for dev teams</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;