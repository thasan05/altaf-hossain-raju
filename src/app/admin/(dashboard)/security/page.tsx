"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { ShieldCheck, Lock, KeyRound, Loader2, CheckCircle2 } from "lucide-react";

export default function SecurityAdminPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Security credentials updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.error || "Failed to update password.");
      }
    } catch {
      setErrorMsg("Network error updating password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Security &amp; Administrative Access"
        subtitle="Manage cryptographic session parameters, update administrator passwords, and review security policies."
        breadcrumbs={[{ label: "Security & Access" }]}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Change Password Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#0C111C] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-white/[0.08]">
            <KeyRound className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="font-serif text-lg font-bold text-white">
              Update Administrator Password
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                New Secure Password (Minimum 8 Characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security Parameters Ledger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0C111C] border border-white/10 p-6">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/[0.08]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-base font-bold text-white">
                Session Encryption &amp; Security
              </h3>
            </div>

            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Cookie Scheme</span>
                <span className="text-emerald-400 font-mono font-medium">HttpOnly, SameSite=Lax</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Token Algorithm</span>
                <span className="text-white font-mono font-medium">HS256 (WebCrypto)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Password Hashing</span>
                <span className="text-white font-mono font-medium">bcrypt (10 rounds)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Session Longevity</span>
                <span className="text-white font-mono font-medium">7 Days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Protection Layer</span>
                <span className="text-[#D4AF37] font-semibold">Next.js Proxy Edge Guard</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#070A11] border border-white/[0.08] text-xs font-sans text-slate-400 leading-relaxed">
            <strong className="text-white block mb-1">Administrator CLI Provisioning:</strong>
            To reset administrator credentials directly from the command line in emergencies, run <code className="text-[#D4AF37] bg-white/[0.04] px-1 py-0.5 font-mono">node scripts/seed.js</code> in your terminal.
          </div>
        </div>

      </div>
    </div>
  );
}
