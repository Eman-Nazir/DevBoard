import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { fadeUp, STACK, ARCHITECTURE } from "../../data/landingContent.js";

const StackSection = () => (
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
        {ARCHITECTURE.map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${color}`}>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
            <p className="text-white text-sm font-medium">{value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default StackSection;