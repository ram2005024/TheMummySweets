"use client";

import {
  Archive,
  BarChart2,
  LayoutDashboard,
  LucideIcon,
  MapPin,
  Megaphone,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon; // Lucide icon component type
  badge?: number;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: 12 },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Inventory", href: "/admin/inventory", icon: Archive },
      { label: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    title: "Advanced",
    items: [
      { label: "Delivery map", href: "/admin/delivery", icon: MapPin },
      { label: "Mummy AI", href: "/admin/ai", icon: Sparkles },
      { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
      { label: "Reports", href: "/admin/reports", icon: BarChart2 },
      { label: "Employees", href: "/admin/employees", icon: UserCog },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];
