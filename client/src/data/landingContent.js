import {
  Kanban, Users, Zap, BarChart2, Shield, GitBranch,
  Globe, Lock, Activity, Bell,
} from "lucide-react";

// Static marketing data for LandingPage — kept separate from rendering

export const FEATURES = [
  { icon: Kanban, title: "Kanban boards", desc: "Drag-and-drop task management with real-time sync across your team. Every move is instant.", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
  { icon: Users, title: "Team workspaces", desc: "Multi-tenant workspaces with role-based access. Admins, members, and viewers each see what they need.", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  { icon: Zap, title: "Real-time updates", desc: "Socket.io powers live presence. See your teammates' changes the moment they happen — no refresh needed.", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  { icon: BarChart2, title: "Analytics dashboard", desc: "Burndown charts, velocity tracking, and completion rates. Know exactly where your project stands.", color: "text-green-400 bg-green-400/10 border-green-400/20" },
  { icon: Shield, title: "Secure by default", desc: "JWT auth with refresh token rotation, RBAC on every endpoint, and rate limiting built in.", color: "text-red-400 bg-red-400/10 border-red-400/20" },
  { icon: GitBranch, title: "GitHub integration", desc: "Link your repo to a project. Push and PR events appear in your activity feed automatically.", color: "text-gray-400 bg-gray-400/10 border-gray-400/20" },
];

export const STACK = [
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

export const ARCHITECTURE = [
  { label: "Frontend", value: "React + Vite + Tailwind + Framer Motion", color: "border-cyan-500/30 bg-cyan-500/5" },
  { label: "Backend", value: "Node.js + Express + Socket.io + JWT", color: "border-green-500/30 bg-green-500/5" },
  { label: "Database", value: "MongoDB Atlas + Mongoose + Indexes", color: "border-amber-500/30 bg-amber-500/5" },
];

export const PLAN_FEATURES = [
  { text: "Unlimited workspaces", icon: Globe },
  { text: "Unlimited projects & tasks", icon: Kanban },
  { text: "Real-time collaboration", icon: Zap },
  { text: "Analytics & burndown charts", icon: BarChart2 },
  { text: "GitHub webhook integration", icon: GitBranch },
  { text: "Role-based access control", icon: Lock },
  { text: "Activity logs", icon: Activity },
  { text: "Real-time notifications", icon: Bell },
];

export const STATS = [
  { value: "6", label: "Core modules built" },
  { value: "20+", label: "API endpoints" },
  { value: "100%", label: "Real-time sync" },
  { value: "0", label: "Setup required" },
];

export const KANBAN_PREVIEW_COLUMNS = [
  { title: "Todo", color: "#6366f1", tasks: ["Set up auth", "Design DB schema"], count: 2 },
  { title: "In Progress", color: "#f59e0b", tasks: ["Build API endpoints", "Kanban drag-drop"], count: 2 },
  { title: "Done", color: "#10b981", tasks: ["Project setup", "MongoDB connect"], count: 2 },
];

export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#stack", label: "Stack" },
  { href: "#pricing", label: "Pricing" },
];

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};