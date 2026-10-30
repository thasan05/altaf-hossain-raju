"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-white/[0.08] gap-4">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs font-sans text-slate-300 mb-2">
            <Link href="/admin" className="hover:text-slate-200 transition-colors">
              CMS
            </Link>
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                {bc.href ? (
                  <Link href={bc.href} className="hover:text-slate-200 transition-colors">
                    {bc.label}
                  </Link>
                ) : (
                  <span className="text-[#D4AF37] font-medium">{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
