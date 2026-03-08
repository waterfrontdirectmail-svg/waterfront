"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Tell Us Who You Want to Reach",
    desc: "Share your service area and target customer. We pull counts and recommend the best targeting.",
  },
  {
    num: "02",
    title: "We Build Your Campaign",
    desc: "We select the right homes, design your mailer (or use yours), and prepare everything for print.",
  },
  {
    num: "03",
    title: "Review and Approve",
    desc: "You see the final piece and the targeted list before anything goes to print.",
  },
  {
    num: "04",
    title: "We Print and Mail",
    desc: "Your mailers are printed and delivered directly to waterfront homeowners. You get notified when the campaign drops.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="section-padding bg-deep-navy">
    <div className="container-max">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-brass-gold mb-3">How It Works</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
          From Strategy to Mailbox in Four Simple Steps.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-12 h-12 rounded-full bg-brass-gold/10 border border-brass-gold/30 flex items-center justify-center mb-5">
              <span className="text-brass-gold font-serif font-bold text-lg">{s.num}</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-white mb-3">{s.title}</h3>
            <p className="text-white/55 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex flex-wrap gap-4 justify-center mt-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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
          className="border border-white/20 text-white hover:bg-white/10 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all"
        >
          Explore Coverage
        </a>
      </motion.div>
    </div>
  </section>
);

export default HowItWorks;
