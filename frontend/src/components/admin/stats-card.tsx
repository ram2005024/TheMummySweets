import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
}

export function StatsCard({ label, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <div className="rounded-lg bg-orange-50 p-2">
          <Icon className="h-4 w-4 text-orange-500" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-neutral-900">{value}</p>
      {trend && <p className="mt-1 text-xs text-neutral-400">{trend}</p>}
    </div>
  );
}
