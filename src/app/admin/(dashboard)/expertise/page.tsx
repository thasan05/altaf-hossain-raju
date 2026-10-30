"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, Award } from "lucide-react";

interface Domain {
  id: string;
  title: string;
  tier: string;
  description: string;
  competencies: string[] | string;
  sort_order: number;
  is_published: boolean;
}

export default function ExpertiseAdminPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Domain | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    title: "",
    tier: "secondary",
    description: "",
    competencies: "",
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/expertise");
      if (res.ok) {
        const data = await res.json();
        setDomains(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingDomain(null);
    setForm({
      title: "",
      tier: "secondary",
      description: "",
      competencies: "",
      sortOrder: domains.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (d: Domain) => {
    setEditingDomain(d);
    const comps = typeof d.competencies === "string" ? JSON.parse(d.competencies) : d.competencies;
    setForm({
      title: d.title,
      tier: d.tier,
      description: d.description,
      competencies: Array.isArray(comps) ? comps.join(", ") : "",
      sortOrder: d.sort_order,
      isPublished: d.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingDomain ? `/api/admin/expertise/${editingDomain.id}` : "/api/admin/expertise";
      const method = editingDomain ? "PUT" : "POST";

      const payload = {
        ...form,
        competencies: form.competencies.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNotification(editingDomain ? "Domain updated!" : "New domain added!");
        setModalOpen(false);
        await fetchDomains();
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
      const res = await fetch(`/api/admin/expertise/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Domain deleted.");
        setDeleteTarget(null);
        await fetchDomains();
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
        title="Strategic Competencies & Functional Domains"
        subtitle="Manage route-to-market architecture, B2B sales coaching, personal branding, and youth employability domains."
        breadcrumbs={[{ label: "Competencies" }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Competency Domain</span>
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
          <span className="text-xs">Loading competency domains...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {domains.map((d) => {
            const comps = typeof d.competencies === "string" ? JSON.parse(d.competencies) : d.competencies;
            return (
              <div
                key={d.id}
                className="bg-[#0C111C] border border-white/10 p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-[#D4AF37]/40 transition-colors shadow-2xl"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#FCD34D] text-[10px] font-bold uppercase tracking-wider">
                      Tier: {d.tier}
                    </span>
                    <span className="font-mono text-xs text-slate-500">Order: #{d.sort_order}</span>
                    {d.is_published ? (
                      <span className="text-emerald-400 text-[11px]">&bull; Published</span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">&bull; Draft</span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    {d.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-light leading-relaxed max-w-[65ch] mb-4">
                    {d.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(comps) &&
                      comps.map((c: string, cIdx: number) => (
                        <span
                          key={cIdx}
                          className="px-2.5 py-1 bg-[#070A11] border border-white/10 text-slate-300 text-xs font-sans"
                        >
                          {c}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditModal(d)}
                    className="p-2 bg-[#070A11] border border-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Edit Domain"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(d)}
                    className="p-2 bg-[#070A11] border border-white/10 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Domain"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0C111C] border border-white/10 rounded-sm w-full max-w-xl p-6 sm:p-8 shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-white mb-4 pb-3 border-b border-white/[0.08]">
              {editingDomain ? "Edit Domain" : "Add Competency Domain"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Domain Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Commercial & Route-to-Market (RTM) Strategy"
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Tier Categorization
                </label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="flagship">Primary Commercial Pillar (Flagship Broadsheet)</option>
                  <option value="secondary">Revenue Architecture & Governance</option>
                  <option value="mentorship">Talent Pipeline & Executive Presence</option>
                  <option value="pmp">Youth Employability & Project Governance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Key Competencies Pills (Comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={form.competencies}
                  onChange={(e) => setForm({ ...form, competencies: e.target.value })}
                  placeholder="RTM Transformation, Distributor ROI & Hygiene, Margin Modeling"
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-slate-200">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                    <span>Published</span>
                  </label>
                </div>
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
                  <span>{editingDomain ? "Save Changes" : "Create Domain"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Competency Domain"
        message={`Are you sure you want to permanently delete the domain "${deleteTarget?.title}"?`}
        confirmLabel="Delete Domain"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
