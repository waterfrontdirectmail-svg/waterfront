import { Anchor, Ship, Wrench, ArrowUpFromLine, Shield, Sparkles, Waves } from "lucide-react";
import { motion } from "framer-motion";

const industries = [
  { icon: Anchor, title: "Dock and Seawall Contractors", desc: "Reach homeowners who need dock repairs, seawall restoration, and marine construction." },
  { icon: Ship, title: "Boat Dealers and Brokers", desc: "Put new listings and inventory in front of homeowners who already have boat access." },
  { icon: Wrench, title: "Marine Service and Repair", desc: "Target boat owners in your service radius for maintenance, winterization, and repairs." },
  { icon: ArrowUpFromLine, title: "Boat Lift and Davit Installers", desc: "Connect with waterfront homeowners looking to add or replace lifts and davits." },
  { icon: Shield, title: "Marine Insurance Providers", desc: "Market to high-value waterfront properties with boats, docks, and seawalls to insure." },
  { icon: Sparkles, title: "Yacht Management and Detailing", desc: "Reach yacht and boat owners in upscale waterfront neighborhoods." },
  { icon: Waves, title: "Pool, Patio and Waterfront Contractors", desc: "Target waterfront homeowners for outdoor living projects, pool construction, and landscaping." },
];

const IndustriesSection = () => (
  <section id="industries" className="section-padding bg-background">
    <div className="container-max">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
          Built for Businesses That Serve Waterfront Homeowners.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {industries.map((ind, i) => (
          <motion.div
            key={ind.title}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <ind.icon className="w-8 h-8 text-brass-gold mb-4" strokeWidth={1.5} />
            <h3 className="font-serif text-base font-bold mb-2">{ind.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{ind.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default IndustriesSection;
