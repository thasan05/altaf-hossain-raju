"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Upload, Search, Check, Image as ImageIcon, Loader2 } from "lucide-react";

interface MediaAsset {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  category: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, altText?: string) => void;
  selectedUrl?: string;
  categoryFilter?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedUrl,
  categoryFilter,
}: MediaPickerModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } catch (err) {
      console.error("Failed to fetch media assets:", err);
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
    formData.append("category", categoryFilter || "general");

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        await fetchAssets();
        onSelect(data.asset.filePath, data.asset.altText);
        onClose();
      } else {
        const err = await res.json();
        setUploadError(err.error || "Upload failed");
      }
    } catch {
      setUploadError("Upload network error");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.file_name.toLowerCase().includes(search.toLowerCase()) ||
      (a.alt_text && a.alt_text.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0C111C] border border-white/10 rounded-sm w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="font-serif text-lg font-bold text-white">
              Select or Upload Media Asset
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Upload Bar */}
        <div className="p-4 border-b border-white/[0.06] bg-[#070A11] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0C111C] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#d8b56f] text-[#070A11] text-xs font-sans font-bold uppercase tracking-wider cursor-pointer transition-colors shrink-0">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload New Asset</span>
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
        </div>

        {uploadError && (
          <div className="px-6 py-2 bg-red-500/10 border-b border-red-500/20 text-xs text-red-400 font-sans">
            {uploadError}
          </div>
        )}

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#D4AF37]" />
              <span className="text-xs">Loading media assets...</span>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No media assets match your query. Upload one using the button above.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedUrl === asset.file_path;
                const isImage = asset.mime_type.startsWith("image/");

                return (
                  <div
                    key={asset.id}
                    onClick={() => {
                      onSelect(asset.file_path, asset.alt_text);
                      onClose();
                    }}
                    className={`group relative aspect-square bg-[#070A11] border rounded-sm overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {isImage ? (
                      <Image
                        src={asset.file_path}
                        alt={asset.alt_text || asset.file_name}
                        fill
                        unoptimized
                        sizes="160px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-slate-400">
                        <span className="text-xs font-mono uppercase">{asset.file_name.split(".").pop()}</span>
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#D4AF37] text-[#070A11] flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-[#070A11]/90 backdrop-blur-sm p-2 text-[10px] text-slate-300 truncate">
                      {asset.file_name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#070A11] flex items-center justify-between text-xs text-slate-400 font-sans">
          <span>{filteredAssets.length} asset(s) available</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-white/10 text-slate-300 hover:text-white text-xs font-medium"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
