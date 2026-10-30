"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { LivePortfolioData } from "@/lib/dal";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  sections?: LivePortfolioData["sections"];
  profile?: LivePortfolioData["profile"];
}

const defaultNavLinks = [
  { name: "Overview", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Career", href: "#career" },
  { name: "Ventures", href: "#ventures" },
  { name: "Competencies", href: "#expertise" },
  { name: "Speaking", href: "#speaking" },
  { name: "Credentials", href: "#credentials" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar({ sections: propSections, profile: propProfile }: NavbarProps = {}) {
  const profile = propProfile || PORTFOLIO_DATA.profile;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navLinks = propSections && propSections.length > 0
    ? propSections
        .filter((s) => s.isVisible && s.id !== "impact")
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => ({
          name: s.label || s.id,
          href: `#${s.id}`,
        }))
    : defaultNavLinks;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = [
        "hero",
        "impact",
        "about",
        "career",
        "ventures",
        "expertise",
        "speaking",
        "credentials",
        "media",
        "testimonials",
        "contact",
      ];

      const scrollPos = window.scrollY + 180;
      for (const section of sectionIds) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
          scrolled
            ? "bg-[#070A11]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-xl"
            : "bg-transparent py-5 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Signature */}
          <Link
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-3.5 transition-opacity hover:opacity-95 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            aria-label={`${profile.displayName || "Altaf Hossain Raju"} - Executive Portfolio`}
          >
            <div className="w-10 h-10 rounded-sm bg-[#0E1524] border border-white/10 flex items-center justify-center font-serif text-sm font-semibold tracking-wider text-[#D4AF37] group-hover:border-[#D4AF37]/40 transition-colors shrink-0">
              {profile.initials || "AHR"}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-[#F8FAFC] transition-colors">
                  {profile.displayName || "Altaf Hossain Raju"}
                </span>
                <span className="text-xs font-sans font-bold tracking-wider text-[#D4AF37] px-1.5 py-0.5 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/25">
                  {profile.honorificSuffix || "PMP®"}
                </span>
              </div>
              <span className="text-xs tracking-wide text-slate-300 font-sans hidden sm:block">
                Area Manager, Marico &bull; Founder, LCB
              </span>
            </div>
          </Link>

          {/* Desktop Editorial Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide">
            {navLinks.map((link) => {
              const isActive =
                (activeSection === "hero" && link.href === "#hero") ||
                activeSection === link.href.substring(1);

              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`transition-colors py-1 relative ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D4AF37]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-transparent hover:bg-white/[0.04] border border-white/20 hover:border-[#D4AF37] transition-all duration-200"
            >
              <span>Initiate Dialogue</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-sm bg-[#0E1524] border border-white/10 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="lg:hidden fixed inset-0 z-40 bg-[#070A11]/98 backdrop-blur-xl flex flex-col justify-between pt-24 pb-12 px-6"
        >
          <div className="flex flex-col space-y-6">
            <div className="text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 pb-2 border-b border-white/10">
              Navigation Index
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl font-bold text-white hover:text-[#D4AF37] transition-colors py-1 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-5 h-5 text-slate-600" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-[#070A11] bg-[#D4AF37] transition-colors min-h-[44px] flex items-center justify-center"
            >
              Initiate Dialogue &rarr;
            </a>
            <div className="flex items-center justify-between text-xs text-slate-400 font-sans pt-2">
              <span>Dhaka, Bangladesh</span>
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:underline"
              >
                <span>LinkedIn Profile</span>
                <span className="sr-only">(opens in new window)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
