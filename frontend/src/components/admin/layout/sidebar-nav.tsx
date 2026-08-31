"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavSection } from "./sidebar-data";

type Props = {
  sections: NavSection[];
  onNavigateAction?: () => void;
};

export function SidebarNav({ sections, onNavigateAction }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            {section.title}
          </p>
          <nav className="space-y-0.5">
            {section.items.map(({ label, href, icon: Icon, badge }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigateAction}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-100 text-orange-600"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {badge ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}
