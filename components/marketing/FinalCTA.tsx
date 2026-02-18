import { motion } from "framer-motion";

const FinalCTA = () => (
  <section className="bg-deep-navy section-padding">
    <motion.div
      className="container-max text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-deep-navy-foreground mb-6">
        Your Next Customer Lives on the Water. Let Us Reach Them.
      </h2>
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <a
          href="#get-started"
          className="bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-7 py-3 rounded font-semibold text-sm transition-colors"
        >
          Start Your Campaign
        </a>
        <a
          href="#get-started"
          className="border-2 border-deep-navy-foreground text-deep-navy-foreground hover:bg-deep-navy-foreground hover:text-deep-navy px-7 py-3 rounded font-semibold text-sm transition-colors"
        >
          Get a Free Count
        </a>
      </div>
      <p className="text-deep-navy-foreground/60 text-sm">
        No contracts. No minimums. Just results.
      </p>
    </motion.div>
  </section>
);

export default FinalCTA;
