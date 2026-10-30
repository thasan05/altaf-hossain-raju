"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { Save, Loader2, CheckCircle2, Image as ImageIcon, Plus, Trash2 } from "lucide-react";

export default function ProfileAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    displayName: "",
    shortName: "",
    initials: "",
    honorificSuffix: "",
    heroHeadline: "",
    heroSubheadline: "",
    heroNarrativeBio: "",
    executiveBio: [""],
    philosophy: "",
    portraitMainUrl: "",
    portraitCorporateUrl: "",
  });

  const [mediaPickerTarget, setMediaPickerTarget] = useState<"portraitMainUrl" | "portraitCorporateUrl" | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      if (res.ok) {
        const data = await res.json();
        setForm({
          fullName: data.fullName || "",
          displayName: data.displayName || "",
          shortName: data.shortName || "",
          initials: data.initials || "",
          honorificSuffix: data.honorificSuffix || "PMP®",
          heroHeadline: data.heroHeadline || "",
          heroSubheadline: data.heroSubheadline || "",
          heroNarrativeBio: data.heroNarrativeBio || "",
          executiveBio: Array.isArray(data.executiveBio) && data.executiveBio.length > 0 ? data.executiveBio : [""],
          philosophy: data.philosophy || "",
          portraitMainUrl: data.portraitMainUrl || "",
          portraitCorporateUrl: data.portraitCorporateUrl || "",
        });
      }
    } catch (err) {
      setErrorMsg("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccessMsg("Profile information saved and published to website!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Failed to update profile.");
      }
    } catch {
      setErrorMsg("Network error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleBioChange = (index: number, val: string) => {
    const updated = [...form.executiveBio];
    updated[index] = val;
    setForm({ ...form, executiveBio: updated });
  };

  const addBioParagraph = () => {
    setForm({ ...form, executiveBio: [...form.executiveBio, ""] });
  };

  const removeBioParagraph = (index: number) => {
    const updated = form.executiveBio.filter((_, i) => i !== index);
    setForm({ ...form, executiveBio: updated.length > 0 ? updated : [""] });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-2" />
        <span className="text-xs">Loading profile data...</span>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Executive Profile & Biography"
        subtitle="Manage personal brand identity, headlines, multi-paragraph executive narrative, and documentary portraits."
        breadcrumbs={[{ label: "Profile & Bio" }]}
      />

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-xs font-sans text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-300">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Section 1: Nomenclature & Brand Typography */}
        <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8">
          <h2 className="font-serif text-lg font-bold text-white mb-2 pb-3 border-b border-white/[0.08]">
            Brand Identity &amp; Nomenclature
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Display Name (With Credentials)
              </label>
              <input
                type="text"
                required
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Honorific Suffix Badge
              </label>
              <input
                type="text"
                value={form.honorificSuffix}
                onChange={(e) => setForm({ ...form, honorificSuffix: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Short Name / Heading Signature
              </label>
              <input
                type="text"
                value={form.shortName}
                onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Monogram Initials (Logo)
              </label>
              <input
                type="text"
                value={form.initials}
                onChange={(e) => setForm({ ...form, initials: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hero Section Messaging */}
        <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8">
          <h2 className="font-serif text-lg font-bold text-white mb-2 pb-3 border-b border-white/[0.08]">
            Hero Section Messaging
          </h2>
          <div className="space-y-6 mt-6">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Primary Hero Headline (Playfair Display)
              </label>
              <input
                type="text"
                required
                value={form.heroHeadline}
                onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Institutional Provenance &amp; Subheadline
              </label>
              <textarea
                rows={3}
                required
                value={form.heroSubheadline}
                onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Hero Core Narrative (65ch measure)
              </label>
              <textarea
                rows={3}
                value={form.heroNarrativeBio}
                onChange={(e) => setForm({ ...form, heroNarrativeBio: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Executive Bio & Philosophy */}
        <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-6">
            <h2 className="font-serif text-lg font-bold text-white">
              Executive Biography &amp; Leadership Philosophy
            </h2>
            <button
              type="button"
              onClick={addBioParagraph}
              className="px-3 py-1.5 bg-[#070A11] hover:bg-white/[0.04] border border-white/10 text-xs font-sans text-[#D4AF37] flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Paragraph</span>
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300">
              Biography Paragraphs
            </label>
            {form.executiveBio.map((para, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-xs font-mono text-[#D4AF37] pt-2 w-6 shrink-0">
                  #{idx + 1}
                </span>
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => handleBioChange(idx, e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
                {form.executiveBio.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBioParagraph(idx)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                    title="Remove paragraph"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Leadership Philosophy Quote
            </label>
            <textarea
              rows={2}
              value={form.philosophy}
              onChange={(e) => setForm({ ...form, philosophy: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed italic"
            />
          </div>
        </div>

        {/* Section 4: Authentic Documentary Portraits */}
        <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8">
          <h2 className="font-serif text-lg font-bold text-white mb-2 pb-3 border-b border-white/[0.08]">
            Documentary Portraits &amp; Assets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
            
            {/* Main Hero Portrait */}
            <div className="p-4 bg-[#070A11] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#D4AF37] block mb-3">
                  Hero Section Portrait
                </span>
                <div className="relative aspect-[4/5] w-full max-w-[240px] mx-auto overflow-hidden bg-[#0C111C] border border-white/10 mb-4">
                  {form.portraitMainUrl ? (
                    <Image
                      src={form.portraitMainUrl}
                      alt="Hero portrait"
                      fill
                      unoptimized
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      No image selected
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={form.portraitMainUrl}
                  onChange={(e) => setForm({ ...form, portraitMainUrl: e.target.value })}
                  placeholder="/images/altaf-portrait-lcb.webp"
                  className="w-full px-3 py-2 bg-[#0C111C] border border-white/10 text-xs text-white mb-2"
                />
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerTarget("portraitMainUrl")}
                className="w-full py-2 bg-[#0C111C] hover:bg-white/[0.06] border border-white/10 text-xs font-sans text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Select from Media Library</span>
              </button>
            </div>

            {/* Corporate Portrait */}
            <div className="p-4 bg-[#070A11] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#D4AF37] block mb-3">
                  About Section Portrait
                </span>
                <div className="relative aspect-[4/5] w-full max-w-[240px] mx-auto overflow-hidden bg-[#0C111C] border border-white/10 mb-4">
                  {form.portraitCorporateUrl ? (
                    <Image
                      src={form.portraitCorporateUrl}
                      alt="Corporate portrait"
                      fill
                      unoptimized
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      No image selected
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={form.portraitCorporateUrl}
                  onChange={(e) => setForm({ ...form, portraitCorporateUrl: e.target.value })}
                  placeholder="/images/altaf-portrait-corporate.webp"
                  className="w-full px-3 py-2 bg-[#0C111C] border border-white/10 text-xs text-white mb-2"
                />
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerTarget("portraitCorporateUrl")}
                className="w-full py-2 bg-[#0C111C] hover:bg-white/[0.06] border border-white/10 text-xs font-sans text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Select from Media Library</span>
              </button>
            </div>

          </div>
        </div>

        {/* Action Save Bar */}
        <div className="sticky bottom-4 p-4 bg-[#0C111C]/95 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400">
            Changes persist directly to Neon PostgreSQL and update the live website immediately.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving..." : "Save Profile Changes"}</span>
          </button>
        </div>

      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={Boolean(mediaPickerTarget)}
        onClose={() => setMediaPickerTarget(null)}
        categoryFilter="portrait"
        selectedUrl={mediaPickerTarget ? form[mediaPickerTarget] : undefined}
        onSelect={(url) => {
          if (mediaPickerTarget) {
            setForm({ ...form, [mediaPickerTarget]: url });
          }
        }}
      />
    </div>
  );
}
