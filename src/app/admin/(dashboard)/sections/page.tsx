"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, Loader2, CheckCircle2, Layers } from "lucide-react";

interface SectionSetting {
  id: string;
  label: string;
  is_visible: boolean;
  sort_order: number;
  custom_title?: string;
  custom_subtitle?: string;
}

export default function SectionsAdminPage() {
  const [sections, setSections] = useState<SectionSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sections");
      if (res.ok) {
        const data = await res.json();
        setSections(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setSections(updated);
  };

  const toggleVisibility = (index: number) => {
    const updated = [...sections];
    updated[index].is_visible = !updated[index].is_visible;
    setSections(updated);
  };

  const handleTitleChange = (index: number, field: "custom_title" | "custom_subtitle", val: string) => {
    const updated = [...sections];
    updated[index][field] = val;
    setSections(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });

      if (res.ok) {
        setNotification("Section layout sequence & visibility updated on live website!");
        setTimeout(() => setNotification(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Section Layout &amp; Visibility Architecture"
        subtitle="Reorder website narrative flow, toggle sections on or off, and customize section headlines."
        breadcrumbs={[{ label: "Section Layout" }]}
        actions={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Section Layout</span>
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
          <span className="text-xs">Loading section settings...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-[#0C111C] border border-white/10 text-xs font-sans text-slate-300 flex items-center justify-between">
            <span>
              Drag or use the up/down arrows to adjust the order of sections on the home page. Toggling visibility will instantly show or hide that section from public view.
            </span>
            <span className="font-mono text-[#D4AF37] font-semibold">
              {sections.filter((s) => s.is_visible).length} / {sections.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className={`p-5 bg-[#0C111C] border transition-all ${
                  section.is_visible
                    ? "border-white/10 hover:border-[#D4AF37]/50"
                    : "border-white/5 opacity-60 bg-[#070A11]"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Reorder and ID */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, "up")}
                        className="p-1 rounded bg-[#070A11] border border-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sections.length - 1}
                        onClick={() => moveSection(idx, "down")}
                        className="p-1 rounded bg-[#070A11] border border-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono text-sm font-bold text-[#D4AF37] w-8">
                      #{idx + 1}
                    </div>

                    <div>
                      <div className="font-serif text-base font-bold text-white flex items-center gap-2">
                        <span>{section.label}</span>
                        <span className="font-mono text-[10px] text-slate-400 font-normal">
                          id: #{section.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-sans mt-0.5">
                        {section.is_visible ? "Rendered on public website" : "Hidden from public website"}
                      </div>
                    </div>
                  </div>

                  {/* Right: Visibility Toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleVisibility(idx)}
                      className={`px-3 py-1.5 rounded-xs text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                        section.is_visible
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {section.is_visible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Section Title Customization (Collapsible inputs) */}
                {section.id !== "hero" && (
                  <div className="mt-4 pt-4 border-t border-white/[0.04] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Custom Section Title Override
                      </label>
                      <input
                        type="text"
                        placeholder="Leave empty for default title"
                        value={section.custom_title || ""}
                        onChange={(e) => handleTitleChange(idx, "custom_title", e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#070A11] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Custom Subtitle Override
                      </label>
                      <input
                        type="text"
                        placeholder="Leave empty for default subtitle"
                        value={section.custom_subtitle || ""}
                        onChange={(e) => handleTitleChange(idx, "custom_subtitle", e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#070A11] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          <div className="sticky bottom-4 p-4 bg-[#0C111C]/95 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-between">
            <span className="text-xs font-sans text-slate-400">
              Click &quot;Save Section Layout&quot; to push sequence updates to the production frontend.
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Saving..." : "Save Section Layout"}</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
