import { Anchor, Package, MapPinned, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Anchor, label: "Navigable Waterways Only" },
  { icon: Package, label: "Full-Service Campaigns" },
  { icon: MapPinned, label: "Locally Focused Data" },
  { icon: BadgeCheck, label: "No Wasted Postage" },
];

const TrustStrip = () => (
  <section className="bg-secondary border-y border-border">
    <div className="container-max px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className="flex flex-col items-center text-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <item.icon className="w-8 h-8 text-brass-gold" strokeWidth={1.5} />
            <span className="text-sm font-semibold text-foreground">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStrip;
