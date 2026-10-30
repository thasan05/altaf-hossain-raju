"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, Newspaper, ExternalLink } from "lucide-react";

interface MediaFeature {
  id: string;
  slug: string;
  title: string;
  outlet: string;
  date_text: string;
  category: string;
  summary: string;
  link_text: string;
  url: string;
  highlight_quote?: string;
  sort_order: number;
  is_published: boolean;
}

export default function MediaPressAdminPage() {
  const [features, setFeatures] = useState<MediaFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaFeature | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFeature | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    slug: "",
    title: "",
    outlet: "",
    dateText: "",
    category: "National Print Media",
    summary: "",
    linkText: "Read Coverage Archive",
    url: "",
    highlightQuote: "",
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media-press");
      if (res.ok) {
        const data = await res.json();
        setFeatures(data);
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
      slug: "",
      title: "",
      outlet: "The Financial Express",
      dateText: "Feature Archive",
      category: "National Print Media",
      summary: "",
      linkText: "Read Coverage Archive",
      url: "https://thefinancialexpress.com.bd/",
      highlightQuote: "",
      sortOrder: features.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: MediaFeature) => {
    setEditingItem(item);
    setForm({
      slug: item.slug,
      title: item.title,
      outlet: item.outlet,
      dateText: item.date_text,
      category: item.category,
      summary: item.summary,
      linkText: item.link_text,
      url: item.url,
      highlightQuote: item.highlight_quote || "",
      sortOrder: item.sort_order,
      isPublished: item.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingItem ? `/api/admin/media-press/${editingItem.id}` : "/api/admin/media-press";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setNotification(editingItem ? "Media feature updated!" : "New media feature added!");
        setModalOpen(false);
        await fetchFeatures();
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
      const res = await fetch(`/api/admin/media-press/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Feature deleted.");
        setDeleteTarget(null);
        await fetchFeatures();
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
        title="Public Record &amp; Press Archive"
        subtitle="Manage national daily features, business profiles, and digital press coverage."
        breadcrumbs={[{ label: "Press & Media" }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Press Feature</span>
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
          <span className="text-xs">Loading press features...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <div
              key={item.id}
              className="bg-[#0C111C] border border-white/10 p-6 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-colors shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-xs font-sans">
                  <span className="text-[#D4AF37] font-semibold uppercase tracking-wider">{item.outlet}</span>
                  <span className="font-mono text-slate-400">{item.date_text}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-3 mb-4">
                  {item.summary}
                </p>
                {item.highlight_quote && (
                  <blockquote className="pl-3 border-l-2 border-[#D4AF37]/60 italic text-xs text-slate-300 mb-4 line-clamp-2">
                    &ldquo;{item.highlight_quote}&rdquo;
                  </blockquote>
                )}
              </div>

              <div className="pt-4 border-t border-white/[0.06] mt-4 flex items-center justify-between text-xs">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>{item.link_text}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    title="Edit Feature"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Feature"
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
          <div className="bg-[#0C111C] border border-white/10 rounded-sm w-full max-w-xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold text-white mb-4 pb-3 border-b border-white/[0.08]">
              {editingItem ? "Edit Press Feature" : "Add Press Feature"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Article / Feature Headline
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Skill Hunt: Pioneering Student Skill-Development Hub in Bangladesh"
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Publication Outlet
                  </label>
                  <input
                    type="text"
                    required
                    value={form.outlet}
                    onChange={(e) => setForm({ ...form, outlet: e.target.value })}
                    placeholder="The Financial Express"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Date String
                  </label>
                  <input
                    type="text"
                    required
                    value={form.dateText}
                    onChange={(e) => setForm({ ...form, dateText: e.target.value })}
                    placeholder="Feature Archive or Oct 2024"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="National Print Media"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Link Text
                  </label>
                  <input
                    type="text"
                    required
                    value={form.linkText}
                    onChange={(e) => setForm({ ...form, linkText: e.target.value })}
                    placeholder="Read Coverage Archive"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Destination URL
                </label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://thefinancialexpress.com.bd/"
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Summary Paragraph (65ch)
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Editorial Pull Quote (Optional)
                </label>
                <input
                  type="text"
                  value={form.highlightQuote}
                  onChange={(e) => setForm({ ...form, highlightQuote: e.target.value })}
                  placeholder="A movement, not just a meetup..."
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] italic"
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
                  <span>{editingItem ? "Save Changes" : "Create Feature"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Press Coverage"
        message={`Are you sure you want to permanently delete the coverage record "${deleteTarget?.title}"?`}
        confirmLabel="Delete Feature"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
