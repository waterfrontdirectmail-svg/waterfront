"use client";
import { motion } from "framer-motion";
import coverageMap from "@/assets/coverage-map.jpg";
import { MapPin } from "lucide-react";

const cities = [
  "Boca Raton", "Delray Beach", "Boynton Beach", "Lake Worth",
  "West Palm Beach", "Palm Beach Gardens", "Fort Lauderdale",
  "Pompano Beach", "Deerfield Beach", "Hollywood",
  "Lighthouse Point", "Hillsboro Beach",
];

const CoverageSection = () => (
  <section id="coverage" className="section-padding bg-secondary">
    <div className="container-max">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
          Hyper-Local Coverage Across South Florida&apos;s Waterways.
        </h2>
        <p className="text-muted-foreground text-lg">
          We cover navigable waterfront neighborhoods in Palm Beach and Broward counties.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12">
        <motion.div
          className="flex-1 max-w-md"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src={coverageMap.src}
            alt="Map showing Palm Beach and Broward County coverage area along the Intracoastal waterway"
            className="w-full rounded-lg shadow-md"
          />
        </motion.div>

        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-serif text-xl font-bold mb-6">Cities We Cover</h3>
          <div className="grid grid-cols-2 gap-3">
            {cities.map((c) => (
              <div key={c} className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-harbor-teal flex-shrink-0" />
                <span className="text-foreground">{c}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm mt-8 italic">
            Need coverage outside these areas? Contact us. We are expanding.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CoverageSection;
