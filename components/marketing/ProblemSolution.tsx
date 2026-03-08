"use client";
import { X, Check } from "lucide-react";
import { motion } from "framer-motion";

const comparisons = [
  { bad: "Includes lakes, ponds, and retention areas", good: "Navigable waterways only" },
  { bad: "Low boat-ownership neighborhoods", good: "Homes with docks, lifts, and seawalls" },
  { bad: "Broad regional coverage with high waste", good: "Hyper-local South Florida targeting" },
  { bad: "You source your own list and figure it out", good: "Full-service from data to delivery" },
];

const ProblemSolution = () => (
  <section className="section-padding bg-background">
    <div className="container-max max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 sm:mb-14"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-brass-gold mb-3">The Problem</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Most Waterfront Lists Waste Your Money.
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Generic mailing lists include lakefront homes, retention ponds, and neighborhoods where no one owns a boat. Our data only includes homes on navigable waterways with real boat access.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-red-50/50 border border-red-200/60 rounded-xl p-6 sm:p-8"
        >
          <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-5 sm:mb-6">Generic Waterfront Lists</p>
          <ul className="space-y-4">
            {comparisons.map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-foreground/80 text-[15px]">{c.bad}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-[hsl(187,77%,27%,0.06)] border border-harbor-teal/20 rounded-xl p-6 sm:p-8"
        >
          <p className="text-sm font-bold text-harbor-teal uppercase tracking-wider mb-5 sm:mb-6">Waterfront Direct Mail</p>
          <ul className="space-y-4">
            {comparisons.map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-harbor-teal mt-0.5 flex-shrink-0" />
                <span className="text-foreground font-medium text-[15px]">{c.good}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ProblemSolution;
