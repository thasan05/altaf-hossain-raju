"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Briefcase,
  BarChart3,
  Compass,
  Award,
  Mic,
  GraduationCap,
  Trophy,
  Building2,
  Newspaper,
  Quote,
  Image as ImageIcon,
  Layers,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface DashboardData {
  stats: {
    careerRoles: number;
    impactMetrics: number;
    ventures: number;
    expertiseDomains: number;
    speakingEvents: number;
    credentials: number;
    awards: number;
    leadershipRoles: number;
    mediaCoverage: number;
    testimonials: number;
    mediaAssets: number;
    visibleSections: number;
    totalSections: number;
  };
  recentLogs: Array<{
    id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    details: string;
    created_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-3" />
        <span className="text-sm font-sans">Connecting to database and compiling telemetry...</span>
      </div>
    );
  }

  const { stats, recentLogs } = data;

  const statCards = [
    {
      label: "Multinational Career Mandates",
      value: stats.careerRoles,
      href: "/admin/career",
      icon: Briefcase,
      color: "text-amber-400",
      description: "Marico, Robi Axiata & Nestlé verified records",
    },
    {
      label: "Audited Impact Metrics",
      value: stats.impactMetrics,
      href: "/admin/metrics",
      icon: BarChart3,
      color: "text-emerald-400",
      description: "Macro milestones & operational ledgers",
    },
    {
      label: "Ventures & Ecosystems",
      value: stats.ventures,
      href: "/admin/ventures",
      icon: Compass,
      color: "text-sky-400",
      description: "LinkedIn Community BD, Skill Hunt & Career Talks",
    },
    {
      label: "Strategic Competency Domains",
      value: stats.expertiseDomains,
      href: "/admin/expertise",
      icon: Award,
      color: "text-amber-300",
      description: "RTM, B2B, sales coaching & personal branding",
    },
    {
      label: "Keynotes & Masterclasses",
      value: stats.speakingEvents,
      href: "/admin/speaking",
      icon: Mic,
      color: "text-purple-400",
      description: "University symposiums, campus summits & lectures",
    },
    {
      label: "Academic & PMP Credentials",
      value: stats.credentials,
      href: "/admin/credentials",
      icon: GraduationCap,
      color: "text-blue-400",
      description: "IBA DU Executive MBA, PMI PMP® & BBA",
    },
    {
      label: "Corporate Honors & Citations",
      value: stats.awards,
      href: "/admin/awards",
      icon: Trophy,
      color: "text-[#D4AF37]",
      description: "Marico Global CEO Awards & Robi Champion awards",
    },
    {
      label: "Media Coverage & Features",
      value: stats.mediaCoverage,
      href: "/admin/media-press",
      icon: Newspaper,
      color: "text-rose-400",
      description: "Financial Express, digital press & campus journals",
    },
    {
      label: "Community Testimonials",
      value: stats.testimonials,
      href: "/admin/testimonials",
      icon: Quote,
      color: "text-teal-400",
      description: "University campus leads & mentee feedback",
    },
    {
      label: "Media Library Assets",
      value: stats.mediaAssets,
      href: "/admin/media",
      icon: ImageIcon,
      color: "text-indigo-400",
      description: "Portraits, corporate insignias & event photography",
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Executive Control Center"
        subtitle="Live telemetry and Content Management System for Md. Altaf Hossain Raju's digital portfolio."
        actions={
          <button
            type="button"
            onClick={fetchStats}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0C111C] hover:bg-white/[0.04] border border-white/10 text-xs font-sans text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        }
      />

      {/* Quick Launchpad Action Bar */}
      <div className="mb-10 p-5 bg-[#0C111C] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#070A11] border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-sans font-semibold text-white">
              Production Database Connected &amp; Operational
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              PostgreSQL on Neon Serverless &bull; {stats.visibleSections} of {stats.totalSections} sections actively published
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/profile"
            className="px-3.5 py-2 bg-[#070A11] hover:bg-white/[0.04] border border-white/10 text-xs font-sans text-slate-200 hover:text-white transition-colors"
          >
            Edit Executive Bio
          </Link>
          <Link
            href="/admin/sections"
            className="px-3.5 py-2 bg-[#070A11] hover:bg-white/[0.04] border border-white/10 text-xs font-sans text-slate-200 hover:text-white transition-colors"
          >
            Reorder Sections
          </Link>
          <Link
            href="/admin/media"
            className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] text-xs font-sans font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* Primary Content Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="bg-[#0C111C] border border-white/10 p-5 hover:border-[#D4AF37]/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-sm bg-[#070A11] border border-white/10 flex items-center justify-center ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#D4AF37] transition-colors" />
                </div>
                <div className="font-serif text-3xl font-bold text-white tabular-nums mb-1">
                  {card.value}
                </div>
                <div className="text-xs font-sans font-semibold text-slate-200 mb-1 leading-snug">
                  {card.label}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-3 pt-3 border-t border-white/[0.04] leading-tight line-clamp-1">
                {card.description}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Asymmetric 2-Column Section: Recent Activity & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Activity Audit Log (8 cols) */}
        <div className="lg:col-span-8 bg-[#0C111C] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="font-serif text-lg font-bold text-white">
                Recent Audit Trail &amp; Content Operations
              </h2>
            </div>
            <Link
              href="/admin/activity"
              className="text-xs font-sans text-[#D4AF37] hover:underline"
            >
              View Full Log &rarr;
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No recent changes recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {recentLogs.map((log) => {
                const dateStr = new Date(log.created_at).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });

                return (
                  <div
                    key={log.id}
                    className="p-3.5 bg-[#070A11] border border-white/[0.06] flex items-start justify-between gap-4 text-xs font-sans"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 rounded-xs font-bold text-[10px] tracking-wider uppercase bg-[#D4AF37]/15 text-[#FCD34D] border border-[#D4AF37]/30">
                          {log.action}
                        </span>
                        <span className="text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                          {log.entity_type}
                        </span>
                      </div>
                      <p className="text-slate-200">
                        {log.details}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                      {dateStr}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* System Overview & Quick Access Dossier (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#0C111C] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.08]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-base font-bold text-white">
                Website Architecture Status
              </h3>
            </div>

            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Framework</span>
                <span className="text-white font-medium">Next.js 16.4 (Turbopack)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span className="text-slate-400">UI Engine</span>
                <span className="text-white font-medium">React 19.3</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Database</span>
                <span className="text-emerald-400 font-semibold">Neon PostgreSQL 16</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Authentication</span>
                <span className="text-white font-medium">JWT (256-bit WebCrypto)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <span className="text-slate-400">Section Modules</span>
                <span className="text-[#D4AF37] font-bold">{stats.visibleSections} / {stats.totalSections} Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Production Build</span>
                <span className="text-emerald-400 font-semibold">Passes Cleanly</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0C111C] border border-white/10 p-6">
            <h3 className="font-serif text-base font-bold text-white mb-2">
              Instant Website Actions
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Need to modify executive information or adjust section sequencing? Jump straight to the dedicated management modules.
            </p>
            <div className="space-y-2 text-xs font-sans">
              <Link
                href="/admin/career"
                className="w-full flex items-center justify-between p-2.5 bg-[#070A11] hover:bg-white/[0.04] border border-white/10 text-slate-200 transition-colors"
              >
                <span>Manage Career Timeline</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </Link>
              <Link
                href="/admin/metrics"
                className="w-full flex items-center justify-between p-2.5 bg-[#070A11] hover:bg-white/[0.04] border border-white/10 text-slate-200 transition-colors"
              >
                <span>Update Impact Metrics</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </Link>
              <Link
                href="/admin/settings"
                className="w-full flex items-center justify-between p-2.5 bg-[#070A11] hover:bg-white/[0.04] border border-white/10 text-slate-200 transition-colors"
              >
                <span>SEO &amp; Visual Settings</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
