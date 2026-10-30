"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function ImpactSection() {
  const { metrics } = PORTFOLIO_DATA;

  return (
    <section id="impact" className="py-20 sm:py-28 lg:py-32 border-b border-white/[0.08] bg-[#070A11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Pure Typographic Restraint */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Documented Scale &amp; Commercial Velocity
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg font-light leading-relaxed">
            Every metric represents audited milestones across multinational sales territories, executive boardrooms, and nationwide professional youth ecosystems.
          </p>
        </div>

        {/* Broadsheet Metric Ledger: Clean Grid with Hairline Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="flex flex-col justify-between pt-6 border-t-2 border-[#D4AF37]/40 hover:border-[#D4AF37] transition-colors"
            >
              <div>
                <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37] block mb-2">
                  {metric.category}
                </span>

                {/* Oversized Pure Metric */}
                <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight tabular-nums mb-3">
                  {metric.value}
                </div>

                {/* Label */}
                <h3 className="text-base font-semibold text-slate-200 mb-2 leading-snug">
                  {metric.label}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-6">
                  {metric.description}
                </p>
              </div>

              {/* Source Verification Line */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs font-sans text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span className="truncate">{metric.verificationSource}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Provenance Note */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-sans text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" aria-hidden="true" />
            <span>Telemetry verified across Marico annual appraisals, Robi national records, and university archives.</span>
          </div>
          <a
            href={PORTFOLIO_DATA.profile.contact.lcbWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#D4AF37] transition-colors uppercase tracking-wider font-medium"
          >
            <span>Visit LCB Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in new window)</span>
          </a>
        </div>

      </div>
    </section>
  );
}
