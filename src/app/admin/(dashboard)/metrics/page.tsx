"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Plus, Edit2, Trash2, ShieldCheck, Loader2, CheckCircle2, ArrowUpDown } from "lucide-react";

interface Metric {
  id: string;
  metric_key: string;
  value: string;
  number_value: number;
  suffix: string;
  label: string;
  description: string;
  verification_source: string;
  category: string;
  is_primary: boolean;
  sort_order: number;
  is_published: boolean;
}

export default function MetricsAdminPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Metric | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    metricKey: "",
    value: "",
    numberValue: 0,
    suffix: "+",
    label: "",
    description: "",
    verificationSource: "",
    category: "Operational",
    isPrimary: false,
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingMetric(null);
    setForm({
      metricKey: "",
      value: "",
      numberValue: 0,
      suffix: "+",
      label: "",
      description: "",
      verificationSource: "",
      category: "Operational",
      isPrimary: false,
      sortOrder: metrics.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (metric: Metric) => {
    setEditingMetric(metric);
    setForm({
      metricKey: metric.metric_key,
      value: metric.value,
      numberValue: Number(metric.number_value),
      suffix: metric.suffix,
      label: metric.label,
      description: metric.description,
      verificationSource: metric.verification_source,
      category: metric.category,
      isPrimary: metric.is_primary,
      sortOrder: metric.sort_order,
      isPublished: metric.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingMetric ? `/api/admin/metrics/${editingMetric.id}` : "/api/admin/metrics";
      const method = editingMetric ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setNotification(editingMetric ? "Metric updated successfully!" : "New metric added successfully!");
        setModalOpen(false);
        await fetchMetrics();
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
      const res = await fetch(`/api/admin/metrics/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Metric deleted.");
        setDeleteTarget(null);
        await fetchMetrics();
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
        title="Impact Metrics &amp; Operational Ledgers"
        subtitle="Manage documented milestones, member counts, verified session archives, and corporate accolades."
        breadcrumbs={[{ label: "Impact Metrics" }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Metric</span>
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
          <span className="text-xs">Loading metrics ledger...</span>
        </div>
      ) : (
        <div className="bg-[#0C111C] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#070A11] border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order</th>
                  <th className="py-3.5 px-4 font-semibold">Figure / Value</th>
                  <th className="py-3.5 px-4 font-semibold">Label &amp; Focus</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Audit / Verification Source</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {metrics.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-bold">
                      #{m.sort_order}
                    </td>
                    <td className="py-3.5 px-4 font-serif text-lg font-bold text-white tabular-nums">
                      {m.value}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-200">{m.label}</div>
                      <div className="text-[11px] text-slate-400 font-light truncate mt-0.5">
                        {m.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-[#070A11] border border-white/10 text-slate-300 text-[11px] font-medium">
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="truncate">{m.verification_source}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {m.is_primary ? (
                        <span className="px-2 py-0.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#FCD34D] text-[10px] font-bold uppercase tracking-wider">
                          Primary Pillar
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px] uppercase tracking-wider">
                          Ledger
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {m.is_published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(m)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                          title="Edit Metric"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m)}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Metric"
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

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0C111C] border border-white/10 rounded-sm w-full max-w-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold text-white mb-2 pb-3 border-b border-white/[0.08]">
              {editingMetric ? "Edit Impact Metric" : "Add New Impact Metric"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Metric Key / Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={form.metricKey}
                    onChange={(e) => setForm({ ...form, metricKey: e.target.value })}
                    placeholder="e.g. members"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Formatted Value Display
                  </label>
                  <input
                    type="text"
                    required
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder="24,000+"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Numeric Value (For Counter Calculations)
                  </label>
                  <input
                    type="number"
                    required
                    value={form.numberValue}
                    onChange={(e) => setForm({ ...form, numberValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={form.suffix}
                    onChange={(e) => setForm({ ...form, suffix: e.target.value })}
                    placeholder="+ or x or + Years"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Descriptive Label / Metric Title
                </label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Students & Professionals Impacted"
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Detailed Operational Context (65ch)
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Verification Source / Documented Archive
                  </label>
                  <input
                    type="text"
                    required
                    value={form.verificationSource}
                    onChange={(e) => setForm({ ...form, verificationSource: e.target.value })}
                    placeholder="LinkedIn Community BD Platform Official Count"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Domain Category
                  </label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Community Impact"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Display Sort Order
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
                      checked={form.isPrimary}
                      onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                    <span>Primary Macro Pillar (Large Card)</span>
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
                  <span>{editingMetric ? "Save Changes" : "Create Metric"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion Dialog */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Impact Metric"
        message={`Are you sure you want to permanently delete "${deleteTarget?.label}"? This action cannot be undone.`}
        confirmLabel="Delete Metric"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
