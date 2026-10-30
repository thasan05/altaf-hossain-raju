"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { ExternalLink } from "lucide-react";

export default function MediaSection() {
  const { mediaCoverage } = PORTFOLIO_DATA;

  return (
    <section id="media" className="py-20 sm:py-28 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Documented in the Public Record
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg font-light leading-relaxed">
            Archival media coverage across national business dailies, university press, and executive thought leadership forums.
          </p>
        </div>

        {/* Editorial Press Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mediaCoverage.map((item) => (
            <div
              key={item.id}
              className="bg-[#0C111C] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-colors"
            >
              <div>
                
                {/* Publication & Date Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08] text-xs font-sans">
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider">
                    {item.outlet}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {item.date}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-3 leading-snug">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-6">
                  {item.summary}
                </p>

                {/* Pull Quote */}
                {item.highlightQuote && (
                  <blockquote className="my-5 pl-4 border-l-2 border-[#D4AF37]/50 italic text-xs sm:text-sm font-serif text-slate-200 leading-relaxed">
                    &ldquo;{item.highlightQuote}&rdquo;
                  </blockquote>
                )}

              </div>

              {/* Action Link */}
              <div className="pt-4 border-t border-white/[0.08]">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-[#D4AF37] hover:underline min-h-[44px]"
                >
                  <span>{item.linkText}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in new window)</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
