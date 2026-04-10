import React, { type FunctionComponent, type ReactNode } from "react";
import { clsx } from "clsx";

// Định nghĩa các màu mặc định (Brand Colors)
const DEFAULT_COLORS: Record<string, string> = {
  blue: "#3b82f6",
  green: "#10b981",
  orange: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  slate: "#64748b",
};

type StatColor =
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "purple"
  | "slate"
  | string;

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: StatColor;
  description?: ReactNode;
  className?: string;
}

const getDynamicStyles = (hex: string) => {
  return {
    container: {
      backgroundColor: "#ffffff", // Giữ nền trắng để text nổi bật
      borderColor: `${hex}30`,
      boxShadow: `0 10px 15px -3px ${hex}15`, // Đổ bóng theo màu card
    },
    // Hiệu ứng dải màu gradient nhẹ ở nền
    overlay: {
      background: `linear-gradient(135deg, ${hex}10 0%, ${hex}05 100%)`,
    },
    valueText: {
      color: hex,
      // Hiệu ứng text-shadow nhẹ để chữ "đậm đà" hơn
      textShadow: `0px 2px 4px ${hex}20`,
    },
    iconBox: {
      background: `linear-gradient(135deg, ${hex} 0%, ${hex}dd 100%)`,
      color: "#ffffff", // Icon trắng trên nền đậm nhìn sẽ sang hơn
      boxShadow: `0 4px 12px ${hex}40`,
    },
  };
};

export const StatCard: FunctionComponent<StatCardProps> = ({
  label,
  value,
  icon,
  color = "blue",
  description,
  className = "",
}) => {
  const baseColor =
    DEFAULT_COLORS[color] || (color.startsWith("#") ? color : "#3b82f6");
  const styles = getDynamicStyles(baseColor);

  return (
    <div
      style={styles.container}
      className={clsx(
        // Các class cố định luôn có
        "flex items-center gap-4 p-6 rounded-2xl border transition-all duration-300",
        "group relative overflow-hidden",
        "hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      {/* Background Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={styles.overlay}
      />

      {icon && (
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} shrink-0`}
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
            <div className="flex items-center gap-2 mt-3">
              <span
                className="flex h-2 w-2 rounded-full"
                style={{ backgroundColor: baseColor }}
              />
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
