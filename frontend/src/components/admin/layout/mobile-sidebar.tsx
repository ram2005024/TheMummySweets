"use client";

import { X } from "lucide-react";
import { navSections } from "./sidebar-data";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileSidebar({ isOpen, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-56 flex flex-col bg-[#faf8f4] border-r border-stone-200 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-white text-xs font-bold">
              M
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-stone-900">The Mummy</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-wide">
                Operations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <SidebarNav sections={navSections} onNavigate={onClose} />

        <SidebarUser name="Kabita Thapa" role="Store manager" initials="KT" />
      </div>
    </>
  );
}
