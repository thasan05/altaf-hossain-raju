"use client";

import React from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { ShieldCheck, Award } from "lucide-react";

export default function CredentialsSection() {
  const { credentials, awards } = PORTFOLIO_DATA;

  const premierCredentials = credentials.filter(
    (c) => c.id === "pmp" || c.status.includes("Pursuing")
  );
  const foundationalCredentials = credentials.filter(
    (c) => c.id !== "pmp" && !c.status.includes("Pursuing")
  );

  return (
    <section id="credentials" className="py-24 sm:py-32 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/[0.08] gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12]">
              Academic Foundation &amp; Professional Accreditations
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md font-light leading-relaxed">
            Distinguishing completed undergraduate degrees, ongoing executive studies at IBA University of Dhaka, and globally certified project management qualifications.
          </p>
        </div>

        {/* Zone 1: Premier Institutional Anchors (Dual Stature Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {premierCredentials.map((cred) => (
            <div
              key={cred.id}
              className="bg-[#0C111C] border border-[#D4AF37]/40 p-8 sm:p-10 flex flex-col justify-between hover:border-[#D4AF37] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.08]">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider px-3 py-1 bg-[#D4AF37]/15 text-[#FCD34D] border border-[#D4AF37]/30">
                    {cred.status}
                  </span>

                  {cred.logo && (
                    <div className="relative w-12 h-12 bg-white p-1.5 flex items-center justify-center shrink-0 border border-slate-300 shadow-sm">
                      <Image
                        src={cred.logo}
                        alt={`${cred.institution} insignia`}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 leading-snug">
                  {cred.title}
                </h3>
                <div className="text-sm font-sans font-semibold text-[#D4AF37] mb-4">
                  {cred.institution}
                </div>

                <div className="text-xs font-sans text-slate-400 mb-6 pb-4 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-slate-200">{cred.field}</span>
                  <span className="tabular-nums font-medium text-slate-300">{cred.periodOrYear}</span>
                </div>

                <p className="text-sm text-slate-300 font-light leading-relaxed mb-6 max-w-[65ch]">
                  {cred.details}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs font-sans text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span className="truncate">{cred.verificationNote}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Zone 2: Foundational Academic Degrees & Diplomas Ledger */}
        <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8 mb-16">
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37] block mb-4 pb-2 border-b border-white/[0.08]">
            Foundational Degrees &amp; Professional Certifications
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {foundationalCredentials.map((cred) => (
              <div key={cred.id} className="p-4 bg-[#070A11] border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-sans text-slate-400 mb-2">
                    <span className="text-[#D4AF37] font-medium">{cred.status}</span>
                    <span className="tabular-nums">{cred.periodOrYear}</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-white mb-1">
                    {cred.title}
                  </h4>
                  <div className="text-xs text-slate-300 font-medium mb-3">
                    {cred.institution}
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                    {cred.details}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/[0.04] text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span className="truncate">{cred.verificationNote}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone 3: Documented Corporate Honors & CEO Citations Ledger */}
        <div className="pt-8 border-t border-white/[0.08]">
          <div className="flex items-center gap-2.5 mb-6">
            <Award className="w-5 h-5 text-[#D4AF37]" aria-hidden="true" />
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Documented Corporate Honors &amp; CEO Citations
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, aIdx) => (
              <div
                key={aIdx}
                className="p-6 bg-[#0C111C] border border-white/10 hover:border-[#D4AF37]/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-sans text-slate-400 mb-3 pb-2 border-b border-white/[0.06]">
                    <span className="text-[#D4AF37] font-semibold uppercase tracking-wider">{award.organization}</span>
                    <span className="tabular-nums font-medium text-slate-300">{award.year}</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2 leading-snug">
                    {award.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-[65ch]">
                    {award.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
