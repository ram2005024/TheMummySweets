import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminTopbar } from "@/components/admin/layout/admin-topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* Desktop sidebar — hidden on mobile */}
      <AdminSidebar />

      {/* Content area — pushed right on desktop */}
      <div className="lg:ml-56 flex flex-col min-h-screen">
        <AdminTopbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
