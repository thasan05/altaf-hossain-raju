"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function ImpactSection() {
  const { metrics } = PORTFOLIO_DATA;

  // Split metrics into Flagship Macro Pillars and Operational Ledgers
  const primaryMetrics = metrics.slice(0, 2);
  const secondaryMetrics = metrics.slice(2);

  return (
    <section id="impact" className="py-24 sm:py-32 lg:py-36 border-b border-white/[0.08] bg-[#070A11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header: Clean Broadside Typography */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/[0.08] gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12]">
              Documented Scale &amp; Commercial Velocity
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md font-light leading-relaxed">
            Every metric represents audited milestones across multinational sales territories, corporate boardrooms, and nationwide professional youth ecosystems.
          </p>
        </div>

        {/* Asymmetrical Broadsheet Ledger (12 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Primary Macro Milestones (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            {primaryMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-[#0C111C] border border-white/10 p-8 sm:p-10 relative group hover:border-[#D4AF37]/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37]">
                    {metric.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-sans text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                    <span>{metric.verificationSource}</span>
                  </div>
                </div>

                {/* Primary Figure */}
                <div className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight tabular-nums mb-3">
                  {metric.value}
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 leading-snug">
                  {metric.label}
                </h3>

                <p className="text-sm text-slate-300 font-light leading-relaxed max-w-[65ch]">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: High-Density Operational Ledger (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8">
              <div className="pb-4 mb-6 border-b border-white/[0.08]">
                <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37] block mb-1">
                  Operational Ledger
                </span>
                <p className="text-xs text-slate-400">
                  Quantifiable performance metrics verified in multinational appraisals and institutional archives.
                </p>
              </div>

              <div className="space-y-8">
                {secondaryMetrics.map((metric) => (
                  <div key={metric.id} className="pb-6 border-b border-white/[0.06] last:border-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <div className="font-serif text-3xl sm:text-4xl font-bold text-white tabular-nums">
                        {metric.value}
                      </div>
                      <span className="text-xs font-sans text-slate-400 uppercase tracking-wider">
                        {metric.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-200 mb-1.5">
                      {metric.label}
                    </h4>

                    <p className="text-xs text-slate-400 font-light leading-relaxed mb-3">
                      {metric.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37] shrink-0" aria-hidden="true" />
                      <span className="truncate">{metric.verificationSource}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Link Banner */}
            <div className="p-5 bg-[#0C111C] border border-white/[0.08] flex items-center justify-between text-xs font-sans">
              <span className="text-slate-400">
                Audited Community Registry:
              </span>
              <a
                href={PORTFOLIO_DATA.profile.contact.lcbWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#D4AF37] hover:underline font-medium uppercase tracking-wider min-h-[44px]"
              >
                <span>LCB National Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in new window)</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
