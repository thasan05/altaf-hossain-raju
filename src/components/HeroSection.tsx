"use client";

import React from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { ArrowDown, ArrowUpRight, Award, Users, ShieldCheck, GraduationCap } from "lucide-react";

export default function HeroSection() {
  const { profile } = PORTFOLIO_DATA;

  const keyFacts = [
    {
      icon: Award,
      metric: "2x Global CEO Award",
      detail: "Marico Bangladesh Limited",
    },
    {
      icon: Users,
      metric: "24,000+ Community",
      detail: "Founder, LinkedIn Community BD",
    },
    {
      icon: ShieldCheck,
      metric: "PMP® Certified",
      detail: "PMI Global Credential",
    },
    {
      icon: GraduationCap,
      metric: "IBA DU Executive MBA",
      detail: "Major in Marketing",
    },
  ];

  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-28 border-b border-white/[0.08] bg-[#070A11]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Editorial Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Typographic Monograph & Value Statement (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Primary Headline: Large, Authoritative, Unadorned Serif */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.08] font-bold tracking-tight text-white mb-6">
              Building Businesses. <br />
              <span className="font-semibold text-[#F1F5F9]">Empowering People.</span> <br />
              Creating Enduring Impact.
            </h1>

            {/* Credential Authority Line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-sans uppercase tracking-widest text-[#D4AF37] font-semibold mb-6 pb-6 border-b border-white/10">
              <span>Area Manager, Marico</span>
              <span className="text-slate-600" aria-hidden="true">&bull;</span>
              <span>Founder, LCB (24k+ Members)</span>
              <span className="text-slate-600" aria-hidden="true">&bull;</span>
              <span>PMP® Certified</span>
              <span className="text-slate-600" aria-hidden="true">&bull;</span>
              <span>IBA DU EMBA</span>
            </div>

            {/* Core Narrative Bio */}
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl mb-8">
              A seasoned multinational commercial strategist with over seven years of operational route-to-market execution across Marico Bangladesh, Robi Axiata, and Nestlé. Dedicated to converting commercial rigor into high-velocity revenue growth, while building nationwide capability pipelines for Bangladesh&apos;s next generation of professionals.
            </p>

            {/* Distinctive Executive Action Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-12">
              <a
                href="#career"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#070A11] bg-[#D4AF37] hover:bg-[#d8b56f] transition-all text-center min-h-[44px]"
              >
                <span>Review Career Dossier</span>
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-white bg-[#0C111C] hover:bg-[#121A2B] border border-white/15 hover:border-white/30 transition-all text-center min-h-[44px]"
              >
                <span>Verified LinkedIn Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span className="sr-only">(opens in new window)</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-sans uppercase tracking-wider text-slate-400 hover:text-[#D4AF37] transition-colors text-center min-h-[44px]"
              >
                <span>Initiate Contact &rarr;</span>
              </a>
            </div>

            {/* Institutional Credentials Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              {keyFacts.map((fact, idx) => {
                const IconComponent = fact.icon;
                return (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-[#D4AF37] mb-1">
                      <IconComponent className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span className="font-mono text-xs font-bold text-slate-100 truncate">
                        {fact.metric}
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 font-sans truncate">
                      {fact.detail}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Architectural Executive Portrait Frame (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[380px] sm:max-w-[420px] bg-[#0C111C] p-3 sm:p-4 border border-white/10 shadow-2xl">
              
              {/* Main Portrait with Rich Natural Crop */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#070A11] border border-white/5">
                <Image
                  src={profile.images.portraitMain}
                  alt="Altaf Hossain Raju, PMP® - Area Manager at Marico Bangladesh and Founder of LinkedIn Community Bangladesh"
                  fill
                  priority
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 380px, 420px"
                  className="object-cover object-top filter contrast-[1.04]"
                />
              </div>

              {/* Documentary Inset Caption */}
              <div className="pt-4 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="text-slate-200 font-semibold uppercase tracking-wider">
                  Md. Altaf Hossain Raju
                </span>
                <span className="text-[#D4AF37]">
                  Dhaka, BD
                </span>
              </div>
              <p className="pt-1.5 text-xs text-slate-300 font-light leading-relaxed">
                Dual operational leadership: FMCG corporate distribution architecture and nationwide youth professional development.
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
