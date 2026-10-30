"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, Trophy } from "lucide-react";

interface Award {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  sort_order: number;
  is_published: boolean;
}

export default function AwardsAdminPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Award | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    title: "",
    organization: "",
    year: "",
    description: "",
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/awards");
      if (res.ok) {
        const data = await res.json();
        setAwards(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingAward(null);
    setForm({
      title: "",
      organization: "Marico Bangladesh Limited",
      year: "2024",
      description: "",
      sortOrder: awards.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (a: Award) => {
    setEditingAward(a);
    setForm({
      title: a.title,
      organization: a.organization,
      year: a.year,
      description: a.description,
      sortOrder: a.sort_order,
      isPublished: a.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingAward ? `/api/admin/awards/${editingAward.id}` : "/api/admin/awards";
      const method = editingAward ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setNotification(editingAward ? "Award updated!" : "New award added!");
        setModalOpen(false);
        await fetchAwards();
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
      const res = await fetch(`/api/admin/awards/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Award deleted.");
        setDeleteTarget(null);
        await fetchAwards();
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
        title="Documented Corporate Honors &amp; CEO Citations"
        subtitle="Manage Marico Global CEO Awards, highest organizational honours (Go Beyond Award), and Robi national championships."
        breadcrumbs={[{ label: "Awards & Honors" }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Honor / Award</span>
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
          <span className="text-xs">Loading corporate awards...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award) => (
            <div
              key={award.id}
              className="bg-[#0C111C] border border-white/10 p-6 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-colors shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-xs font-sans">
                  <span className="text-[#D4AF37] font-semibold uppercase tracking-wider">{award.organization}</span>
                  <span className="font-mono text-slate-300 font-bold">{award.year}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug">
                  {award.title}
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {award.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] mt-4 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500">#{award.sort_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(award)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    title="Edit Award"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(award)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Award"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0C111C] border border-white/10 rounded-sm w-full max-w-lg p-6 sm:p-8 shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-white mb-4 pb-3 border-b border-white/[0.08]">
              {editingAward ? "Edit Corporate Honor" : "Add Corporate Honor"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Award / Honor Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Global CEO Award (2nd Consecutive Time)"
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    placeholder="Marico Bangladesh Limited"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Year / Chronology
                  </label>
                  <input
                    type="text"
                    required
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2023 & 2024"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Official Citation / Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Conferred by Marico Global CEO for unmatched market execution, volume expansion, and revenue milestones."
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
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
                  <span>{editingAward ? "Save Changes" : "Create Award"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Award Record"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete Award"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
