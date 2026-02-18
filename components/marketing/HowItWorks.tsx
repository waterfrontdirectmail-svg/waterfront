import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Tell Us Who You Want to Reach",
    desc: "Share your service area and target customer. We pull counts and recommend the best targeting.",
  },
  {
    num: "02",
    title: "We Build Your Campaign",
    desc: "We select the right homes, design your mailer (or use yours), and prepare everything for print.",
  },
  {
    num: "03",
    title: "Review and Approve",
    desc: "You see the final piece and the targeted list before anything goes to print.",
  },
  {
    num: "04",
    title: "We Print and Mail",
    desc: "Your mailers are printed and delivered directly to waterfront homeowners. You get notified when the campaign drops.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="section-padding bg-background">
    <div className="container-max">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
          From Strategy to Mailbox in Four Simple Steps.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-5xl font-serif font-bold text-brass-gold/20">{s.num}</span>
            <h3 className="font-serif text-lg font-bold mt-2 mb-3">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-14">
        <a
          href="#get-started"
          className="bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-7 py-3 rounded font-semibold text-sm transition-colors"
        >
          Start Your Campaign
        </a>
        <a
          href="#get-started"
          className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-7 py-3 rounded font-semibold text-sm transition-colors"
        >
          Talk to Us
        </a>
      </div>
    </div>
  </section>
);

export default HowItWorks;
