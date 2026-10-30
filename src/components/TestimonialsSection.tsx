"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { ShieldCheck, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const { testimonials } = PORTFOLIO_DATA;

  return (
    <section id="testimonials" className="py-24 sm:py-32 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/[0.08] gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12]">
              Community Voices &amp; Mentee Testimonials
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md font-light leading-relaxed">
            Reflections from university campus ambassadors, student leaders, and nationwide workshop participants empowered through LCB.
          </p>
        </div>

        {/* Testimonials Literary Spread */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-[#0C111C] border border-white/10 p-8 sm:p-10 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-colors"
            >
              <div>
                <Quote className="w-6 h-6 text-[#D4AF37]/40 mb-6" aria-hidden="true" />
                
                <blockquote className="font-serif italic text-base sm:text-lg text-slate-100 leading-relaxed mb-8 max-w-[65ch]">
                  &ldquo;{test.quote}&rdquo;
                </blockquote>
              </div>

              <div className="pt-6 border-t border-white/[0.08] flex items-start justify-between gap-4">
                <div>
                  <div className="font-serif text-base font-bold text-white">
                    {test.name}
                  </div>
                  <div className="text-xs text-slate-300 font-sans mt-0.5">
                    {test.role} &bull; {test.organization}
                  </div>
                  <div className="text-xs text-[#D4AF37] font-sans mt-1 font-medium">
                    {test.context}
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
