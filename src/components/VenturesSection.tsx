"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { ExternalLink, CheckCircle2 } from "lucide-react";

export default function VenturesSection() {
  const { ventures } = PORTFOLIO_DATA;
  const [activeTab, setActiveTab] = useState<string>(ventures[0].id);

  const selectedVenture = ventures.find((v) => v.id === activeTab) || ventures[0];

  return (
    <section id="ventures" className="py-20 sm:py-28 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Strategic Ventures &amp; Community Ecosystems
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg font-light leading-relaxed">
            Pioneering nationwide youth development platforms that transform campus talent into corporate leaders through structured mentorship and personal branding.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-10 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {ventures.map((venture) => (
            <button
              key={venture.id}
              type="button"
              onClick={() => setActiveTab(venture.id)}
              className={`px-5 py-3 min-h-[44px] font-sans text-xs uppercase tracking-wider font-semibold transition-all shrink-0 flex items-center justify-center ${
                activeTab === venture.id
                  ? "bg-[#D4AF37] text-[#070A11]"
                  : "bg-[#0C111C] border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <span>{venture.name}</span>
              {venture.acronym && <span className="ml-2 opacity-75">[{venture.acronym}]</span>}
            </button>
          ))}
        </div>

        {/* Major Venture Feature Box */}
        <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Narrative, Story & Milestones (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                
                {/* Meta Ribbon */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-sans mb-4 text-slate-400 font-medium">
                  <span className="text-[#D4AF37] font-semibold">Founded {selectedVenture.founded}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>Role: <strong className="text-white">{selectedVenture.role}</strong></span>
                  <span aria-hidden="true">&bull;</span>
                  <span className="text-emerald-400">{selectedVenture.status}</span>
                </div>

                {/* Venture Title & Tagline */}
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  {selectedVenture.name}
                </h3>
                <p className="font-serif italic text-base text-slate-300 mb-6 pb-6 border-b border-white/[0.08]">
                  &ldquo;{selectedVenture.tagline}&rdquo;
                </p>

                {/* Narrative Paragraph */}
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed mb-6">
                  {selectedVenture.description}
                </p>

                {/* Detailed Story Paragraph */}
                <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-8">
                  {selectedVenture.detailedStory}
                </p>

                {/* Impact Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-[#070A11] border border-white/[0.06] mb-8">
                  {selectedVenture.impactMetrics.map((metric, mIdx) => (
                    <div key={mIdx}>
                      <div className="font-serif text-2xl font-bold text-white mb-1">
                        {metric.value}
                      </div>
                      <div className="text-xs font-sans text-slate-300 leading-tight">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Highlights List */}
                <div className="space-y-2 mb-8">
                  {selectedVenture.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Link */}
              {selectedVenture.ctaUrl && (
                <div className="pt-6 border-t border-white/[0.08]">
                  <a
                    href={selectedVenture.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[44px] text-xs font-sans uppercase tracking-wider font-semibold text-[#070A11] bg-[#D4AF37] hover:bg-[#d8b56f] transition-colors"
                  >
                    <span>{selectedVenture.ctaLabel || "Visit Platform"}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="sr-only">(opens in new window)</span>
                  </a>
                </div>
              )}
            </div>

            {/* Right Column: Authentic Documentary Photography (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] bg-[#070A11] border border-white/10 overflow-hidden shadow-2xl">
                <Image
                  src={selectedVenture.featuredImage}
                  alt={`${selectedVenture.name} event visual`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                  className="object-cover object-center filter contrast-[1.04]"
                />
              </div>
              <div className="pt-3 flex items-center justify-between text-xs font-sans text-slate-400">
                <span>Verified Event Photography</span>
                <span>LCB National Network</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
