"use client";
import { motion } from "framer-motion";

const rows = [
  { feature: "Water Types Included", generic: "Lakes, ponds, retention areas, canals", ours: "Navigable waterways only" },
  { feature: "Homeowner Profile", generic: "Mixed, many without boats", ours: "Verified dock, lift, or seawall access" },
  { feature: "Geographic Focus", generic: "Broad regional coverage", ours: "Hyper-local by city, ZIP, or neighborhood" },
  { feature: "Waste Rate", generic: "High — many irrelevant addresses", ours: "Near zero — every address is qualified" },
  { feature: "Campaign Execution", generic: "You source, design, print, and mail", ours: "Full-service from data to delivery" },
];

const ProblemSolution = () => (
  <section className="section-padding bg-background">
    <div className="container-max max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 sm:mb-14"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-brass-gold mb-3">The Difference</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Not All Waterfront Lists Are Equal.
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Generic mailing lists include lakefront homes, retention ponds, and neighborhoods where no one owns a boat. Here is how our data compares.
        </p>
      </motion.div>

      {/* Desktop table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="hidden sm:block"
      >
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="py-4 px-5 text-left text-xs font-semibold tracking-wider uppercase text-muted-foreground bg-secondary" />
                <th className="py-4 px-5 text-left text-xs font-semibold tracking-wider uppercase text-muted-foreground bg-secondary">
                  Generic Lists
                </th>
                <th className="py-4 px-5 text-left text-xs font-semibold tracking-wider uppercase text-brass-gold bg-deep-navy">
                  Waterfront Direct Mail
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-4 px-5 font-medium text-foreground text-[13px]">{row.feature}</td>
                  <td className="py-4 px-5 text-muted-foreground">{row.generic}</td>
                  <td className="py-4 px-5 text-white font-medium bg-deep-navy/[0.97]">{row.ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Mobile: stacked cards per row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="sm:hidden space-y-4"
      >
        {rows.map((row, i) => (
          <div key={i} className="border border-border rounded-xl overflow-hidden">
            <div className="bg-secondary px-4 py-3">
              <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{row.feature}</p>
            </div>
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/60 mb-1">Generic Lists</p>
              <p className="text-sm text-muted-foreground">{row.generic}</p>
            </div>
            <div className="px-4 py-3 bg-deep-navy">
              <p className="text-[10px] font-semibold tracking-wider uppercase text-brass-gold mb-1">Waterfront Direct Mail</p>
              <p className="text-sm text-white font-medium">{row.ours}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ProblemSolution;
