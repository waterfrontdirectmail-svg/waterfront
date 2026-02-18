"use client";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-waterfront.jpg";

const bullets = [
  "Reach homeowners on canals, Intracoastal, and ocean-access waterways only",
  "We handle the data, design, printing, and delivery",
  "No wasted mail on landlocked or non-boat-access homes",
  "Hyper-local targeting by city, ZIP, or neighborhood",
];

const HeroSection = () => (
  <section className="bg-background section-padding">
    <div className="container-max flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
      {/* Left */}
      <motion.div
        className="flex-1 max-w-2xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance mb-6">
          Put Your Business in Front of Every Waterfront Homeowner That Matters.
        </h1>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          We handle your entire direct mail campaign, from targeting the right homes on South Florida&apos;s navigable waterways to designing, printing, and delivering your mailer.
        </p>

        <ul className="space-y-3 mb-8">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-harbor-teal mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{b}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-4 mb-6">
          <a
            href="/signup"
            className="bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-7 py-3 rounded font-semibold text-sm transition-colors"
          >
            Start Your Campaign
          </a>
          <a
            href="/explore"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-7 py-3 rounded font-semibold text-sm transition-colors"
          >
            Explore Coverage
          </a>
        </div>

        <p className="text-muted-foreground text-sm">
          No long-term contracts. Campaigns start in as little as two weeks.
        </p>
      </motion.div>

      {/* Right */}
      <motion.div
        className="flex-1 relative w-full max-w-xl lg:max-w-none"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <img
          src={heroImage.src}
          alt="Aerial view of South Florida canal neighborhood with boats docked at waterfront homes"
          className="w-full rounded-lg shadow-xl object-cover aspect-[4/3]"
        />
        {/* Floating stat card */}
        <div className="absolute -bottom-6 -left-4 sm:left-4 bg-primary text-primary-foreground p-5 rounded-lg shadow-lg max-w-xs">
          <p className="text-2xl font-serif font-bold text-brass-gold">10,000+</p>
          <p className="text-sm font-medium mt-1">Waterfront homes in our database</p>
          <div className="brass-rule my-3 opacity-30" />
          <p className="text-xs text-primary-foreground/70">Palm Beach &amp; Broward counties&ensp;·&ensp;Navigable waterways only</p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
