import React, { type FunctionComponent, type ReactNode } from "react";
import { clsx } from "clsx";

interface StatCardProps {
  label: ReactNode;
  value: ReactNode | number;
  icon?: React.ReactNode;
  description?: ReactNode;
  className?: string;
}

export const StatCard: FunctionComponent<StatCardProps> = ({
  label,
  value,
  icon,
  description,
  className = "",
}) => {
  return (
    <div
      className={clsx(
        // Các class cố định luôn có
        "flex items-center gap-4 p-6 rounded-2xl border border-slate-300 transition-all duration-300",
        "group relative overflow-hidden",
        "hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none" />

      {icon && (
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em]">
            {label}
          </p>

          {/* Value hiển thị màu đậm đà */}
          <h3 className="text-3xl font-black tracking-tight">{value}</h3>

          {description && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                {description}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
