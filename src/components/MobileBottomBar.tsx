"use client";

import React, { useState, useEffect } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { LivePortfolioData } from "@/lib/dal";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import { Phone, Mail, MessageCircle, ArrowUp } from "lucide-react";

interface MobileBottomBarProps {
  profile?: LivePortfolioData["profile"];
}

export default function MobileBottomBar({ profile: propProfile }: MobileBottomBarProps = {}) {
  const profile = propProfile || PORTFOLIO_DATA.profile;
  const { contact } = profile;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappNumber = contact.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20Altaf%20Hossain%20Raju,%20reaching%20out%20via%20your%20portfolio.`;

  return (
    <aside
      aria-label="Mobile Quick Channels"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#070A11]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-1">
        
        {/* Call Action */}
        <a
          href={`tel:${contact.phone}`}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 text-slate-300 hover:text-white transition-colors min-h-[44px]"
          aria-label="Call Altaf Hossain Raju directly"
        >
          <div className="w-8 h-8 bg-[#0C111C] border border-white/10 flex items-center justify-center text-[#D4AF37] mb-0.5">
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <span className="text-xs font-sans font-semibold uppercase tracking-tight">Call</span>
        </a>

        {/* WhatsApp Action */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 text-slate-300 hover:text-white transition-colors min-h-[44px]"
          aria-label="Chat on WhatsApp"
        >
          <div className="w-8 h-8 bg-[#0C111C] border border-white/10 flex items-center justify-center text-emerald-400 mb-0.5">
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <span className="text-xs font-sans font-semibold uppercase tracking-tight">WhatsApp</span>
          <span className="sr-only">(opens in new window)</span>
        </a>

        {/* LinkedIn Action */}
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 text-slate-300 hover:text-white transition-colors min-h-[44px]"
          aria-label="Connect on LinkedIn"
        >
          <div className="w-8 h-8 bg-[#0C111C] border border-white/10 flex items-center justify-center text-sky-400 mb-0.5">
            <LinkedinIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-sans font-semibold uppercase tracking-tight">LinkedIn</span>
          <span className="sr-only">(opens in new window)</span>
        </a>

        {/* Email Action */}
        <a
          href={`mailto:${contact.email}`}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 text-slate-300 hover:text-white transition-colors min-h-[44px]"
          aria-label="Send direct email"
        >
          <div className="w-8 h-8 bg-[#0C111C] border border-white/10 flex items-center justify-center text-slate-200 mb-0.5">
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <span className="text-xs font-sans font-semibold uppercase tracking-tight">Email</span>
        </a>

        {/* Inquiry CTA or Scroll to Top */}
        {showScrollTop ? (
          <button
            type="button"
            onClick={scrollToTop}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 text-slate-300 hover:text-white transition-colors min-h-[44px]"
            aria-label="Back to top"
          >
            <div className="w-8 h-8 bg-[#0C111C] border border-white/10 flex items-center justify-center text-[#D4AF37] mb-0.5">
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <span className="text-xs font-sans font-semibold uppercase tracking-tight">Top</span>
          </button>
        ) : (
          <a
            href="#contact"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 text-slate-300 hover:text-white transition-colors min-h-[44px]"
            aria-label="Inquire directly"
          >
            <div className="w-8 h-8 bg-[#D4AF37] text-[#070A11] flex items-center justify-center font-bold mb-0.5">
              <span className="text-xs" aria-hidden="true">&rarr;</span>
            </div>
            <span className="text-xs font-sans font-bold uppercase tracking-tight text-[#D4AF37]">Inquire</span>
          </a>
        )}

      </div>
    </aside>
  );
}
