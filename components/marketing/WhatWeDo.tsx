"use client";
import { Database, Palette, Truck } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Database,
    title: "Targeted Data",
    description:
      "We build your mailing list from our proprietary database of waterfront homeowners on navigable waterways. Filter by county, city, ZIP, or neighborhood. Every address is verified and delivery-ready.",
  },
  {
    icon: Palette,
    title: "Design + Print",
    description:
      "Need a mailer designed? Our creative team builds eye-catching postcards and letters that get opened. Already have your own design? Just send it over and we handle the rest.",
  },
  {
    icon: Truck,
    title: "Print + Deliver",
    description:
      "We manage production from start to finish. Your mailers are printed and sent directly to the homes you targeted. Track your campaign and know exactly when it drops.",
  },
];

const WhatWeDo = () => (
  <section id="what-we-do" className="section-padding bg-secondary">
    <div className="container-max">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-brass-gold mb-3">What We Do</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          A Complete Direct Mail Service Built for the Marine Industry.
        </h2>
        <p className="text-muted-foreground text-lg">
          You focus on running your business. We get your message into the right mailboxes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            className="group bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-brass-gold/30 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-12 h-12 rounded-lg bg-deep-navy flex items-center justify-center mb-6">
              <s.icon className="w-6 h-6 text-brass-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">{s.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatWeDo;
