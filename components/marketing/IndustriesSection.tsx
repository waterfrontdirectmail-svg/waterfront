"use client";
import { Anchor, Ship, Wrench, ArrowUpFromLine, Shield, Sparkles, Waves } from "lucide-react";
import { motion } from "framer-motion";

const industries = [
  { icon: Anchor, title: "Dock & Seawall Contractors", desc: "Reach homeowners who need dock repairs, seawall restoration, and marine construction." },
  { icon: Ship, title: "Boat Dealers & Brokers", desc: "Put new listings and inventory in front of homeowners who already have boat access." },
  { icon: Wrench, title: "Marine Service & Repair", desc: "Target boat owners in your service radius for maintenance, winterization, and repairs." },
  { icon: ArrowUpFromLine, title: "Boat Lift & Davit Installers", desc: "Connect with waterfront homeowners looking to add or replace lifts and davits." },
  { icon: Shield, title: "Marine Insurance", desc: "Market to high-value waterfront properties with boats, docks, and seawalls to insure." },
  { icon: Sparkles, title: "Yacht Management & Detailing", desc: "Reach yacht and boat owners in upscale waterfront neighborhoods." },
  { icon: Waves, title: "Waterfront Contractors", desc: "Target waterfront homeowners for outdoor living projects, pool construction, and landscaping." },
];

const IndustriesSection = () => (
  <section id="industries" className="section-padding bg-background">
    <div className="container-max">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-brass-gold mb-3">Industries</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Built for Businesses That Serve Waterfront Homeowners.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {industries.map((ind, i) => (
          <motion.div
            key={ind.title}
            className="group bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-brass-gold/30 transition-all duration-300"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-deep-navy transition-colors duration-300">
              <ind.icon className="w-5 h-5 text-brass-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-base font-bold mb-2">{ind.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{ind.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default IndustriesSection;
