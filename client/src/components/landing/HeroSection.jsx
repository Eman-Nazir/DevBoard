import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { fadeUp, STATS } from "../../data/landingContent.js";
import KanbanPreview from "./KanbanPreview.jsx";

const HeroSection = () => (
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
);

export default HeroSection;