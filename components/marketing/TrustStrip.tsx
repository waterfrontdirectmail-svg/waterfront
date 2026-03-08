"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "20,000+", label: "Verified Waterfront Addresses" },
  { value: "2", label: "Counties Covered" },
  { value: "100%", label: "Navigable Waterways" },
  { value: "0%", label: "Wasted Postage" },
];

const TrustStrip = () => (
  <section className="bg-deep-navy border-b border-white/[0.06]">
    <div className="container-max px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <p className="text-2xl sm:text-3xl font-serif font-bold text-brass-gold leading-none">{s.value}</p>
            <p className="text-[11px] sm:text-xs text-white/50 font-medium tracking-wide uppercase mt-1.5">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStrip;
