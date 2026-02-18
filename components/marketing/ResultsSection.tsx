import { Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "We stopped wasting mail on non-boat-access neighborhoods and saw a noticeable jump in calls within two drops.",
    author: "Marine Service Company Owner",
  },
  {
    quote: "The targeting was spot-on. Every mailer went to a home that actually had a dock or seawall.",
    author: "Dock Builder",
  },
  {
    quote: "They handled everything. I just approved the design and the leads started calling.",
    author: "Yacht Broker",
  },
];

const stats = [
  { value: "10,000+", label: "Waterfront Homes" },
  { value: "2", label: "Counties" },
  { value: "100%", label: "Navigable Waterways" },
];

const ResultsSection = () => (
  <section id="results" className="section-padding bg-secondary">
    <div className="container-max">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
          Our Clients See Real Results.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="bg-card border border-border rounded-lg p-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Quote className="w-8 h-8 text-brass-gold/40 mb-4" />
            <p className="text-foreground leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-sm font-semibold text-brass-gold">- {t.author}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl sm:text-4xl font-serif font-bold text-brass-gold">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ResultsSection;
