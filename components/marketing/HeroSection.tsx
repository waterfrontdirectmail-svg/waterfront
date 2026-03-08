"use client";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-waterfront.jpg";

const HeroSection = () => (
  <section className="relative min-h-[85vh] flex items-center overflow-hidden">
    {/* Background image with overlay */}
    <div className="absolute inset-0">
      <img
        src={heroImage.src}
        alt="Aerial view of South Florida canal neighborhood with boats docked at waterfront homes"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(213,75%,6%)] via-[hsl(213,75%,8%,0.92)] to-[hsl(213,75%,10%,0.7)]" />
    </div>

    <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div className="max-w-2xl">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] rounded-full px-4 py-1.5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brass-gold animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-white/80">
            South Florida&apos;s Waterfront Data Experts
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] tracking-tight text-white mb-6"
        >
          Every Mailer Hits a Home
          <span className="text-brass-gold"> on the Water.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/75 leading-relaxed mb-8 max-w-lg"
        >
          Targeted direct mail to verified navigable waterfront homeowners in Palm Beach &amp; Broward County. No inland. No lakes. No waste.
        </motion.p>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {["Verified dock & boat access", "Navigable water only", "Full-service campaigns"].map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-2 text-sm text-white/90 bg-white/[0.06] border border-white/[0.1] rounded-lg px-3.5 py-2"
            >
              <CheckCircle2 className="w-4 h-4 text-brass-gold flex-shrink-0" />
              {b}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="/signup"
            className="group bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-7 py-3.5 rounded-lg font-semibold text-sm transition-all inline-flex items-center gap-2"
          >
            Start Your Campaign
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="/explore"
            className="border border-white/25 text-white hover:bg-white/10 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all"
          >
            Explore Coverage
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-white/40 text-sm mt-6"
        >
          No contracts. Campaigns launch in two weeks.
        </motion.p>
      </div>
    </div>
  </section>
);

export default HeroSection;
