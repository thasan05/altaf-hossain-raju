"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Phone,
  BarChart3,
  Briefcase,
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
  Settings,
  ShieldCheck,
  History,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navSections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      title: "WEBSITE CONTENT",
      items: [
        { label: "Profile & Bio", href: "/admin/profile", icon: User },
        { label: "Contact Channels", href: "/admin/contact", icon: Phone },
        { label: "Impact Metrics", href: "/admin/metrics", icon: BarChart3 },
        { label: "Career Journey", href: "/admin/career", icon: Briefcase },
        { label: "Ventures & LCB", href: "/admin/ventures", icon: Compass },
        { label: "Competencies", href: "/admin/expertise", icon: Award },
        { label: "Speaking Events", href: "/admin/speaking", icon: Mic },
        { label: "Credentials", href: "/admin/credentials", icon: GraduationCap },
        { label: "Awards & Honors", href: "/admin/awards", icon: Trophy },
        { label: "Affiliations", href: "/admin/affiliations", icon: Building2 },
        { label: "Press & Media", href: "/admin/media-press", icon: Newspaper },
        { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      ],
    },
    {
      title: "MEDIA & LAYOUT",
      items: [
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
        { label: "Section Layout", href: "/admin/sections", icon: Layers },
      ],
    },
    {
      title: "CONFIGURATION",
      items: [
        { label: "SEO & Settings", href: "/admin/settings", icon: Settings },
        { label: "Activity Audit", href: "/admin/activity", icon: History },
        { label: "Security & Access", href: "/admin/security", icon: ShieldCheck },
      ],
    },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0C111C] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[#070A11] border border-[#D4AF37]/30 flex items-center justify-center font-serif text-xs font-bold text-[#D4AF37]">
            AHR
          </div>
          <span className="font-serif text-sm font-bold text-white tracking-tight">
            CMS Admin Panel
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-sm bg-[#070A11] border border-white/10 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay on Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0C111C] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Branding */}
        <div className="p-5 border-b border-white/[0.08]">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-sm bg-[#070A11] border border-[#D4AF37]/40 flex items-center justify-center font-serif text-sm font-bold text-[#D4AF37] group-hover:border-[#D4AF37] transition-colors">
                AHR
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-sm font-bold text-white tracking-tight group-hover:text-slate-100 transition-colors">
                    Altaf Hossain Raju
                  </span>
                </div>
                <span className="text-[11px] font-sans font-semibold text-[#D4AF37] tracking-wider uppercase">
                  CMS Administration
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 text-xs font-sans">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-sm transition-all min-h-[38px] ${
                        isActive
                          ? "bg-[#D4AF37]/15 text-white font-semibold border-l-2 border-[#D4AF37]"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-[#D4AF37]" : "text-slate-400 group-hover:text-white"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {isActive ? (
                        <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom User & Actions Section */}
        <div className="p-4 border-t border-white/[0.08] bg-[#070A11]/60 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-sans text-slate-300 hover:text-white bg-[#0C111C] border border-white/10 hover:border-[#D4AF37]/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>View Live Website</span>
            </span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider">Public</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-sm text-xs font-sans text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
