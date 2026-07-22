import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Zap, ChevronRight } from "lucide-react";
import { fadeUp, PLAN_FEATURES } from "../../data/landingContent.js";

const PricingSection = () => (
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
          className="lg:col-span-3 bg-gray-900 border border-violet-500/30 rounded-2xl p-5 sm:p-8 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-between flex-wrap gap-y-2 mb-6">
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

        {/*  info cards */}
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
);

export default PricingSection;