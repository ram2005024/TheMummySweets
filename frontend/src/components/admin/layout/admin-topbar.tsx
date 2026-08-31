"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";
import { MobileSidebar } from "./mobile-sidebar";

export function AdminTopbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-stone-200 bg-[#faf8f4] px-4">
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-stone-500 hover:text-stone-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 max-w-sm">
          <Search className="h-4 w-4 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Search orders, products..."
            className="flex-1 bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Notification bell */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500" />
          </button>

          {/* New product button */}
          <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors">
            <span>+</span>
            <span className="hidden sm:inline">New product</span>
          </button>
        </div>
      </header>
    </>
  );
}
