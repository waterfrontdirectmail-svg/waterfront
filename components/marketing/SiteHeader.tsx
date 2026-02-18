"use client";
import { useState } from "react";
import { Menu, X, Compass } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Coverage", href: "#coverage" },
  { label: "Explore Addresses", href: "/explore" },
  { label: "Industries", href: "#industries" },
  { label: "FAQ", href: "#faq" },
];

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary/[0.97] backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="container-max px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-primary-foreground">
          <Compass className="w-7 h-7 text-brass-gold" strokeWidth={1.5} />
          <span className="font-serif text-lg md:text-xl font-bold tracking-tight leading-tight">
            Waterfront<br className="hidden md:block" /> Direct Mail
          </span>
        </a>

        {/* Desktop Nav */}
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
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden sm:inline-flex text-primary-foreground/80 hover:text-brass-gold text-sm font-medium transition-colors"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="hidden sm:inline-flex bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-5 py-2.5 rounded text-sm font-semibold transition-colors"
          >
            Get Started
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

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-primary border-t border-primary-foreground/10 pb-4">
          <nav className="container-max px-4 flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-brass-gold py-2.5 text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-primary-foreground/80 hover:text-brass-gold py-2.5 text-sm font-medium transition-colors"
            >
              Log In
            </a>
            <a
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="mt-2 bg-brass-gold hover:bg-brass-gold-hover text-primary-foreground px-5 py-2.5 rounded text-sm font-semibold text-center transition-colors"
            >
              Get Started
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
