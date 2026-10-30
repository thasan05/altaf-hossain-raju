"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { CheckCircle2, Award, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";

export default function CareerTimeline() {
  const { careerJourney } = PORTFOLIO_DATA;
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
    <section id="career" className="py-20 sm:py-28 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Multinational Operational Trajectory
            </h2>
          </div>

          {/* Clean Segmented Filter Controls with Scroll Edge Fade */}
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 sm:flex-wrap touch-pan-x">
              {[
                { id: "all", label: "All Tenures" },
                { id: "marico", label: "Marico Bangladesh" },
                { id: "robi", label: "Robi Axiata" },
                { id: "nestle", label: "Nestlé Bangladesh" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id as "all" | "marico" | "robi" | "nestle")}
                  className={`px-4 py-2.5 min-h-[44px] text-xs font-sans uppercase tracking-wider transition-all shrink-0 flex items-center justify-center ${
                    filter === tab.id
                      ? "bg-[#D4AF37] text-[#070A11] font-bold"
                      : "bg-[#0C111C] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 font-medium"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Executive Career Dossier Ledger */}
        <div className="space-y-8 sm:space-y-12">
          {filteredRoles.map((role, idx) => {
            // In "All" view, automatically expand current & recent Marico roles (idx < 2);
            // provide a progressive disclosure toggle for historical Robi & Nestle tenures (idx >= 2).
            const isHistoricalRole = filter === "all" && idx >= 2;

            return (
              <div
                key={role.id}
                className="bg-[#0C111C] border border-white/10 p-6 sm:p-8 lg:p-10 hover:border-[#D4AF37]/40 transition-colors"
              >
                {/* Header: Company, Role, Chronology & Location */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-white/[0.08] gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="relative w-12 h-12 bg-white p-1.5 flex items-center justify-center shrink-0 border border-slate-300">
                      <Image
                        src={role.logo}
                        alt={`${role.company} logo`}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                          {role.company}
                        </span>
                        {role.type === "current" && (
                          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5">
                            Active Role
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                        {role.role}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end text-xs font-mono text-slate-400 gap-1">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                      <span>{role.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span className="font-sans">{role.location}</span>
                    </div>
                  </div>
                </div>

                {/* Context Summary */}
                <div className="mb-6 p-4 bg-[#070A11] border border-white/[0.06] text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  <strong className="text-white font-medium">Jurisdiction &amp; Scope: </strong>
                  {role.industryContext}
                </div>

                {/* Collapsible Section for Historical Tenures */}
                {isHistoricalRole && !expandedHistorical ? (
                  <div className="pt-2 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setExpandedHistorical(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-sans font-semibold uppercase tracking-wider text-[#D4AF37] hover:text-white bg-[#070A11] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all"
                    >
                      <span>Expand Operational Mandates &amp; Accolades</span>
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 2-Column Detail: Responsibilities & Key Achievements */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Core Responsibilities */}
                      <div>
                        <h4 className="text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-white/[0.06]">
                          Core Operational Mandates
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                          {role.keyResponsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2.5">
                              <span className="text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true">&bull;</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Documented Achievements */}
                      <div>
                        <h4 className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37] mb-4 pb-2 border-b border-white/[0.06] flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Audited Achievements &amp; Accolades</span>
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
                      <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-end">
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
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
