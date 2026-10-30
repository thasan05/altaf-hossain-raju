"use client";

import React from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { ArrowDown, ArrowUpRight, Award, Users, ShieldCheck, GraduationCap } from "lucide-react";

export default function HeroSection() {
  const { profile } = PORTFOLIO_DATA;

  const institutionalProof = [
    {
      icon: Award,
      metric: "2x Global CEO Award",
      context: "Marico Bangladesh Limited",
    },
    {
      icon: Users,
      metric: "24,000+ Professionals",
      context: "Founder, LinkedIn Community BD",
    },
    {
      icon: ShieldCheck,
      metric: "PMP® Certified",
      context: "PMI Global Credential",
    },
    {
      icon: GraduationCap,
      metric: "IBA DU Executive MBA",
      context: "Marketing Strategy Specialization",
    },
  ];

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-32 border-b border-white/[0.08] bg-[#070A11]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Asymmetric Broadsheet Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Authoritative Editorial Statement & Narrative (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Primary Headline: Newsreader Display with Balanced Cadence */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.06] font-bold tracking-tight text-white mb-6">
              Building Businesses. <br />
              <span className="font-semibold text-slate-100 italic">Empowering People.</span> <br />
              Creating Enduring Impact.
            </h1>

            {/* Institutional Provenance Bar */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-sans uppercase tracking-widest text-[#D4AF37] font-semibold mb-8 pb-6 border-b border-white/[0.08]">
              <span>Area Manager, Marico</span>
              <span className="text-slate-600" aria-hidden="true">&bull;</span>
              <span>Founder, LCB (24k+ Members)</span>
              <span className="text-slate-600" aria-hidden="true">&bull;</span>
              <span>PMP® Credential</span>
              <span className="text-slate-600" aria-hidden="true">&bull;</span>
              <span>IBA DU EMBA</span>
            </div>

            {/* Core Narrative Bio with Strict 65ch Measure */}
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-[65ch] mb-10">
              A multinational commercial strategist with over seven years of operational route-to-market execution across Marico Bangladesh, Robi Axiata, and Nestlé. Dedicated to converting commercial rigor into high-velocity revenue growth, while building nationwide capability pipelines for Bangladesh&apos;s next generation of professionals.
            </p>

            {/* Executive Action Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-14">
              <a
                href="#career"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#070A11] bg-[#D4AF37] hover:bg-[#d8b56f] transition-colors text-center min-h-[44px] shadow-sm"
              >
                <span>Review Career Dossier</span>
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-white bg-[#0C111C] hover:bg-[#131B2D] border border-white/15 hover:border-[#D4AF37]/50 transition-colors text-center min-h-[44px]"
              >
                <span>Verified LinkedIn Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span className="sr-only">(opens in new window)</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-sans uppercase tracking-wider text-slate-400 hover:text-[#D4AF37] transition-colors text-center min-h-[44px]"
              >
                <span>Initiate Contact &rarr;</span>
              </a>
            </div>

            {/* Institutional Credentials Ledger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/[0.08]">
              {institutionalProof.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex flex-col justify-start">
                    <div className="flex items-center gap-2 text-[#D4AF37] mb-1.5">
                      <IconComponent className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="font-sans text-xs font-bold text-slate-100 tracking-tight">
                        {item.metric}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-sans leading-snug">
                      {item.context}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Architectural Executive Portrait Monograph (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[390px] sm:max-w-[430px] bg-[#0C111C] p-3.5 sm:p-5 border border-white/10 shadow-2xl">
              
              {/* Main Portrait with Natural Photographic Aspect Ratio */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#070A11] border border-white/[0.06]">
                <Image
                  src={profile.images.portraitMain}
                  alt="Altaf Hossain Raju, PMP® - Area Manager at Marico Bangladesh and Founder of LinkedIn Community Bangladesh"
                  fill
                  priority
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 390px, 430px"
                  className="object-cover object-top filter contrast-[1.03]"
                />
              </div>

              {/* Documentary Caption & Provenance */}
              <div className="pt-4 flex items-center justify-between text-xs font-sans text-slate-300 border-t border-white/[0.06] mt-3">
                <span className="text-white font-semibold uppercase tracking-wider">
                  Md. Altaf Hossain Raju
                </span>
                <span className="text-[#D4AF37] font-medium">
                  Dhaka, Bangladesh
                </span>
              </div>
              <p className="pt-2 text-xs text-slate-400 font-light leading-relaxed">
                Dual operational leadership: FMCG corporate distribution architecture and nationwide youth professional capability development.
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
