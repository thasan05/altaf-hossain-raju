"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  context: string;
  sort_order: number;
  is_published: boolean;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    name: "",
    role: "",
    organization: "",
    quote: "",
    context: "",
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      name: "",
      role: "Campus Ambassador",
      organization: "LinkedIn Community Bangladesh",
      quote: "",
      context: "Official Community Review",
      sortOrder: testimonials.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingItem(t);
    setForm({
      name: t.name,
      role: t.role,
      organization: t.organization,
      quote: t.quote,
      context: t.context,
      sortOrder: t.sort_order,
      isPublished: t.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingItem ? `/api/admin/testimonials/${editingItem.id}` : "/api/admin/testimonials";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setNotification(editingItem ? "Testimonial updated!" : "New testimonial added!");
        setModalOpen(false);
        await fetchTestimonials();
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
      const res = await fetch(`/api/admin/testimonials/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Testimonial removed.");
        setDeleteTarget(null);
        await fetchTestimonials();
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
        title="Community Voices &amp; Mentee Testimonials"
        subtitle="Manage reflections from university campus leads, workshop participants, and corporate mentees."
        breadcrumbs={[{ label: "Testimonials" }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
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
          <span className="text-xs">Loading testimonials...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#0C111C] border border-white/10 p-6 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-colors shadow-2xl"
            >
              <div>
                <Quote className="w-5 h-5 text-[#D4AF37]/50 mb-3" />
                <blockquote className="font-serif italic text-sm text-slate-200 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-serif text-sm font-bold text-white">{t.name}</div>
                  <span className="font-mono text-[11px] text-slate-500">#{t.sort_order}</span>
                </div>
                <div className="text-xs text-slate-400 font-sans">{t.role} &bull; {t.organization}</div>
                <div className="text-[11px] text-[#D4AF37] font-sans font-medium mt-1">{t.context}</div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => openEditModal(t)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(t)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete"
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
              {editingItem ? "Edit Testimonial" : "Add Testimonial"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Testimonial Quote
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  placeholder="Through LCB's interactions and sessions with industry professionals..."
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Author / Voice Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Community Voice — Campus Lead"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Campus Ambassador & Graduate"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
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
                    placeholder="LinkedIn Community Bangladesh"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Verification Context
                  </label>
                  <input
                    type="text"
                    required
                    value={form.context}
                    onChange={(e) => setForm({ ...form, context: e.target.value })}
                    placeholder="Official LCB Community Review"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
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
                  <span>{editingItem ? "Save Changes" : "Create Testimonial"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Testimonial"
        message={`Are you sure you want to permanently delete the testimonial from "${deleteTarget?.name}"?`}
        confirmLabel="Delete Testimonial"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
