"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => (
  <section className="relative bg-deep-navy section-padding overflow-hidden">
    {/* Subtle gradient orb */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brass-gold/[0.04] rounded-full blur-3xl" />

    <motion.div
      className="container-max text-center relative z-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
        Your Next Customer Lives on the Water. Let Us Reach Them.
      </h2>
      <p className="text-white/50 text-lg mb-8 max-w-lg mx-auto">
        Get a free campaign plan with address counts for your service area.
      </p>
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <a
          href="/signup"
          className="group bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-8 py-3.5 rounded-lg font-semibold text-sm transition-all inline-flex items-center gap-2"
        >
          Start Your Campaign
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <a
          href="/explore"
          className="border border-white/20 text-white hover:bg-white/10 px-8 py-3.5 rounded-lg font-semibold text-sm transition-all"
        >
          Get a Free Count
        </a>
      </div>
      <p className="text-white/30 text-sm">
        No contracts. No minimums. Just results.
      </p>
    </motion.div>
  </section>
);

export default FinalCTA;
