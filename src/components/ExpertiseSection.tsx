"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { TrendingUp, Layers, Users2, Share2, Rocket, GraduationCap } from "lucide-react";

export default function ExpertiseSection() {
  const { areasOfExpertise } = PORTFOLIO_DATA;

  const domainIcons = [TrendingUp, Layers, Users2, Share2, Rocket, GraduationCap];

  const domainBadges = [
    "Commercial Operations",
    "Revenue & Pricing",
    "Partner Governance",
    "Youth Ecosystem",
    "Executive Advisory",
    "PMP® Frameworks"
  ];

  return (
    <section id="expertise" className="py-20 sm:py-28 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Strategic Competencies &amp; Functional Domains
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg font-light leading-relaxed">
            Synthesized across multinational corporate sales leadership, distribution channel economics, and nationwide human capability development.
          </p>
        </div>

        {/* Competencies Architectural Ledger: Structured Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {areasOfExpertise.map((domain, idx) => {
            const Icon = domainIcons[idx % domainIcons.length];
            const badge = domainBadges[idx % domainBadges.length];
            return (
              <div
                key={idx}
                className="bg-[#0C111C] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-colors"
              >
                <div>
                  
                  {/* Domain Meta Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                    <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                      {badge}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-white mb-3">
                    {domain.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-6">
                    {domain.description}
                  </p>
                </div>

                {/* Sub-competencies tags */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex flex-wrap gap-1.5">
                    {domain.competencies.map((comp, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-xs font-sans px-2.5 py-1 bg-[#070A11] border border-white/[0.08] text-slate-300"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Strategic Context Note */}
        <div className="mt-12 p-6 bg-[#0C111C] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-300 font-light">
            <strong className="text-white font-medium">Executive Methodology: </strong>
            Every commercial competency is backed by PMP® governance frameworks, advanced financial modeling from IBA DU, and seven years of FMCG field execution.
          </div>
          <a
            href="#contact?intent=consultation"
            className="text-xs font-sans font-semibold uppercase tracking-wider text-[#D4AF37] hover:underline shrink-0 min-h-[44px] inline-flex items-center"
          >
            Request Full Consultation &rarr;
          </a>
        </div>

      </div>
    </section>
  );
}
