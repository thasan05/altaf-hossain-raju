"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { History, RefreshCw, Loader2, ShieldCheck, Filter } from "lucide-react";

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: string;
  ip_address?: string;
  created_at: string;
}

export default function ActivityAuditAdminPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("ALL");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/activity?limit=100");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterAction === "ALL") return true;
    return log.action === filterAction;
  });

  return (
    <div>
      <AdminHeader
        title="Administrative Activity &amp; Audit Trail"
        subtitle="Chronological forensic audit log tracking every content mutation, security event, and publishing cycle."
        breadcrumbs={[{ label: "Activity Audit" }]}
        actions={
          <button
            type="button"
            onClick={fetchLogs}
            className="px-4 py-2 bg-[#0C111C] hover:bg-white/[0.04] border border-white/10 text-xs font-sans text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Audit Log</span>
          </button>
        }
      />

      {/* Filter Ribbon */}
      <div className="mb-6 p-4 bg-[#0C111C] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-300">
            Filter Action:
          </span>
          {["ALL", "CREATE", "UPDATE", "DELETE", "UPLOAD", "LOGIN"].map((act) => (
            <button
              key={act}
              type="button"
              onClick={() => setFilterAction(act)}
              className={`px-3 py-1 rounded-xs text-[11px] font-sans font-semibold transition-colors ${
                filterAction === act
                  ? "bg-[#D4AF37] text-[#070A11]"
                  : "bg-[#070A11] border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {act}
            </button>
          ))}
        </div>

        <div className="text-xs font-sans text-slate-400 font-mono">
          Showing {filteredLogs.length} audit entries
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-2" />
          <span className="text-xs">Loading audit records...</span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-16 bg-[#0C111C] border border-white/10 text-center text-slate-400 text-xs">
          No activity logs recorded matching your action filter.
        </div>
      ) : (
        <div className="bg-[#0C111C] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#070A11] border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-3.5 px-4 font-semibold">Action</th>
                  <th className="py-3.5 px-4 font-semibold">Entity Type</th>
                  <th className="py-3.5 px-4 font-semibold">Details</th>
                  <th className="py-3.5 px-4 font-semibold">Entity ID</th>
                  <th className="py-3.5 px-4 font-semibold">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLogs.map((log) => {
                  const dateStr = new Date(log.created_at).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                  });

                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                            log.action === "CREATE" || log.action === "UPLOAD"
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                              : log.action === "UPDATE"
                              ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                              : log.action === "DELETE"
                              ? "bg-red-500/15 border border-red-500/30 text-red-400"
                              : "bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#FCD34D]"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                        {log.entity_type}
                      </td>
                      <td className="py-3 px-4 text-slate-200 max-w-md">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {log.entity_id || "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {log.user_id || "admin"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
