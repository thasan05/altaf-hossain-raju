"use client";

import React from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { LivePortfolioData } from "@/lib/dal";
import { GraduationCap, Building2 } from "lucide-react";

interface AboutSectionProps {
  profile?: LivePortfolioData["profile"];
  leadershipRoles?: LivePortfolioData["leadershipRoles"];
  sectionConfig?: {
    customTitle?: string | null;
    customSubtitle?: string | null;
  };
}

export default function AboutSection({
  profile: propProfile,
  leadershipRoles: propLeadershipRoles,
  sectionConfig,
}: AboutSectionProps = {}) {
  const profile = propProfile || PORTFOLIO_DATA.profile;
  const leadershipRoles = (propLeadershipRoles || PORTFOLIO_DATA.leadershipRoles).filter(
    (r) => r.isPublished !== false
  );

  const corePillars = [
    {
      title: "Commercial Execution & Route-to-Market",
      desc: "Architecting alternative distribution channels, distributor ROI models, and data-driven sales operations across critical national territories.",
    },
    {
      title: "High-Performance Team Governance",
      desc: "Supervising and empowering multi-tier territory officers, resolving operational grievances, and fostering high-retention commercial cultures.",
    },
    {
      title: "Youth Employability & Social Capital",
      desc: "Building structured platforms (LCB, Skill Hunt) that equip university students with corporate readiness, digital branding, and networking avenues.",
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Pure Editorial Stature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16 pb-8 border-b border-white/[0.08]">
          <div className="lg:col-span-8">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12]">
              {sectionConfig?.customTitle ? (
                sectionConfig.customTitle
              ) : (
                <>
                  Commercial Acumen in the Boardroom. <br />
                  <span className="font-semibold text-slate-200 italic">Empathetic Leadership in the Community.</span>
                </>
              )}
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pt-2">
            <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
              {sectionConfig?.customSubtitle ||
                "Bridging multinational business discipline with grassroots youth capability development to cultivate Bangladesh's next echelon of operational leaders."}
            </p>
          </div>
        </div>

        {/* Monograph Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Authentic Photographic Artifact & Philosophy (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            
            {/* Architectural Portrait Frame */}
            <div className="bg-[#0C111C] p-3.5 sm:p-5 border border-white/10 shadow-2xl">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#070A11] border border-white/[0.06]">
                <Image
                  src={profile.images.portraitCorporate || "/images/altaf-portrait-corporate.jpg"}
                  alt={`${profile.displayName || "Altaf Hossain Raju"} - Executive Portrait`}
                  fill
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 420px"
                  className="object-cover object-center filter contrast-[1.03]"
                />
              </div>

              {/* Academic Enrollment Meta */}
              <div className="pt-4 border-t border-white/[0.08] mt-3">
                <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
                  <GraduationCap className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Executive Studies</span>
                </div>
                <div className="font-serif text-base font-bold text-white">
                  Institute of Business Administration (IBA), DU
                </div>
                <div className="text-xs text-slate-400 font-sans mt-0.5">
                  Executive MBA &bull; Marketing Strategy &bull; Class of 2026
                </div>
              </div>
            </div>

            {/* Literary Philosophy Pull Quote */}
            <div className="p-6 sm:p-8 bg-[#0C111C] border border-white/10">
              <blockquote className="font-serif italic text-lg sm:text-xl text-slate-100 leading-relaxed mb-4">
                &ldquo;{profile.philosophy}&rdquo;
              </blockquote>
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-sans text-slate-400">
                <span className="text-[#D4AF37] font-semibold">{profile.fullName || "Altaf Hossain Raju"}, {profile.honorificSuffix || "PMP®"}</span>
                <span>Area Manager, Marico</span>
              </div>
            </div>

          </div>

          {/* Right Column: In-depth Executive Narrative & Pillars (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-10">
            
            {/* Bio Paragraphs with Strict Editorial Reading Width */}
            <div className="space-y-6 text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-[65ch]">
              {profile.executiveBio.map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? "text-slate-100 font-normal leading-relaxed text-lg sm:text-xl" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Strategic Competency Pillars (Editorial Hairline Ledger) */}
            <div className="pt-8 border-t border-white/[0.08]">
              <h3 className="font-serif text-2xl font-bold text-white mb-6">
                Strategic Competency Pillars
              </h3>
              <div className="space-y-6">
                {corePillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="pb-6 border-b border-white/[0.06] last:border-0 last:pb-0"
                  >
                    <h4 className="font-serif text-lg font-bold text-white mb-2">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-slate-400 font-light leading-relaxed max-w-[65ch]">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Affiliations & Governance Directory */}
            {leadershipRoles.length > 0 && (
              <div className="pt-8 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-bold text-white">
                    Institutional Affiliations &amp; Governance
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  {leadershipRoles.map((role, idx) => (
                    <div key={idx} className="p-4 bg-[#0C111C] border border-white/[0.08] flex flex-col justify-between">
                      <span className="font-semibold text-slate-100 text-sm mb-1">{role.role}</span>
                      <div className="text-slate-400 mt-2 flex items-center justify-between border-t border-white/[0.04] pt-2">
                        <span className="truncate">{role.organization}</span>
                        <span className="text-[#D4AF37] font-sans font-semibold shrink-0 ml-2">{role.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
