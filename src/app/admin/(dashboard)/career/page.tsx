"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, Image as ImageIcon, Briefcase } from "lucide-react";

interface CareerRole {
  id: string;
  role_slug: string;
  company: string;
  role_title: string;
  period: string;
  location: string;
  cluster?: string;
  role_type: "current" | "previous";
  company_filter: string;
  logo_url: string;
  key_responsibilities: string[] | string;
  achievements: string[] | string;
  industry_context: string;
  sort_order: number;
  is_published: boolean;
}

export default function CareerAdminPage() {
  const [roles, setRoles] = useState<CareerRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CareerRole | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CareerRole | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [form, setForm] = useState({
    roleSlug: "",
    company: "",
    roleTitle: "",
    period: "",
    location: "",
    cluster: "",
    roleType: "previous",
    companyFilter: "marico",
    logoUrl: "/logos/marico-logo.png",
    keyResponsibilities: "",
    achievements: "",
    industryContext: "",
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/career");
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingRole(null);
    setForm({
      roleSlug: "",
      company: "",
      roleTitle: "",
      period: "",
      location: "",
      cluster: "",
      roleType: "previous",
      companyFilter: "marico",
      logoUrl: "/logos/marico-logo.png",
      keyResponsibilities: "",
      achievements: "",
      industryContext: "",
      sortOrder: roles.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (role: CareerRole) => {
    setEditingRole(role);
    const respArray = typeof role.key_responsibilities === "string" 
      ? JSON.parse(role.key_responsibilities) 
      : role.key_responsibilities;
    const achArray = typeof role.achievements === "string"
      ? JSON.parse(role.achievements)
      : role.achievements;

    setForm({
      roleSlug: role.role_slug,
      company: role.company,
      roleTitle: role.role_title,
      period: role.period,
      location: role.location,
      cluster: role.cluster || "",
      roleType: role.role_type,
      companyFilter: role.company_filter,
      logoUrl: role.logo_url,
      keyResponsibilities: Array.isArray(respArray) ? respArray.join("\n") : "",
      achievements: Array.isArray(achArray) ? achArray.join("\n") : "",
      industryContext: role.industry_context,
      sortOrder: role.sort_order,
      isPublished: role.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingRole ? `/api/admin/career/${editingRole.id}` : "/api/admin/career";
      const method = editingRole ? "PUT" : "POST";

      const payload = {
        ...form,
        keyResponsibilities: form.keyResponsibilities.split("\n").map((s) => s.trim()).filter(Boolean),
        achievements: form.achievements.split("\n").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNotification(editingRole ? "Role updated successfully!" : "Career role added successfully!");
        setModalOpen(false);
        await fetchRoles();
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
      const res = await fetch(`/api/admin/career/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Career role deleted.");
        setDeleteTarget(null);
        await fetchRoles();
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
        title="Multinational Career Mandates"
        subtitle="Manage leadership positions across Marico Bangladesh, Robi Axiata, and Nestlé Bangladesh."
        breadcrumbs={[{ label: "Career Journey" }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Career Mandate</span>
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
          <span className="text-xs">Loading career mandates...</span>
        </div>
      ) : (
        <div className="bg-[#0C111C] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#070A11] border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order</th>
                  <th className="py-3.5 px-4 font-semibold">Company &amp; Insignia</th>
                  <th className="py-3.5 px-4 font-semibold">Role Title &amp; Chronology</th>
                  <th className="py-3.5 px-4 font-semibold">Territory / Location</th>
                  <th className="py-3.5 px-4 font-semibold">Mandate</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {roles.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-bold">
                      #{r.sort_order}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 bg-white p-1 rounded-xs shrink-0 border border-slate-300">
                          <Image
                            src={r.logo_url}
                            alt={r.company}
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white">{r.company}</div>
                          <div className="text-[10px] text-[#D4AF37] uppercase tracking-wider">
                            Filter: {r.company_filter}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-serif text-sm font-bold text-slate-100">
                        {r.role_title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                        {r.period}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{r.location}</div>
                      {r.cluster && (
                        <span className="text-[10px] text-slate-400">[{r.cluster}]</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.role_type === "current" ? (
                        <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                          Active Mandate
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px] uppercase tracking-wider">
                          Previous Tenure
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.is_published ? (
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
                          onClick={() => openEditModal(r)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                          title="Edit Role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(r)}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Role"
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
          <div className="bg-[#0C111C] border border-white/10 rounded-sm w-full max-w-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold text-white mb-2 pb-3 border-b border-white/[0.08]">
              {editingRole ? "Edit Career Mandate" : "Add New Career Mandate"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Marico Bangladesh Limited"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Role Title
                  </label>
                  <input
                    type="text"
                    required
                    value={form.roleTitle}
                    onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                    placeholder="Area Manager – Market Operation"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Period String
                  </label>
                  <input
                    type="text"
                    required
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    placeholder="January 2024 – Present"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Location / Territory
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Southern Cluster, Bangladesh"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Cluster / District Subdivision (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.cluster}
                    onChange={(e) => setForm({ ...form, cluster: e.target.value })}
                    placeholder="Southern Cluster"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Filter Category
                  </label>
                  <select
                    value={form.companyFilter}
                    onChange={(e) => setForm({ ...form, companyFilter: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="marico">Marico Bangladesh</option>
                    <option value="robi">Robi Axiata</option>
                    <option value="nestle">Nestlé Bangladesh</option>
                    <option value="other">Other / Corporate</option>
                  </select>
                </div>
              </div>

              {/* Company Logo Picker */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Company Insignia / Logo URL
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 bg-white p-1 border border-slate-300 shrink-0">
                    {form.logoUrl ? (
                      <Image
                        src={form.logoUrl}
                        alt="Logo preview"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
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

              {/* Responsibilities */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Key Operational Responsibilities (One per line)
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.keyResponsibilities}
                  onChange={(e) => setForm({ ...form, keyResponsibilities: e.target.value })}
                  placeholder="Spearhead market operations across strategic clusters...&#10;Execute Route-to-Market (RTM) transformations..."
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Quantifiable Achievements &amp; Awards (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.achievements}
                  onChange={(e) => setForm({ ...form, achievements: e.target.value })}
                  placeholder="Global CEO Award recipient for commercial excellence...&#10;Conferred 'Go Beyond Award' from the Chief Executive Officer..."
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              {/* Industry Context */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Industry &amp; FMCG / Telecom Context
                </label>
                <input
                  type="text"
                  value={form.industryContext}
                  onChange={(e) => setForm({ ...form, industryContext: e.target.value })}
                  placeholder="Fast-Moving Consumer Goods (FMCG) – Beauty, Wellness & Food Formats."
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Mandate Status
                  </label>
                  <select
                    value={form.roleType}
                    onChange={(e) => setForm({ ...form, roleType: e.target.value as "current" | "previous" })}
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="current">Active Mandate (Current)</option>
                    <option value="previous">Previous Tenure</option>
                  </select>
                </div>

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
                    <span>Published on Website</span>
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
                  <span>{editingRole ? "Save Changes" : "Create Career Mandate"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker for Logos */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        categoryFilter="logo"
        selectedUrl={form.logoUrl}
        onSelect={(url) => setForm({ ...form, logoUrl: url })}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Career Mandate"
        message={`Are you sure you want to permanently delete the role "${deleteTarget?.role_title} at ${deleteTarget?.company}"?`}
        confirmLabel="Delete Mandate"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
