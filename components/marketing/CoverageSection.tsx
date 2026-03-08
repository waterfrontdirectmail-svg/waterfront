"use client";
import { motion } from "framer-motion";
import coverageMap from "@/assets/coverage-map.jpg";
import { MapPin } from "lucide-react";

const palmBeach = [
  "Palm Beach Gardens", "Jupiter", "West Palm Beach", "Lake Worth",
  "Boynton Beach", "Delray Beach", "Boca Raton",
];

const broward = [
  "Deerfield Beach", "Lighthouse Point", "Pompano Beach",
  "Fort Lauderdale", "Hollywood", "Hillsboro Beach",
];

const CoverageSection = () => (
  <section id="coverage" className="section-padding bg-secondary">
    <div className="container-max">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-brass-gold mb-3">Coverage</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Hyper-Local Coverage Across South Florida&apos;s Waterways.
        </h2>
        <p className="text-muted-foreground text-lg">
          We cover navigable waterfront neighborhoods in Palm Beach and Broward counties.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
        <motion.div
          className="w-full lg:flex-1 lg:max-w-lg"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src={coverageMap.src}
            alt="Map showing Palm Beach and Broward County coverage area along the Intracoastal waterway"
            className="w-full rounded-xl shadow-lg"
          />
        </motion.div>

        <motion.div
          className="w-full lg:flex-1"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-4">
              <h3 className="font-serif text-lg font-bold">Palm Beach County</h3>
              <span className="text-brass-gold font-bold text-sm">7,100+ addresses</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {palmBeach.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-harbor-teal flex-shrink-0" />
                  <span className="text-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-4">
              <h3 className="font-serif text-lg font-bold">Broward County</h3>
              <span className="text-brass-gold font-bold text-sm">12,500+ addresses</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {broward.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-harbor-teal flex-shrink-0" />
                  <span className="text-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground text-sm italic">
            Need coverage outside these areas? Contact us. We are expanding.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CoverageSection;
