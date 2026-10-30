import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Panel | Altaf Hossain Raju CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070A11] text-[#CBD5E1] font-sans flex flex-col antialiased">
      <AdminSidebar />
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        <main className="flex-1 p-4 sm:p-8 lg:p-10 pt-20 lg:pt-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
