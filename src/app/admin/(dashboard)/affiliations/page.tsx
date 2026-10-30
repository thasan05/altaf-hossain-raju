"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, Building2 } from "lucide-react";

interface Affiliation {
  id: string;
  role_title: string;
  organization: string;
  period: string;
  sort_order: number;
  is_published: boolean;
}

export default function AffiliationsAdminPage() {
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Affiliation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Affiliation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    roleTitle: "",
    organization: "",
    period: "",
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchAffiliations();
  }, []);

  const fetchAffiliations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/affiliations");
      if (res.ok) {
        const data = await res.json();
        setAffiliations(data);
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
      roleTitle: "",
      organization: "",
      period: "2024 – Present",
      sortOrder: affiliations.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (a: Affiliation) => {
    setEditingItem(a);
    setForm({
      roleTitle: a.role_title,
      organization: a.organization,
      period: a.period,
      sortOrder: a.sort_order,
      isPublished: a.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingItem ? `/api/admin/affiliations/${editingItem.id}` : "/api/admin/affiliations";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setNotification(editingItem ? "Affiliation updated!" : "New affiliation added!");
        setModalOpen(false);
        await fetchAffiliations();
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
      const res = await fetch(`/api/admin/affiliations/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Affiliation removed.");
        setDeleteTarget(null);
        await fetchAffiliations();
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
        title="Institutional Affiliations &amp; Governance"
        subtitle="Manage leadership positions, youth foundation tenures, and university business society roles."
        breadcrumbs={[{ label: "Affiliations" }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Affiliation</span>
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
          <span className="text-xs">Loading affiliations...</span>
        </div>
      ) : (
        <div className="bg-[#0C111C] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#070A11] border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order</th>
                  <th className="py-3.5 px-4 font-semibold">Governance Role</th>
                  <th className="py-3.5 px-4 font-semibold">Organization / Society</th>
                  <th className="py-3.5 px-4 font-semibold">Tenure / Period</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {affiliations.map((a) => (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-bold">
                      #{a.sort_order}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {a.role_title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {a.organization}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#D4AF37] font-semibold">
                      {a.period}
                    </td>
                    <td className="py-3.5 px-4">
                      {a.is_published ? (
                        <span className="text-emerald-400 text-[11px]">&bull; Published</span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">&bull; Draft</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(a)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(a)}
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
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0C111C] border border-white/10 rounded-sm w-full max-w-md p-6 sm:p-8 shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-white mb-4 pb-3 border-b border-white/[0.08]">
              {editingItem ? "Edit Affiliation" : "Add Affiliation"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Governance / Role Title
                </label>
                <input
                  type="text"
                  required
                  value={form.roleTitle}
                  onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                  placeholder="Founder & Community Architect"
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Organization / Society
                </label>
                <input
                  type="text"
                  required
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder="LinkedIn Community Bangladesh (LCB)"
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Tenure / Period
                </label>
                <input
                  type="text"
                  required
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                  placeholder="2022 – Present"
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
                  <span>{editingItem ? "Save Changes" : "Create Affiliation"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Affiliation"
        message={`Are you sure you want to permanently delete "${deleteTarget?.role_title} at ${deleteTarget?.organization}"?`}
        confirmLabel="Delete Affiliation"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
