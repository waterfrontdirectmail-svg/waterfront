import { X, Check } from "lucide-react";
import { motion } from "framer-motion";

const rows = [
  { generic: "Includes lakes and ponds", ours: "Navigable waterways only" },
  { generic: "Low boat ownership", ours: "High boat ownership households" },
  { generic: "Broad regional coverage", ours: "Hyper-local South Florida focus" },
  { generic: "High waste rate", ours: "Minimal waste, maximum relevance" },
  { generic: "You figure out the rest", ours: "We handle everything for you" },
];

const ProblemSolution = () => (
  <section className="section-padding bg-secondary">
    <div className="container-max max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4 text-center">
          Most Waterfront Lists Waste Your Money.
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed">
          Generic mailing lists include lakefront homes, retention ponds, and neighborhoods where no one owns a boat. You end up paying to mail people who will never need your services. Our data is different. We only include homes on navigable waterways where homeowners actually have docks, boat lifts, and seawalls.
        </p>
      </motion.div>

      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="py-3 px-4 text-left font-serif font-bold text-foreground">Comparison</th>
              <th className="py-3 px-4 text-left font-serif font-bold text-muted-foreground">Generic Waterfront List</th>
              <th className="py-3 px-4 text-left font-serif font-bold text-brass-gold">Waterfront Direct Mail</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border">
                <td className="py-4 px-4" />
                <td className="py-4 px-4 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <X className="w-4 h-4 text-destructive flex-shrink-0" />
                    {row.generic}
                  </span>
                </td>
                <td className="py-4 px-4 text-foreground font-medium">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-harbor-teal flex-shrink-0" />
                    {row.ours}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  </section>
);

export default ProblemSolution;
