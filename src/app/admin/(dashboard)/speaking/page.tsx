"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, Image as ImageIcon, Users } from "lucide-react";

interface SpeakingEvent {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  event_type: string;
  institution: string;
  date_text?: string;
  participants?: string;
  description: string;
  image_url: string;
  key_topics: string[] | string;
  sort_order: number;
  is_published: boolean;
}

export default function SpeakingAdminPage() {
  const [events, setEvents] = useState<SpeakingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpeakingEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SpeakingEvent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [form, setForm] = useState({
    slug: "",
    title: "",
    organizer: "",
    eventType: "Keynote",
    institution: "",
    dateText: "",
    participants: "",
    description: "",
    imageUrl: "/images/lcb-campus-workshop.webp",
    keyTopics: "",
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/speaking");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setForm({
      slug: "",
      title: "",
      organizer: "",
      eventType: "Keynote",
      institution: "",
      dateText: "",
      participants: "",
      description: "",
      imageUrl: "/images/lcb-campus-workshop.webp",
      keyTopics: "Personal Branding, Route-to-Market, FMCG Hiring",
      sortOrder: events.length + 1,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (ev: SpeakingEvent) => {
    setEditingEvent(ev);
    const topics = typeof ev.key_topics === "string" ? JSON.parse(ev.key_topics) : ev.key_topics;
    setForm({
      slug: ev.slug,
      title: ev.title,
      organizer: ev.organizer,
      eventType: ev.event_type,
      institution: ev.institution,
      dateText: ev.date_text || "",
      participants: ev.participants || "",
      description: ev.description,
      imageUrl: ev.image_url,
      keyTopics: Array.isArray(topics) ? topics.join(", ") : "",
      sortOrder: ev.sort_order,
      isPublished: ev.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingEvent ? `/api/admin/speaking/${editingEvent.id}` : "/api/admin/speaking";
      const method = editingEvent ? "PUT" : "POST";

      const payload = {
        ...form,
        keyTopics: form.keyTopics.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNotification(editingEvent ? "Event updated successfully!" : "New event added successfully!");
        setModalOpen(false);
        await fetchEvents();
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
      const res = await fetch(`/api/admin/speaking/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Event deleted.");
        setDeleteTarget(null);
        await fetchEvents();
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
        title="Keynotes, Masterclasses &amp; University Addresses"
        subtitle="Manage public speaking engagements, university masterclasses, and executive dialogues."
        breadcrumbs={[{ label: "Speaking Events" }]}
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Speaking Event</span>
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
          <span className="text-xs">Loading speaking events...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-[#0C111C] border border-white/10 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-[#070A11] border-b border-white/[0.08]">
                  <Image
                    src={ev.image_url}
                    alt={ev.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#070A11]/90 backdrop-blur-sm border border-white/10 text-[10px] font-sans uppercase font-bold text-[#D4AF37]">
                    {ev.event_type}
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-[11px] font-sans text-slate-400 mb-1 font-semibold truncate">
                    {ev.institution}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug line-clamp-2">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {ev.description}
                  </p>
                  {ev.participants && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.participants}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-white/[0.06] mt-2 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">Order: #{ev.sort_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(ev)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    title="Edit Event"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(ev)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0C111C] border border-white/10 rounded-sm w-full max-w-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold text-white mb-4 pb-3 border-b border-white/[0.08]">
              {editingEvent ? "Edit Speaking Event" : "Add Speaking Event"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Personal Branding & LinkedIn Optimization Masterclass"
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Organizer / Host
                  </label>
                  <input
                    type="text"
                    required
                    value={form.organizer}
                    onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                    placeholder="Dept. of Marketing, Jagannath University & LCB"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Keynote">Keynote</option>
                    <option value="Masterclass">Masterclass</option>
                    <option value="Summit">Summit</option>
                    <option value="Panel Discussion">Panel Discussion</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Institution / Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    placeholder="Faculty of Business Studies, Jagannath University"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Participants / Dignitary Note
                  </label>
                  <input
                    type="text"
                    value={form.participants}
                    onChange={(e) => setForm({ ...form, participants: e.target.value })}
                    placeholder="500+ Faculty & Undergraduates"
                    className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Documentary Image */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Documentary Event Photo URL
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Key Topics (Comma-separated)
                </label>
                <input
                  type="text"
                  value={form.keyTopics}
                  onChange={(e) => setForm({ ...form, keyTopics: e.target.value })}
                  placeholder="LinkedIn Profile Architecture, Algorithmic Reach, Corporate Recruitment"
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
                  <span>{editingEvent ? "Save Changes" : "Create Event"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        categoryFilter="event"
        selectedUrl={form.imageUrl}
        onSelect={(url) => setForm({ ...form, imageUrl: url })}
      />

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Speaking Event"
        message={`Are you sure you want to permanently delete the speaking event "${deleteTarget?.title}"?`}
        confirmLabel="Delete Event"
        isLoading={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
