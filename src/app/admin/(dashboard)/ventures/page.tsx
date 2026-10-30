"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, Image as ImageIcon, ExternalLink } from "lucide-react";

interface Venture {
  id: string;
  venture_slug: string;
  name: string;
  acronym?: string;
  tagline: string;
  founded: string;
  role: string;
  status: "Active" | "Established";
  website_url?: string;
  description: string;
  detailed_story: string;
  impact_metrics: Array<{ label: string; value: string }> | string;
  featured_image: string;
  highlights: string[] | string;
  cta_label?: string;
  cta_url?: string;
  sort_order: number;
  is_published: boolean;
}

export default function VenturesAdminPage() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVenture, setEditingVenture] = useState<Venture | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Venture | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [form, setForm] = useState({
    ventureSlug: "",
    name: "",
    acronym: "",
    tagline: "",
    founded: "",
    role: "",
    status: "Active",
    websiteUrl: "",
    description: "",
    detailedStory: "",
    impactMetrics: [{ label: "", value: "" }],
    featuredImage: "/images/lcb-campus-leads-summit.webp",
    highlights: "",
    ctaLabel: "",
    ctaUrl: "",
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchVentures();
  }, []);

  const fetchVentures = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ventures");
      if (res.ok) {
        const data = await res.json();
        setVentures(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingVenture(null);
    setForm({
      ventureSlug: "",
      name: "",
      acronym: "",
      tagline: "",
      founded: "",
      role: "",
      status: "Active",
      websiteUrl: "",
      description: "",
      detailedStory: "",
      impactMetrics: [
        { label: "Community Members", value: "24,000+" },
        { label: "Sessions Hosted", value: "192+" },
      ],
      featuredImage: "/images/lcb-campus-leads-summit.webp",
      highlights: "",
      ctaLabel: "",
      ctaUrl: "",
      sortOrder: ventures.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (v: Venture) => {
    setEditingVenture(v);
    const metricsArr = typeof v.impact_metrics === "string" 
      ? JSON.parse(v.impact_metrics) 
      : v.impact_metrics;
    const highlightsArr = typeof v.highlights === "string" 
      ? JSON.parse(v.highlights) 
      : v.highlights;

    setForm({
      ventureSlug: v.venture_slug,
      name: v.name,
      acronym: v.acronym || "",
      tagline: v.tagline,
      founded: v.founded,
      role: v.role,
      status: v.status,
      websiteUrl: v.website_url || "",
      description: v.description,
      detailedStory: v.detailed_story || "",
      impactMetrics: Array.isArray(metricsArr) && metricsArr.length > 0 ? metricsArr : [{ label: "", value: "" }],
      featuredImage: v.featured_image,
      highlights: Array.isArray(highlightsArr) ? highlightsArr.join("\n") : "",
      ctaLabel: v.cta_label || "",
      ctaUrl: v.cta_url || "",
      sortOrder: v.sort_order,
      isPublished: v.is_published,
    });
    setModalOpen(true);
  };

  const handleMetricChange = (index: number, field: "label" | "value", val: string) => {
    const updated = [...form.impactMetrics];
    updated[index][field] = val;
    setForm({ ...form, impactMetrics: updated });
  };

  const addMetricRow = () => {
    setForm({ ...form, impactMetrics: [...form.impactMetrics, { label: "", value: "" }] });
  };

  const removeMetricRow = (index: number) => {
    const updated = form.impactMetrics.filter((_, i) => i !== index);
    setForm({ ...form, impactMetrics: updated.length > 0 ? updated : [{ label: "", value: "" }] });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingVenture ? `/api/admin/ventures/${editingVenture.id}` : "/api/admin/ventures";
      const method = editingVenture ? "PUT" : "POST";

      const payload = {
        ...form,
        impactMetrics: form.impactMetrics.filter((m) => m.label.trim() && m.value.trim()),
        highlights: form.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNotification(editingVenture ? "Venture updated successfully!" : "Venture created successfully!");
        setModalOpen(false);
        await fetchVentures();
        setTimeout(() => setNotification(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/ventures/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Venture removed.");
        setDeleteTarget(null);
        await fetchVentures();
        setTimeout(() => setNotification(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Strategic Ventures &amp; Community Ecosystems"
        subtitle="Manage LinkedIn Community Bangladesh (LCB), Skill Hunt, and Career Talks platforms."
        breadcrumbs={[{ label: "Ventures" }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Venture</span>
          </button>
        }
      />

      {notification && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-xs font-sans text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-2" />
          <span className="text-xs">Loading ventures...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ventures.map((v) => (
            <div
              key={v.id}
              className="bg-[#0C111C] border border-white/10 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-[#070A11] border-b border-white/[0.08]">
                  <Image
                    src={v.featured_image}
                    alt={v.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#070A11]/90 text-[10px] font-sans uppercase font-bold text-emerald-400 border border-emerald-500/30">
                    {v.status}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-[11px] font-sans text-slate-400 mb-1">
                    <span className="text-[#D4AF37] font-semibold">Founded {v.founded}</span>
                    <span>&bull;</span>
                    <span>{v.role}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white mb-1">
                    {v.name} {v.acronym && `[${v.acronym}]`}
                  </h3>
                  <p className="text-xs font-serif italic text-slate-300 mb-3 line-clamp-1">
                    &ldquo;{v.tagline}&rdquo;
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0 border-t border-white/[0.06] mt-4 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">Order: #{v.sort_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(v)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    title="Edit Venture"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(v)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Venture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0C111C] border border-white/10 rounded-sm w-full max-w-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold text-white mb-2 pb-3 border-b border-white/[0.08]">
              {editingVenture ? "Edit Venture Dossier" : "Add New Venture Dossier"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Venture Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="LinkedIn Community Bangladesh"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Acronym (e.g. LCB)
                  </label>
                  <input
                    type="text"
                    value={form.acronym}
                    onChange={(e) => setForm({ ...form, acronym: e.target.value })}
                    placeholder="LCB"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Founding Date / Year
                  </label>
                  <input
                    type="text"
                    required
                    value={form.founded}
                    onChange={(e) => setForm({ ...form, founded: e.target.value })}
                    placeholder="2022 or November 11, 2016"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Leadership Role Title
                  </label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Founder & Chief Community Architect"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    required
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="Bangladesh's First LinkedIn-Based Professional Growth Movement"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Platform Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Established" })}
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Active">Active Movement</option>
                    <option value="Established">Established Initiative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Official Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    placeholder="https://linkedincommunitybangladesh.com/"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Featured Documentary Photo URL
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={form.featuredImage}
                    onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="px-3 py-2 bg-[#0C111C] hover:bg-white/[0.04] border border-white/10 text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Choose</span>
                  </button>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Short Executive Summary (65ch)
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              {/* Detailed Story */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Comprehensive Origin &amp; Impact Narrative
                </label>
                <textarea
                  rows={3}
                  value={form.detailedStory}
                  onChange={(e) => setForm({ ...form, detailedStory: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              {/* Impact Metrics Mini-Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300">
                    Venture Key Metric Counters
                  </label>
                  <button
                    type="button"
                    onClick={addMetricRow}
                    className="text-[11px] font-sans text-[#D4AF37] hover:underline"
                  >
                    + Add Metric
                  </button>
                </div>
                <div className="space-y-2">
                  {form.impactMetrics.map((im, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. Members)"
                        value={im.label}
                        onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 24,000+)"
                        value={im.value}
                        onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                        className="w-36 px-3 py-1.5 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                      {form.impactMetrics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMetricRow(idx)}
                          className="p-1.5 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Highlights */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Key Strategic Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.highlights}
                  onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                  placeholder="Campus Leads Summit Vol. 01 & 02 convening student leaders...&#10;Quarterly Leadership Labs and official Letters of Recommendation..."
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/10 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingVenture ? "Save Changes" : "Create Venture"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        categoryFilter="event"
        selectedUrl={form.featuredImage}
        onSelect={(url) => setForm({ ...form, featuredImage: url })}
      />

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Strategic Venture"
        message={`Are you sure you want to permanently delete the venture dossier for "${deleteTarget?.name}"?`}
        confirmLabel="Delete Venture"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
