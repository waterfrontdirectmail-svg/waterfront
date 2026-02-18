"use client";
import { Database, Palette, Truck } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Database,
    title: "Targeted Data",
    description:
      "We build your mailing list from our proprietary database of waterfront homeowners on navigable waterways. Filter by county, city, ZIP, or neighborhood. Every address is verified, deduped, and delivery-ready.",
  },
  {
    icon: Palette,
    title: "Design + Print",
    description:
      "Need a mailer designed? Our creative team builds eye-catching postcards and letters that get opened. Already have your own design? Just send it over and we handle the rest. Design is available as an add-on service.",
  },
  {
    icon: Truck,
    title: "Print + Deliver",
    description:
      "We manage production from start to finish. Your mailers are printed and sent directly to the homes you targeted. Track your campaign and know exactly when it drops.",
  },
];

const WhatWeDo = () => (
  <section id="what-we-do" className="section-padding bg-background">
    <div className="container-max">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
          A Complete Direct Mail Service Built for the Marine Industry.
        </h2>
        <p className="text-muted-foreground text-lg">
          You focus on running your business. We get your message into the right mailboxes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <s.icon className="w-10 h-10 text-brass-gold mb-5" strokeWidth={1.5} />
            <h3 className="font-serif text-xl font-bold mb-3">{s.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{s.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="#get-started"
          className="inline-flex bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-7 py-3 rounded font-semibold text-sm transition-colors"
        >
          Start Your Campaign
        </a>
      </div>
    </div>
  </section>
);

export default WhatWeDo;
