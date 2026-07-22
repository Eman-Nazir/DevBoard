import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { fadeUp, FEATURES } from "../../data/landingContent.js";

const FeaturesSection = () => (
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
            className="bg-gray-900 border rounded-xl p-6 hover:border-gray-600 transition-all group cursor-default border-gray-800"
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
);

export default FeaturesSection;