"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, ShieldCheck, Image as ImageIcon } from "lucide-react";

interface Credential {
  id: string;
  slug: string;
  title: string;
  institution: string;
  period_or_year: string;
  status: string;
  field: string;
  logo_url?: string;
  details: string;
  verification_note: string;
  is_premier: boolean;
  sort_order: number;
  is_published: boolean;
}

export default function CredentialsAdminPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCred, setEditingCred] = useState<Credential | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Credential | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [form, setForm] = useState({
    slug: "",
    title: "",
    institution: "",
    periodOrYear: "",
    status: "Completed",
    field: "",
    logoUrl: "",
    details: "",
    verificationNote: "",
    isPremier: false,
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/credentials");
      if (res.ok) {
        const data = await res.json();
        setCredentials(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCred(null);
    setForm({
      slug: "",
      title: "",
      institution: "",
      periodOrYear: "",
      status: "Completed",
      field: "",
      logoUrl: "",
      details: "",
      verificationNote: "Verified academic/professional credential.",
      isPremier: false,
      sortOrder: credentials.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (c: Credential) => {
    setEditingCred(c);
    setForm({
      slug: c.slug,
      title: c.title,
      institution: c.institution,
      periodOrYear: c.period_or_year,
      status: c.status,
      field: c.field,
      logoUrl: c.logo_url || "",
      details: c.details,
      verificationNote: c.verification_note,
      isPremier: c.is_premier,
      sortOrder: c.sort_order,
      isPublished: c.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingCred ? `/api/admin/credentials/${editingCred.id}` : "/api/admin/credentials";
      const method = editingCred ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setNotification(editingCred ? "Credential updated!" : "New credential added!");
        setModalOpen(false);
        await fetchCredentials();
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
      const res = await fetch(`/api/admin/credentials/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Credential deleted.");
        setDeleteTarget(null);
        await fetchCredentials();
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
        title="Academic Foundation &amp; Professional Accreditations"
        subtitle="Manage formal degrees, IBA University of Dhaka executive studies, and PMP® certified credentials."
        breadcrumbs={[{ label: "Credentials" }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Credential</span>
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
          <span className="text-xs">Loading credentials...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#0C111C] border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#070A11] border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Order</th>
                    <th className="py-3.5 px-4 font-semibold">Credential Title</th>
                    <th className="py-3.5 px-4 font-semibold">Institution</th>
                    <th className="py-3.5 px-4 font-semibold">Status &amp; Period</th>
                    <th className="py-3.5 px-4 font-semibold">Tier</th>
                    <th className="py-3.5 px-4 font-semibold">Verification Proof</th>
                    <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {credentials.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400 font-bold">
                        #{c.sort_order}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-serif text-sm font-bold text-white">{c.title}</div>
                        <div className="text-[11px] text-slate-400 font-light truncate max-w-xs">{c.field}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {c.institution}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#FCD34D]">
                          {c.status}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono mt-1">{c.period_or_year}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {c.is_premier ? (
                          <span className="text-[#D4AF37] font-semibold text-[11px]">Premier Anchor</span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Foundational</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-[11px] text-slate-400 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] inline mr-1" />
                        <span>{c.verification_note}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(c)}
                            className="p-1.5 text-slate-400 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(c)}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0C111C] border border-white/10 rounded-sm w-full max-w-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold text-white mb-4 pb-3 border-b border-white/[0.08]">
              {editingCred ? "Edit Credential" : "Add Credential"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Credential / Degree Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Executive MBA (Major in Marketing)"
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    required
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    placeholder="Institute of Business Administration (IBA), DU"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Period or Graduation Year
                  </label>
                  <input
                    type="text"
                    required
                    value={form.periodOrYear}
                    onChange={(e) => setForm({ ...form, periodOrYear: e.target.value })}
                    placeholder="Expected Completion: 2026 or Class of 2017"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Status Pill
                  </label>
                  <input
                    type="text"
                    required
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    placeholder="Completed or Pursuing (Expected 2026) or Certified"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Field of Study / Discipline
                  </label>
                  <input
                    type="text"
                    required
                    value={form.field}
                    onChange={(e) => setForm({ ...form, field: e.target.value })}
                    placeholder="Executive Business Administration & Marketing"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Logo selection */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Institutional Insignia Logo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    placeholder="/logos/iba-du-logo.png"
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

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Details / Coursework Highlights
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Audit / Verification Note
                </label>
                <input
                  type="text"
                  required
                  value={form.verificationNote}
                  onChange={(e) => setForm({ ...form, verificationNote: e.target.value })}
                  placeholder="Verified from primary academic enrollment record (IBA DU EMBA)."
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

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-slate-200">
                    <input
                      type="checkbox"
                      checked={form.isPremier}
                      onChange={(e) => setForm({ ...form, isPremier: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                    <span>Premier Anchor (Top Grid)</span>
                  </label>

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
                  <span>{editingCred ? "Save Changes" : "Create Credential"}</span>
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
        categoryFilter="logo"
        selectedUrl={form.logoUrl}
        onSelect={(url) => setForm({ ...form, logoUrl: url })}
      />

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Credential"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete Credential"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
