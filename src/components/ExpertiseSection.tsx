"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { LivePortfolioData } from "@/lib/dal";
import { TrendingUp, Layers, Users2, Share2, Rocket, GraduationCap } from "lucide-react";

interface ExpertiseSectionProps {
  areasOfExpertise?: LivePortfolioData["areasOfExpertise"];
  sectionConfig?: {
    customTitle?: string | null;
    customSubtitle?: string | null;
  };
}

export default function ExpertiseSection({ areasOfExpertise: propAreas, sectionConfig }: ExpertiseSectionProps = {}) {
  const areasOfExpertise = (propAreas || PORTFOLIO_DATA.areasOfExpertise).filter(
    (a) => a.isPublished !== false
  );

  // Group into thematic strategic tiers
  const primaryCommercial = areasOfExpertise[0] || PORTFOLIO_DATA.areasOfExpertise[0];
  const secondaryCommercial = areasOfExpertise.slice(1, 3);
  const youthAndMentorship = areasOfExpertise.slice(3, 5);
  const pmpGovernance = areasOfExpertise[5] || areasOfExpertise[areasOfExpertise.length - 1] || primaryCommercial;

  return (
    <section id="expertise" className="py-24 sm:py-32 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/[0.08] gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12]">
              {sectionConfig?.customTitle || "Strategic Competencies & Functional Domains"}
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md font-light leading-relaxed">
            {sectionConfig?.customSubtitle ||
              "Synthesized across multinational sales leadership, route-to-market distribution economics, and nationwide capability architecture."}
          </p>
        </div>

        {/* Asymmetrical Competency Architecture */}
        <div className="space-y-12">
          
          {/* Tier 1: Flagship Core Domain (Full-Width Broadsheet Feature) */}
          <div className="bg-[#0C111C] border border-white/10 p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-5">
                <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37] block mb-2">
                  Primary Commercial Pillar
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                  {primaryCommercial.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed mb-6 max-w-[65ch]">
                  {primaryCommercial.description}
                </p>
              </div>

              <div className="lg:col-span-7">
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-400 block mb-4 pb-2 border-b border-white/[0.06]">
                  Key Strategic Competencies
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {primaryCommercial.competencies.map((comp, cIdx) => (
                    <span
                      key={cIdx}
                      className="text-xs sm:text-sm font-sans px-3.5 py-1.5 bg-[#070A11] border border-white/10 text-slate-200"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tier 2: Two Dual-Column Strategic Ledgers (6 cols / 6 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Commercial Revenue & Channel Governance */}
            <div className="bg-[#0C111C] border border-white/10 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37] block mb-2">
                  Revenue Architecture &amp; Governance
                </span>
                <div className="space-y-8 mt-4">
                  {secondaryCommercial.map((domain, idx) => (
                    <div key={idx} className="pb-6 border-b border-white/[0.06] last:border-0 last:pb-0">
                      <h4 className="font-serif text-xl font-bold text-white mb-2">
                        {domain.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-4 max-w-[65ch]">
                        {domain.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {domain.competencies.map((comp, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-xs font-sans px-2.5 py-1 bg-[#070A11] border border-white/[0.06] text-slate-300"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Youth Ecosystem & Personal Brand Strategy */}
            <div className="bg-[#0C111C] border border-white/10 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37] block mb-2">
                  Ecosystem Architecture &amp; Mentorship
                </span>
                <div className="space-y-8 mt-4">
                  {youthAndMentorship.map((domain, idx) => (
                    <div key={idx} className="pb-6 border-b border-white/[0.06] last:border-0 last:pb-0">
                      <h4 className="font-serif text-xl font-bold text-white mb-2">
                        {domain.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-4 max-w-[65ch]">
                        {domain.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {domain.competencies.map((comp, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-xs font-sans px-2.5 py-1 bg-[#070A11] border border-white/[0.06] text-slate-300"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Tier 3: PMP® Governance & Executive Methodology Bar */}
          <div className="p-8 bg-[#0C111C] border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37] block mb-1">
                  Methodology &amp; Standards
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
                  {pmpGovernance.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-[65ch]">
                  {pmpGovernance.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {pmpGovernance.competencies.map((comp, cIdx) => (
                    <span
                      key={cIdx}
                      className="text-xs font-sans px-2.5 py-1 bg-[#070A11] border border-white/[0.06] text-slate-300"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 lg:text-right">
                <a
                  href="#contact?intent=consultation"
                  className="inline-flex items-center justify-center px-6 py-3.5 min-h-[44px] text-xs font-sans font-semibold uppercase tracking-wider text-[#070A11] bg-[#D4AF37] hover:bg-[#d8b56f] transition-colors"
                >
                  <span>Request Full Consultation &rarr;</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
