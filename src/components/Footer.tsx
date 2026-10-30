"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import { ArrowUp, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const { profile } = PORTFOLIO_DATA;
  const currentYear = 2026;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#05070D] border-t border-white/10 pt-16 pb-28 lg:pb-16 text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/[0.08]">
          
          {/* Brand & Positioning (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0E1524] border border-white/10 flex items-center justify-center font-serif text-xs font-bold text-[#D4AF37]">
                AR
              </div>
              <span className="font-serif text-lg font-bold text-white">
                Altaf Hossain Raju, PMP®
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-md">
              Bridging boardroom operational rigor with grassroots human empowerment. Dedicated to scalable commercial distribution architectures, sales capacity development, and nationwide youth employability across Bangladesh.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] bg-[#0C111C] border border-white/10 hover:border-[#D4AF37] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span className="sr-only">(opens in new window)</span>
              </a>
              <a
                href={`mailto:${profile.contact.email}`}
                className="w-11 h-11 min-w-[44px] min-h-[44px] bg-[#0C111C] border border-white/10 hover:border-[#D4AF37] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Direct Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={profile.contact.lcbWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] bg-[#0C111C] border border-white/10 hover:border-[#D4AF37] flex items-center justify-center text-slate-300 hover:text-[#D4AF37] transition-colors"
                aria-label="LinkedIn Community Bangladesh Official Platform"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="sr-only">(opens in new window)</span>
              </a>
            </div>
          </div>

          {/* Structured Navigation Directory (6 cols) */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-sans">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                Core Profile
              </div>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#hero" className="hover:text-white transition-colors py-1 inline-block">Overview</a></li>
                <li><a href="#about" className="hover:text-white transition-colors py-1 inline-block">Biography</a></li>
                <li><a href="#career" className="hover:text-white transition-colors py-1 inline-block">Career Trajectory</a></li>
                <li><a href="#ventures" className="hover:text-white transition-colors py-1 inline-block">Ventures (LCB)</a></li>
              </ul>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                Engagement
              </div>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#expertise" className="hover:text-white transition-colors py-1 inline-block">Competencies</a></li>
                <li><a href="#speaking" className="hover:text-white transition-colors py-1 inline-block">Keynotes &amp; Talks</a></li>
                <li><a href="#credentials" className="hover:text-white transition-colors py-1 inline-block">Credentials</a></li>
                <li><a href="#media" className="hover:text-white transition-colors py-1 inline-block">Press Archive</a></li>
              </ul>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                Communication
              </div>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#testimonials" className="hover:text-white transition-colors py-1 inline-block">Testimonials</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors py-1 inline-block">Contact Dossier</a></li>
                <li><a href={`tel:${profile.contact.phone}`} className="hover:text-white transition-colors py-1 inline-block">Direct Call</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-sans text-slate-400 gap-4">
          <div>
            &copy; {currentYear} Md. Altaf Hossain Raju, PMP®. All corporate trademarks belong to their respective multinational holders.
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-slate-400 hover:text-[#D4AF37] transition-colors uppercase tracking-wider self-start sm:self-auto font-medium"
          >
            <span>Back to Summit</span>
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

      </div>
    </footer>
  );
}
