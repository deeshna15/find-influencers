import type { ReactNode } from "react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4",
        "transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && (
          <span className="text-gray-400 dark:text-gray-500">{icon}</span>
        )}
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </span>
      </div>
      <div className="text-lg font-semibold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}
