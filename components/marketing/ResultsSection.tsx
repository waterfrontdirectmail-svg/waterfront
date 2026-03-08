"use client";
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

const ResultsSection = () => (
  <section id="results" className="section-padding bg-background">
    <div className="container-max">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-brass-gold mb-3">Results</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Our Clients See Real Results.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="relative bg-secondary border border-border rounded-xl p-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="text-5xl font-serif text-brass-gold/20 leading-none mb-4">&ldquo;</div>
            <p className="text-foreground leading-relaxed mb-6 text-[15px]">{t.quote}</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-deep-navy flex items-center justify-center">
                <span className="text-brass-gold text-xs font-bold">{t.author.charAt(0)}</span>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">{t.author}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ResultsSection;
