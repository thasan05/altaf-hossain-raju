"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Upload, Search, Trash2, Copy, Check, Loader2, Image as ImageIcon, CheckCircle2, FileText } from "lucide-react";

interface MediaAsset {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  category: string;
  created_at: string;
}

export default function MediaLibraryAdminPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [notification, setNotification] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", categoryFilter === "all" ? "general" : categoryFilter);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setNotification(`Successfully uploaded ${file.name}`);
        await fetchAssets();
        setTimeout(() => setNotification(""), 3500);
      } else {
        const err = await res.json();
        setUploadError(err.error || "Failed to upload file.");
      }
    } catch {
      setUploadError("Network error during file upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.file_path);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/admin/media/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification(`Asset "${deleteTarget.file_name}" removed.`);
        setDeleteTarget(null);
        await fetchAssets();
        setTimeout(() => setNotification(""), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.file_name.toLowerCase().includes(search.toLowerCase()) ||
      (a.alt_text && a.alt_text.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div>
      <AdminHeader
        title="Persistent Media Library &amp; Asset Vault"
        subtitle="Manage portraits, verified summit photography, company insignias, and press publication assets."
        breadcrumbs={[{ label: "Media Library" }]}
        actions={
          <label className="px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Asset</span>
              </>
            )}
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        }
      />

      {notification && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-xs font-sans text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {uploadError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-xs font-sans text-red-300">
          {uploadError}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-6 p-4 bg-[#0C111C] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-[#070A11] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Assets" },
            { id: "portrait", label: "Portraits" },
            { id: "event", label: "Event Photos" },
            { id: "logo", label: "Insignia Logos" },
            { id: "general", label: "General" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider font-semibold transition-colors shrink-0 ${
                categoryFilter === tab.id
                  ? "bg-[#D4AF37] text-[#070A11]"
                  : "bg-[#070A11] border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-2" />
          <span className="text-xs">Loading media vault...</span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="p-16 bg-[#0C111C] border border-white/10 text-center text-slate-400 text-xs">
          No media assets match your search filter. Click &quot;Upload Asset&quot; to upload photography.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => {
            const isImage = asset.mime_type.startsWith("image/");
            const isCopied = copiedId === asset.id;

            return (
              <div
                key={asset.id}
                className="group bg-[#0C111C] border border-white/10 hover:border-[#D4AF37]/50 transition-all rounded-xs overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <div className="relative aspect-square w-full bg-[#070A11] overflow-hidden flex items-center justify-center">
                  {isImage ? (
                    <Image
                      src={asset.file_path}
                      alt={asset.alt_text || asset.file_name}
                      fill
                      unoptimized
                      sizes="180px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <FileText className="w-10 h-10 text-slate-500" />
                  )}

                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#070A11]/90 backdrop-blur-sm border border-white/10 text-[9px] font-mono uppercase text-[#D4AF37]">
                    {formatFileSize(asset.file_size)}
                  </div>
                </div>

                <div className="p-3 bg-[#0C111C]">
                  <div className="text-xs font-semibold text-white truncate" title={asset.file_name}>
                    {asset.file_name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase">
                    {asset.category}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37] hover:underline"
                      title="Copy Public URL"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(asset)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Media Asset"
        message={`Are you sure you want to permanently delete "${deleteTarget?.file_name}" from the media library and storage?`}
        confirmLabel="Delete Asset"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
