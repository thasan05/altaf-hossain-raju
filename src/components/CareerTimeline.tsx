"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { LivePortfolioData } from "@/lib/dal";
import { Award, Calendar, MapPin, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

interface CareerTimelineProps {
  careerJourney?: LivePortfolioData["careerJourney"];
  sectionConfig?: {
    customTitle?: string | null;
    customSubtitle?: string | null;
  };
}

export default function CareerTimeline({ careerJourney: propCareerJourney, sectionConfig }: CareerTimelineProps = {}) {
  const careerJourney = (propCareerJourney || PORTFOLIO_DATA.careerJourney).filter(
    (item) => item.isPublished !== false
  );
  const [filter, setFilter] = useState<"all" | "marico" | "robi" | "nestle">("all");
  const [expandedHistorical, setExpandedHistorical] = useState(false);

  const filteredRoles = careerJourney.filter((item) => {
    if (filter === "all") return true;
    if (filter === "marico") return item.company.toLowerCase().includes("marico");
    if (filter === "robi") return item.company.toLowerCase().includes("robi");
    if (filter === "nestle") return item.company.toLowerCase().includes("nestl");
    return true;
  });

  return (
    <section id="career" className="py-24 sm:py-32 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/[0.08] gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12]">
              {sectionConfig?.customTitle || "Multinational Operational Trajectory"}
            </h2>
            {sectionConfig?.customSubtitle && (
              <p className="text-slate-400 text-sm sm:text-base mt-2 font-light leading-relaxed">
                {sectionConfig.customSubtitle}
              </p>
            )}
          </div>

          {/* Segmented Filter Controls */}
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 sm:flex-wrap touch-pan-x">
              {[
                { id: "all", label: "Complete Dossier" },
                { id: "marico", label: "Marico Bangladesh" },
                { id: "robi", label: "Robi Axiata" },
                { id: "nestle", label: "Nestlé Bangladesh" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id as "all" | "marico" | "robi" | "nestle")}
                  className={`px-5 py-2.5 min-h-[44px] text-xs font-sans uppercase tracking-wider transition-all shrink-0 flex items-center justify-center ${
                    filter === tab.id
                      ? "bg-[#D4AF37] text-[#070A11] font-bold"
                      : "bg-[#0C111C] border border-white/10 text-slate-400 hover:text-white hover:border-[#D4AF37]/40 font-medium"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Executive Career Dossier Ledger */}
        <div className="space-y-12">
          {filteredRoles.map((role, idx) => {
            const isHistoricalRole = filter === "all" && idx >= 2;

            return (
              <article
                key={role.id}
                className="bg-[#0C111C] border border-white/10 p-6 sm:p-10 lg:p-12 hover:border-[#D4AF37]/40 transition-colors"
              >
                {/* Header: Company, Role, Chronology & Location */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between pb-8 mb-8 border-b border-white/[0.08] gap-6">
                  <div className="flex items-start gap-5">
                    <div className="relative w-14 h-14 bg-white p-2 flex items-center justify-center shrink-0 border border-slate-300 shadow-sm">
                      <Image
                        src={role.logo}
                        alt={`${role.company} official insignia`}
                        fill
                        unoptimized
                        sizes="56px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                          {role.company}
                        </span>
                        {role.type === "current" && (
                          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5">
                            Active Mandate
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {role.role}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end text-xs font-sans text-slate-400 gap-1.5 shrink-0">
                    <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                      <span>{role.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span>{role.location}</span>
                    </div>
                  </div>
                </div>

                {/* Scope & Strategic Mandate Summary */}
                <div className="mb-8 p-5 bg-[#070A11] border border-white/[0.06] text-sm text-slate-300 font-light leading-relaxed max-w-[65ch]">
                  <strong className="text-white font-medium">Jurisdiction &amp; Commercial Scope: </strong>
                  {role.industryContext}
                </div>

                {/* Collapsible Section for Historical Tenures */}
                {isHistoricalRole && !expandedHistorical ? (
                  <div className="pt-2 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setExpandedHistorical(true)}
                      className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] text-xs font-sans font-semibold uppercase tracking-wider text-[#D4AF37] hover:text-white bg-[#070A11] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all"
                    >
                      <span>Review Detailed Operational Mandates &amp; Accolades</span>
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 2-Column Detail: Responsibilities & Key Achievements */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      
                      {/* Core Responsibilities */}
                      <div>
                        <h4 className="text-xs font-sans font-semibold uppercase tracking-widest text-slate-300 mb-4 pb-2 border-b border-white/[0.06]">
                          Core Operational Mandates
                        </h4>
                        <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                          {role.keyResponsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-3">
                              <span className="text-[#D4AF37] shrink-0 mt-1" aria-hidden="true">&bull;</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Documented Achievements */}
                      <div>
                        <h4 className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37] mb-4 pb-2 border-b border-white/[0.06] flex items-center gap-2">
                          <Award className="w-4 h-4" aria-hidden="true" />
                          <span>Audited Accolades &amp; Citations</span>
                        </h4>
                        <ul className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {role.achievements.map((ach, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-3 py-1.5 border-b border-white/[0.04] last:border-0">
                              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
                              <span className="text-slate-200">{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {isHistoricalRole && expandedHistorical && (
                      <div className="mt-8 pt-4 border-t border-white/[0.06] flex justify-end">
                        <button
                          type="button"
                          onClick={() => setExpandedHistorical(false)}
                          className="inline-flex items-center gap-1.5 text-xs font-sans text-slate-400 hover:text-white py-2"
                        >
                          <span>Collapse Historical Details</span>
                          <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
