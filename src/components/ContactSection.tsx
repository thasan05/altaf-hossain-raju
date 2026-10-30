"use client";

import React, { useState, useEffect } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
  AlertCircle,
  MessageCircle,
  Building
} from "lucide-react";

export default function ContactSection() {
  const { profile } = PORTFOLIO_DATA;
  const { contact } = profile;

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    intent: "Keynote / Speaker Engagement",
    message: "",
    honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Sync intent from URL query or hash params (e.g. #contact?intent=speaker)
  useEffect(() => {
    const syncIntentFromUrl = () => {
      try {
        const hash = window.location.hash;
        const search = window.location.search;
        const fullUrl = new URL(window.location.href);
        const intentParam = fullUrl.searchParams.get("intent");

        if (intentParam === "speaker" || hash.includes("intent=speaker") || search.includes("intent=speaker")) {
          setFormData((prev) => ({ ...prev, intent: "Keynote / Speaker Engagement" }));
        } else if (intentParam === "consultation" || hash.includes("intent=consultation") || search.includes("intent=consultation")) {
          setFormData((prev) => ({ ...prev, intent: "Commercial Strategy & P&L" }));
        } else if (intentParam === "mentorship" || hash.includes("intent=mentorship") || search.includes("intent=mentorship")) {
          setFormData((prev) => ({ ...prev, intent: "Youth Mentorship & Masterclass" }));
        }
      } catch {
        // Safe fallback in static contexts
      }
    };

    syncIntentFromUrl();
    window.addEventListener("hashchange", syncIntentFromUrl);
    return () => window.removeEventListener("hashchange", syncIntentFromUrl);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please complete all required fields (Name, Email, and Message).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");

    const subject = encodeURIComponent(`[Executive Inquiry - ${formData.intent}] from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.organization || "N/A"}\nInquiry Type: ${formData.intent}\n\nMessage:\n${formData.message}`
    );

    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setStatus("success");
    }, 800);
  };

  const cleanPhone = contact.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20Altaf%20Hossain%20Raju,%20reaching%20out%20via%20your%20portfolio.`;

  return (
    <section id="contact" className="py-24 sm:py-32 lg:py-36 border-b border-white/[0.08] bg-[#070A11] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/[0.08] gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12]">
              Executive Inquiries &amp; Direct Dialogue
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md font-light leading-relaxed">
            Open for executive FMCG leadership opportunities, keynote symposiums, corporate training masterclasses, and strategic community partnerships.
          </p>
        </div>

        {/* 2-Column Monograph Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Dossier Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Email Card */}
            <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#070A11] border border-white/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4AF37] block mb-1">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-sans text-sm sm:text-base text-white hover:text-[#D4AF37] transition-colors break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                title="Copy Email Address"
                aria-label="Copy Email Address"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0C111C] border border-white/10 p-5">
                <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                  <span>Direct Line</span>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="font-sans text-xs sm:text-sm text-white hover:text-[#D4AF37] transition-colors block font-medium"
                >
                  {contact.phone}
                </a>
              </div>

              <div className="bg-[#0C111C] border border-white/10 p-5">
                <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>WhatsApp</span>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs sm:text-sm text-white hover:text-emerald-300 transition-colors block font-medium"
                >
                  <span>Direct Message &rarr;</span>
                  <span className="sr-only">(opens in new window)</span>
                </a>
              </div>
            </div>

            {/* Official LinkedIn */}
            <div className="bg-[#0C111C] border border-white/10 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#070A11] border border-white/10 flex items-center justify-center text-sky-400 shrink-0">
                  <LinkedinIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                    Verified LinkedIn
                  </div>
                  <div className="font-serif text-base font-semibold text-white">
                    24,000+ Professional Network
                  </div>
                </div>
              </div>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-sans font-semibold uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1 min-h-[44px]"
              >
                <span>Connect</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in new window)</span>
              </a>
            </div>

            {/* Geographic Residence */}
            <div className="bg-[#0C111C] border border-white/10 p-5 flex items-start gap-3.5 text-xs text-slate-400 font-sans">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-slate-200 block mb-0.5">{contact.address}</span>
                <span>Origins: {contact.origin}</span>
              </div>
            </div>

            {/* Corporate Supervisor References Note */}
            <div className="pt-6 border-t border-white/[0.08]">
              <div className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span>Verified Corporate Supervisor References</span>
              </div>
              <div className="space-y-3 text-xs font-sans bg-[#070A11] p-5 border border-white/[0.06]">
                <div>
                  <div className="font-semibold text-slate-100 text-sm">Taifur Ferdous</div>
                  <div className="text-slate-400">Head of NGM Sales &amp; Trade Marketing, Marico Bangladesh Limited</div>
                </div>
                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="font-semibold text-slate-100 text-sm">Shovan Chakraborty</div>
                  <div className="text-slate-400">Cluster Market Director, Robi Axiata PLC</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Architectural Message Dispatcher (7 cols) */}
          <div className="lg:col-span-7 bg-[#0C111C] border border-white/10 p-8 sm:p-12">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Dispatch an Inquiry
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light mb-8 max-w-[65ch]">
              Select your inquiry objective below. Submitting will format and launch your email client with structured recipient telemetry.
            </p>

            {status === "error" && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-300 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            {status === "success" && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Your structured email draft has been prepared and opened in your email client.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Anti-spam Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
              />

              {/* Inquiry Objective Picker */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-3">
                  Inquiry Objective *
                </label>
                <div
                  role="radiogroup"
                  aria-label="Inquiry Objective"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {[
                    "Keynote / Speaker Engagement",
                    "Commercial Strategy & P&L",
                    "Youth Mentorship & Masterclass",
                    "Executive Media / Interview",
                  ].map((intentOption) => (
                    <button
                      type="button"
                      key={intentOption}
                      role="radio"
                      aria-checked={formData.intent === intentOption}
                      onClick={() => setFormData({ ...formData, intent: intentOption })}
                      className={`px-4 py-3.5 min-h-[44px] text-xs font-sans text-left border transition-all flex items-center ${
                        formData.intent === intentOption
                          ? "bg-[#D4AF37] text-[#070A11] font-bold border-[#D4AF37] shadow-sm"
                          : "bg-[#070A11] border-white/10 text-slate-400 hover:text-white hover:border-[#D4AF37]/40"
                      }`}
                    >
                      {intentOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mahfuz Rahman"
                    className="w-full px-4 py-3.5 bg-[#070A11] border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. mahfuz@example.com"
                    className="w-full px-4 py-3.5 bg-[#070A11] border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              {/* Organization */}
              <div>
                <label htmlFor="organization" className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Company / Institutional Affiliation (Optional)
                </label>
                <input
                  type="text"
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Multinational, University, Chamber"
                  className="w-full px-4 py-3.5 bg-[#070A11] border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Scope of Inquiry &bull; Details *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe the opportunity, keynote date, venue, or commercial agenda..."
                  className="w-full px-4 py-3.5 bg-[#070A11] border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 min-h-[48px] text-xs font-sans uppercase tracking-widest font-bold text-[#070A11] bg-[#D4AF37] hover:bg-[#d8b56f] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{status === "submitting" ? "Synthesizing Mail Draft..." : "Dispatch Executive Inquiry"}</span>
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
