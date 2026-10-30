"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Users, ArrowUpRight } from "lucide-react";

export default function SpeakingSection() {
  const { speakingEngagements } = PORTFOLIO_DATA;
  const [filterType, setFilterType] = useState<string>("All");

  const types = ["All", "Masterclass", "Summit", "Keynote", "Panel Discussion", "Workshop"];

  const filteredEvents = speakingEngagements.filter((e) => {
    if (filterType === "All") return true;
    return e.type === filterType;
  });

  return (
    <section id="speaking" className="py-20 sm:py-28 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Keynotes, Masterclasses &amp; University Engagements
            </h2>
          </div>

          {/* Type Filter Controls with Smooth Scroll */}
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 sm:flex-wrap touch-pan-x">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2.5 min-h-[44px] text-xs font-sans uppercase tracking-wider font-semibold transition-all shrink-0 flex items-center justify-center ${
                    filterType === type
                      ? "bg-[#D4AF37] text-[#070A11]"
                      : "bg-[#0C111C] border border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photojournalistic Speaking Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-[#0C111C] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/40 transition-colors"
            >
              <div>
                
                {/* Event Photo Frame */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#070A11]">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover object-center filter contrast-[1.04] hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#070A11]/90 border border-white/10 px-2.5 py-1 text-xs font-sans uppercase tracking-wider text-[#D4AF37] font-bold">
                    {event.type}
                  </div>
                </div>

                {/* Event Body */}
                <div className="p-6">
                  
                  {/* Venue & Organizer */}
                  <div className="flex items-center justify-between text-xs font-sans text-slate-400 mb-2">
                    <span className="text-[#D4AF37] font-semibold">{event.institution}</span>
                    {event.participants && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Users className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        <span className="font-mono text-xs">{event.participants}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-3 leading-snug">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Key Topics Tag Strip */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                    {event.keyTopics.map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs font-sans px-2.5 py-1 bg-[#070A11] border border-white/[0.06] text-slate-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                </div>

              </div>

              {/* Inquiry Action */}
              <div className="px-6 py-3.5 bg-[#070A11] border-t border-white/[0.08] flex items-center justify-between text-xs font-sans text-slate-400">
                <span className="truncate mr-2">Organizer: {event.organizer}</span>
                <a
                  href="#contact?intent=speaker"
                  className="text-[#D4AF37] hover:underline flex items-center gap-1 uppercase tracking-wider font-semibold min-h-[44px] shrink-0"
                >
                  <span>Book Speaker</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
