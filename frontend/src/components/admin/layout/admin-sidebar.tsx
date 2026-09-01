import { navSections } from "./sidebar-data";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex h-screen w-56 flex-col bg-[#faf8f4] border-r border-stone-200 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-stone-200 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-white text-xs font-bold shrink-0">
          M
        </div>
        <div className="leading-tight">
          <p className="text-xs font-bold text-stone-900">The Mummy</p>
          <p className="text-[10px] text-stone-400 uppercase tracking-wide">
            Operations
          </p>
        </div>
      </div>

      <SidebarNav sections={navSections} />

      <SidebarUser />
    </aside>
  );
}
