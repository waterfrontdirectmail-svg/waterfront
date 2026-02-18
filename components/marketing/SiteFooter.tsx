import { Compass } from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About", href: "#" },
    { label: "Our Coverage", href: "#coverage" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Industries", href: "#industries" },
  ],
  Services: [
    { label: "Full-Service Campaigns", href: "#what-we-do" },
    { label: "Targeted Data", href: "#what-we-do" },
    { label: "Design Add-On", href: "#what-we-do" },
    { label: "Print and Delivery", href: "#what-we-do" },
  ],
  Resources: [
    { label: "FAQ", href: "#faq" },
    { label: "Direct Mail Tips", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const SiteFooter = () => (
  <footer className="bg-deep-navy text-deep-navy-foreground">
    <div className="container-max px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-serif text-sm font-bold mb-4 text-brass-gold">{title}</h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-deep-navy-foreground/70 hover:text-brass-gold transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h4 className="font-serif text-sm font-bold mb-4 text-brass-gold">Contact</h4>
          <ul className="space-y-2.5 text-sm text-deep-navy-foreground/70">
            <li>(561) 555-1234</li>
            <li>info@waterfrontdirectmail.com</li>
            <li className="pt-2 text-xs">Serving Palm Beach &amp; Broward County, FL</li>
          </ul>
        </div>
      </div>

      <div className="brass-rule mt-12 mb-6 opacity-20" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-deep-navy-foreground/50">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-brass-gold" strokeWidth={1.5} />
          <span className="font-serif font-bold text-deep-navy-foreground/70">Waterfront Direct Mail</span>
        </div>
        <span>&copy; 2026 Waterfront Direct Mail. All rights reserved.</span>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
