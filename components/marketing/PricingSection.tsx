"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const packages = [
  {
    name: "6×9 Semi-Gloss Postcard",
    desc: "Standard size, full-color both sides",
    tiers: [
      { qty: "2,000 Homes", price: "$2,240", per: "$1.12/piece" },
      { qty: "5,000 Homes", price: "$5,000", per: "$1.00/piece" },
      { qty: "7,000 Homes", price: "$7,125", per: "$1.02/piece", popular: true },
    ],
  },
  {
    name: "6×11 Semi-Gloss Oversized",
    desc: "Oversized postcard, maximum visibility",
    tiers: [
      { qty: "2,000 Homes", price: "$2,400", per: "$1.20/piece" },
      { qty: "5,000 Homes", price: "$5,800", per: "$1.16/piece" },
      { qty: "7,000 Homes", price: "$7,725", per: "$1.10/piece", popular: true },
    ],
  },
];

const PricingSection = () => (
  <section id="pricing" className="section-padding bg-background">
    <div className="container-max max-w-4xl">
      <motion.div
        className="text-center mb-12 sm:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-brass-gold mb-3">Pricing</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Simple, All-Inclusive Pricing.
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
          Every package includes targeting, printing, and delivery to verified waterfront homes. No hidden fees.
        </p>
      </motion.div>

      <div className="space-y-8">
        {packages.map((pkg, pi) => (
          <motion.div
            key={pkg.name}
            className="border border-border rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: pi * 0.1 }}
          >
            <div className="bg-deep-navy px-6 py-4">
              <h3 className="font-serif text-lg font-bold text-white">{pkg.name}</h3>
              <p className="text-white/50 text-sm">{pkg.desc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {pkg.tiers.map((tier) => (
                <div key={tier.qty} className={`px-6 py-5 text-center relative ${tier.popular ? 'bg-secondary' : ''}`}>
                  {tier.popular && (
                    <span className="absolute top-2 right-3 text-[10px] font-bold tracking-wider uppercase text-brass-gold">
                      Most Popular
                    </span>
                  )}
                  <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2">{tier.qty}</p>
                  <p className="text-3xl font-serif font-bold text-foreground">{tier.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">{tier.per}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-muted-foreground text-sm mb-6">
          Custom quantities and specialty formats available on request.
        </p>
        <a
          href="#get-started"
          className="group bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-7 py-3.5 rounded-lg font-semibold text-sm transition-all inline-flex items-center gap-2"
        >
          Get a Free Campaign Plan
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </motion.div>
    </div>
  </section>
);

export default PricingSection;
