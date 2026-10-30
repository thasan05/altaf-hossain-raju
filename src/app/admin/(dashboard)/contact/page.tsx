"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    email: "",
    phone: "",
    secondaryPhone: "",
    address: "",
    origin: "",
    linkedinUrl: "",
    lcbWebsiteUrl: "",
    whatsappNumber: "",
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact");
      if (res.ok) {
        const data = await res.json();
        setForm({
          email: data.email || "",
          phone: data.phone || "",
          secondaryPhone: data.secondaryPhone || "",
          address: data.address || "",
          origin: data.origin || "",
          linkedinUrl: data.linkedinUrl || "",
          lcbWebsiteUrl: data.lcbWebsiteUrl || "",
          whatsappNumber: data.whatsappNumber || "",
        });
      }
    } catch {
      setErrorMsg("Failed to load contact channels.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccessMsg("Contact channels and social destinations saved successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Failed to update contact channels.");
      }
    } catch {
      setErrorMsg("Network error saving contact channels.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-2" />
        <span className="text-xs">Loading contact channels...</span>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Contact Channels & Social Ecosystems"
        subtitle="Manage official email destinations, telephone lines, WhatsApp integration, and LinkedIn verified paths."
        breadcrumbs={[{ label: "Contact Channels" }]}
      />

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-xs font-sans text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-300">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Direct Communication Channels */}
        <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8">
          <h2 className="font-serif text-lg font-bold text-white mb-2 pb-3 border-b border-white/[0.08]">
            Direct Inbound Communication
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Primary Executive Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Primary Phone Number
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Secondary Phone Number
              </label>
              <input
                type="text"
                value={form.secondaryPhone}
                onChange={(e) => setForm({ ...form, secondaryPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Direct WhatsApp Number (International Format)
              </label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="+8801833183724"
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Office &amp; Residential Address
              </label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                District of Origin
              </label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Digital & Professional Platforms */}
        <div className="bg-[#0C111C] border border-white/10 p-6 sm:p-8">
          <h2 className="font-serif text-lg font-bold text-white mb-2 pb-3 border-b border-white/[0.08]">
            External Platforms &amp; Community Ecosystems
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Verified LinkedIn Profile URL
              </label>
              <input
                type="url"
                required
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
                LinkedIn Community Bangladesh (LCB) Platform URL
              </label>
              <input
                type="url"
                required
                value={form.lcbWebsiteUrl}
                onChange={(e) => setForm({ ...form, lcbWebsiteUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-4 p-4 bg-[#0C111C]/95 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-between">
          <span className="text-xs font-sans text-slate-400">
            Updates synchronize across header, footer, mobile bottom actions, and JSON-LD schema.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving..." : "Save Contact Channels"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
