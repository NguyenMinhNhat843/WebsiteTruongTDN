import React, { type FunctionComponent, type ReactNode } from "react";

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
}

export const StatCard: FunctionComponent<StatCardProps> = ({
  label,
  value,
  icon,
  color = "blue",
  description,
}) => {
  // 1. Lấy mã Hex gốc
  const baseColor =
    DEFAULT_COLORS[color] || (color.startsWith("#") ? color : "#3b82f6");

  // 2. Helper tạo styles động
  const getDynamicStyles = (hex: string) => {
    return {
      container: {
        // Nền rất nhạt (6% - mã Hex 10)
        backgroundColor: `${hex}10`,
        // Viền rõ hơn chút (25% - mã Hex 40)
        borderColor: `${hex}50`,
      },
      iconBox: {
        // Nền icon đậm hơn nền card (15% - mã Hex 26)
        backgroundColor: `${hex}26`,
        borderColor: `${hex}50`,
        color: hex,
      },
      dot: {
        backgroundColor: hex,
      },
    };
  };

  const styles = getDynamicStyles(baseColor);

  return (
    <div
      style={styles.container}
      className="p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg group relative overflow-hidden"
    >
      {/* Hiệu ứng vết sáng nhẹ ở góc */}
      {/* <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 pointer-events-none"
        style={{ backgroundColor: baseColor }}
      /> */}

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest opacity-80">
            {label}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {value}
          </h3>

          {description && (
            <p className="text-xs mt-2 font-medium text-slate-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={styles.dot} />
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div
            style={styles.iconBox}
            className="w-14 h-14 flex items-center justify-center rounded-2xl text-3xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm"
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
