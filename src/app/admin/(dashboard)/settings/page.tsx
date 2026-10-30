"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { Save, Loader2, CheckCircle2, Image as ImageIcon, Globe, Palette } from "lucide-react";

export default function SettingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [form, setForm] = useState({
    siteTitle: "",
    metaDescription: "",
    keywords: "",
    ogImageUrl: "",
    canonicalUrl: "",
    accentColor: "#D4AF37",
    backgroundColor: "#070A11",
    surfaceColor: "#0C111C",
  });

  const approvedAccents = [
    { label: "Signature Auric Gold", value: "#D4AF37" },
    { label: "Deep Amber Bronze", value: "#AA822A" },
    { label: "Pale Champagne", value: "#F5E6CA" },
    { label: "Teal Emergence", value: "#14B8A6" },
  ];

  const approvedBackgrounds = [
    { label: "Obsidian Midnight (Default)", value: "#070A11" },
    { label: "Executive Deep Navy", value: "#0A0F1D" },
    { label: "Graphite Noir", value: "#0B0E14" },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setForm({
          siteTitle: data.siteTitle || "",
          metaDescription: data.metaDescription || "",
          keywords: Array.isArray(data.keywords) ? data.keywords.join(", ") : "",
          ogImageUrl: data.ogImageUrl || "/images/altaf-portrait-lcb.jpg",
          canonicalUrl: data.canonicalUrl || "https://altafhossainraju.com",
          accentColor: data.accentColor || "#D4AF37",
          backgroundColor: data.backgroundColor || "#070A11",
          surfaceColor: data.surfaceColor || "#0C111C",
        });
      }
    } catch {
      setErrorMsg("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification("");
    setErrorMsg("");

    try {
      const payload = {
        ...form,
        keywords: form.keywords.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNotification("SEO & appearance settings saved successfully!");
        setTimeout(() => setNotification(""), 4000);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Failed to update settings.");
      }
    } catch {
      setErrorMsg("Network error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-2" />
        <span className="text-xs">Loading customization &amp; SEO settings...</span>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="SEO Optimization &amp; Visual Customization"
        subtitle="Manage search engine indexing, social share metadata, canonical URLs, and approved design accents."
        breadcrumbs={[{ label: "SEO & Settings" }]}
      />

      {notification && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-xs font-sans text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-300">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SEO Metadata Card */}
        <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-white/[0.08]">
            <Globe className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="font-serif text-lg font-bold text-white">
              Search Engine &amp; Social Graph Metadata
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Global Website Meta Title
              </label>
              <input
                type="text"
                required
                value={form.siteTitle}
                onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Meta Description (Search Snippet)
              </label>
              <textarea
                rows={3}
                required
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Canonical Base URL
                </label>
                <input
                  type="url"
                  required
                  value={form.canonicalUrl}
                  onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Open Graph Social Share Image URL (1200x630)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.ogImageUrl}
                    onChange={(e) => setForm({ ...form, ogImageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="px-3 py-2 bg-[#070A11] border border-white/10 text-xs text-slate-300 hover:text-white"
                  >
                    Choose
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Customization Card */}
        <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-white/[0.08]">
            <Palette className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="font-serif text-lg font-bold text-white">
              Approved Visual Palette &amp; Theme Accents
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Prestige Accent Color
              </label>
              <div className="space-y-2.5">
                {approvedAccents.map((accent) => (
                  <label
                    key={accent.value}
                    className={`flex items-center justify-between p-3 border rounded-xs cursor-pointer transition-colors ${
                      form.accentColor.toLowerCase() === accent.value.toLowerCase()
                        ? "border-[#D4AF37] bg-[#D4AF37]/10"
                        : "border-white/10 bg-[#070A11] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: accent.value }}
                      />
                      <span className="text-xs font-sans font-semibold text-slate-200">
                        {accent.label}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="accentColor"
                      value={accent.value}
                      checked={form.accentColor.toLowerCase() === accent.value.toLowerCase()}
                      onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                      className="accent-[#D4AF37]"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Background Canvas Shade
              </label>
              <div className="space-y-2.5">
                {approvedBackgrounds.map((bg) => (
                  <label
                    key={bg.value}
                    className={`flex items-center justify-between p-3 border rounded-xs cursor-pointer transition-colors ${
                      form.backgroundColor.toLowerCase() === bg.value.toLowerCase()
                        ? "border-[#D4AF37] bg-[#D4AF37]/10"
                        : "border-white/10 bg-[#070A11] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-sm border border-white/20 shadow-sm"
                        style={{ backgroundColor: bg.value }}
                      />
                      <span className="text-xs font-sans font-semibold text-slate-200">
                        {bg.label}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="backgroundColor"
                      value={bg.value}
                      checked={form.backgroundColor.toLowerCase() === bg.value.toLowerCase()}
                      onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                      className="accent-[#D4AF37]"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-4 p-4 bg-[#0C111C]/95 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400">
            Approved styling tokens preserve WCAG AA contrast and institutional executive poise.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving..." : "Save Customization"}</span>
          </button>
        </div>

      </form>

      {/* Media Picker for OG Image */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedUrl={form.ogImageUrl}
        onSelect={(url) => setForm({ ...form, ogImageUrl: url })}
      />
    </div>
  );
}
