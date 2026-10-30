"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed. Please verify credentials.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network or server error during sign-in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle auric background glow */}
      <div className="absolute top-1/3 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0C111C] border border-white/10 p-8 sm:p-10 shadow-2xl relative z-10">
        
        {/* Brand Emblem */}
        <div className="flex flex-col items-center text-center mb-8 pb-6 border-b border-white/[0.08]">
          <div className="w-14 h-14 rounded-sm bg-[#070A11] border border-[#D4AF37]/40 flex items-center justify-center font-serif text-lg font-bold text-[#D4AF37] mb-3 shadow-inner">
            AHR
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
            Executive CMS Portal
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Md. Altaf Hossain Raju, PMP® &bull; Private Administration
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-sans flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@altafhossainraju.com"
                className="w-full pl-10 pr-3.5 py-3 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Security Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full pl-10 pr-3.5 py-3 bg-[#070A11] border border-white/15 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Access Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-sans text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>256-bit Authenticated Session</span>
          </div>
          <Link href="/" className="hover:text-white transition-colors">
            Return to Portfolio &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
