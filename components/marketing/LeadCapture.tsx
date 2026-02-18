"use client";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const serviceTypes = [
  "Dock / Seawall Contractor",
  "Boat Dealer",
  "Marine Service",
  "Marine Insurance",
  "Yacht Broker",
  "Waterfront Contractor",
  "Other",
];

const LeadCapture = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="get-started" className="section-padding bg-background">
      <div className="container-max max-w-3xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
            Ready to Reach Waterfront Homeowners?
          </h2>
          <p className="text-muted-foreground text-lg">
            Tell us about your business and we&apos;ll put together a free campaign plan with counts for your service area.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            className="bg-secondary border border-border rounded-lg p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle2 className="w-16 h-16 text-harbor-teal mx-auto mb-6" />
            <h3 className="font-serif text-2xl font-bold mb-3">Thanks!</h3>
            <p className="text-muted-foreground text-lg">
              We&apos;ll send your free campaign plan within one business day.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-lg p-8 sm:p-10 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                <input type="text" id="name" required className="w-full border border-input rounded px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">Company Name *</label>
                <input type="text" id="company" required className="w-full border border-input rounded px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                <input type="email" id="email" required className="w-full border border-input rounded px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">Phone (optional)</label>
                <input type="tel" id="phone" className="w-full border border-input rounded px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label htmlFor="service-type" className="block text-sm font-medium text-foreground mb-1.5">Service Type *</label>
                <select id="service-type" required className="w-full border border-input rounded px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select your industry</option>
                  {serviceTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-foreground mb-1.5">Service Area or ZIPs</label>
                <input type="text" id="area" placeholder="e.g. Fort Lauderdale, 33301" className="w-full border border-input rounded px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">Brief Message</label>
              <textarea id="message" rows={3} className="w-full border border-input rounded px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-8 py-3 rounded font-semibold text-sm transition-colors"
            >
              Get My Free Campaign Plan
            </button>

            <p className="text-muted-foreground text-xs mt-4">
              No obligation. No spam. We respond within one business day.
            </p>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default LeadCapture;
