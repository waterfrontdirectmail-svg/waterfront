"use client";
import { useState } from "react";
import { Menu, X, Compass } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Coverage", href: "#coverage" },
  { label: "Industries", href: "#industries" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary/[0.97] backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="container-max px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-18">
        <Link href="/" className="flex items-center gap-2 text-primary-foreground flex-shrink-0">
          <Compass className="w-7 h-7 text-brass-gold" strokeWidth={1.5} />
          <span className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-tight leading-tight">
            Waterfront<span className="hidden sm:inline"> Direct</span> Mail
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-primary-foreground/80 hover:text-brass-gold text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/explore"
            className="text-primary-foreground/80 hover:text-brass-gold text-sm font-medium transition-colors"
          >
            Explore Addresses
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden lg:inline-flex text-primary-foreground/80 hover:text-brass-gold text-sm font-medium transition-colors"
          >
            Log In
          </a>
          <a
            href="#get-started"
            className="hidden lg:inline-flex bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Get a Free Plan
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-primary-foreground p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-primary border-t border-primary-foreground/10">
          <nav className="container-max px-4 py-3 flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-brass-gold py-3 text-sm font-medium transition-colors border-b border-primary-foreground/[0.06]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-primary-foreground/80 hover:text-brass-gold py-3 text-sm font-medium transition-colors border-b border-primary-foreground/[0.06]"
            >
              Log In
            </a>
            <a
              href="/explore"
              onClick={() => setMobileOpen(false)}
              className="mt-4 border border-primary-foreground/20 text-primary-foreground py-3 rounded-lg text-sm font-semibold text-center transition-colors hover:bg-primary-foreground/10"
            >
              Explore Addresses
            </a>
            <a
              href="#get-started"
              onClick={() => setMobileOpen(false)}
              className="mt-2 mb-2 bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground py-3 rounded-lg text-sm font-semibold text-center transition-colors"
            >
              Get a Free Campaign Plan
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
