"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "What does \"navigable waterfront\" mean?",
    a: "Navigable waterfront means the property is located on a body of water where a boat can travel to and from the ocean or Intracoastal Waterway. This includes canals, the Intracoastal, and ocean-access waterways. We do not include lakes, retention ponds, or landlocked bodies of water.",
  },
  {
    q: "What areas do you cover?",
    a: "We currently cover waterfront neighborhoods in Palm Beach County and Broward County, Florida. If you need coverage in other areas, contact us. We are expanding.",
  },
  {
    q: "How quickly can a campaign go out?",
    a: "Most campaigns can be in mailboxes within two to three weeks from the time you approve the final design and mailing list.",
  },
  {
    q: "Do I need to provide my own design?",
    a: "No. We offer design as an add-on service. Our team can create postcards, letters, and other mailer formats for you. If you already have a design, just send it over.",
  },
  {
    q: "What formats do you mail (postcards, letters, etc.)?",
    a: "We primarily work with postcards and letter-size mailers, but we can accommodate other formats depending on your campaign goals.",
  },
  {
    q: "How do I know which homes received my mailer?",
    a: "We provide a full mailing list report with every campaign so you know exactly which addresses received your piece.",
  },
  {
    q: "Can you remove my existing customers from the list?",
    a: "Yes. If you provide a suppression list of existing customers or addresses you want excluded, we will remove them before your campaign mails.",
  },
  {
    q: "What if I want to do multiple campaigns?",
    a: "Many of our clients run recurring campaigns. We can set up a schedule that works for your business, whether that's monthly, quarterly, or seasonal drops.",
  },
];

const FAQSection = () => (
  <section id="faq" className="section-padding bg-secondary">
    <div className="container-max max-w-3xl">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">
          Frequently Asked Questions
        </h2>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="bg-card border border-border rounded-lg px-6 overflow-hidden"
          >
            <AccordionTrigger className="text-left font-serif text-sm font-bold py-5 hover:no-underline hover:text-brass-gold">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
