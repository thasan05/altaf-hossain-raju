"use client";

import React from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { ShieldCheck } from "lucide-react";

export default function CredentialsSection() {
  const { credentials } = PORTFOLIO_DATA;

  return (
    <section id="credentials" className="py-20 sm:py-28 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Academic Foundation &amp; Professional Accreditations
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg font-light leading-relaxed">
            Distinguishing completed undergraduate degrees, ongoing executive studies at IBA University of Dhaka, and globally certified project management qualifications.
          </p>
        </div>

        {/* Credentials Institutional Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {credentials.map((cred) => {
            const isPursuing = cred.status.includes("Pursuing");
            const isPmp = cred.id === "pmp";

            return (
              <div
                key={cred.id}
                className={`p-6 sm:p-8 flex flex-col justify-between transition-colors ${
                  isPmp || isPursuing
                    ? "bg-[#0C111C] border border-[#D4AF37]/40 hover:border-[#D4AF37]"
                    : "bg-[#0C111C] border border-white/10 hover:border-white/25"
                }`}
              >
                <div>
                  
                  {/* Status & Logo header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                    <span
                      className={`text-xs font-sans font-semibold uppercase tracking-wider px-2.5 py-1 ${
                        isPursuing || isPmp
                          ? "bg-[#D4AF37]/15 text-[#FCD34D] border border-[#D4AF37]/30"
                          : "bg-white/[0.06] text-slate-300 border border-white/10"
                      }`}
                    >
                      {cred.status}
                    </span>

                    {cred.logo && (
                      <div className="relative w-10 h-10 bg-white p-1 flex items-center justify-center shrink-0 border border-slate-300">
                        <Image
                          src={cred.logo}
                          alt={cred.institution}
                          fill
                          unoptimized
                          sizes="40px"
                          className="object-contain p-0.5"
                        />
                      </div>
                    )}
                  </div>

                  {/* Title & Institution */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-1.5 leading-snug">
                    {cred.title}
                  </h3>
                  <div className="text-xs font-sans font-semibold text-[#D4AF37] mb-3">
                    {cred.institution}
                  </div>

                  {/* Field & Period */}
                  <div className="text-xs font-sans text-slate-400 mb-4 pb-3 border-b border-white/[0.06] flex items-center justify-between">
                    <span className="text-slate-300 truncate">{cred.field}</span>
                    <span className="font-mono text-xs shrink-0 ml-2">{cred.periodOrYear}</span>
                  </div>

                  {/* Details */}
                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-6">
                    {cred.details}
                  </p>

                </div>

                {/* Verification Footer */}
                <div className="pt-3.5 border-t border-white/[0.08] flex items-center gap-1.5 text-xs font-sans text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span className="truncate">{cred.verificationNote}</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Corporate Awards Row */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <h3 className="font-serif text-2xl font-bold text-white mb-6">
            Documented Corporate Honors &amp; CEO Citations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO_DATA.awards.map((award, aIdx) => (
              <div
                key={aIdx}
                className="p-5 bg-[#0C111C] border border-white/10 hover:border-[#D4AF37]/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="text-[#D4AF37]">{award.organization}</span>
                  <span>{award.year}</span>
                </div>
                <h4 className="font-serif text-base font-bold text-white mb-2">
                  {award.title}
                </h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {award.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
