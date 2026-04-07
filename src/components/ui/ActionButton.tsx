import type { ReactNode } from "react";

interface ActionButtonProps {
  label?: string;
  icon?: ReactNode;
  primary?: boolean;
  color: string; // Ví dụ: "#3b82f6"
  onClick?: () => void;
  tooltip?: string; // Thêm prop tooltip riêng nếu muốn
}

export default function ActionButton({
  label,
  icon,
  primary,
  color,
  onClick,
  tooltip,
}: ActionButtonProps) {
  // --- LOGIC MÀU SẮC CẢI TIẾN ---
  // Mặc định: Nền 12% độ đậm (1F), Viền 25% (40)
  const bgDefault = `${color}1F`;
  const borderColor = `${color}40`;

  // Khi Hover: Nền 25% (40), Chữ giữ nguyên mã gốc (đậm nhất)
  const bgHover = `${color}40`;
  const textColorDefault = primary ? color : `${color}CC`; // 80% opacity cho chữ lúc bình thường
  const textColorHover = color; // 100% opacity khi hover

  // Tính toán padding nếu chỉ có icon
  const isIconOnly = !label && icon;
  const paddingClass = isIconOnly ? "p-2" : "px-4 py-2";

  return (
    <div className="relative group">
      <button
        onClick={(e) => {
          e.stopPropagation(); // Tránh trigger click vào row của table
          onClick?.();
        }}
        style={{
          borderColor: borderColor,
          backgroundColor: bgDefault,
          color: textColorDefault,
        }}
        className={`
          ${primary ? "flex-1" : "flex-none"}
          ${paddingClass}
          inline-flex items-center justify-center gap-2
          text-[13px] font-bold
          rounded-[10px] border border-solid
          cursor-pointer transition-all duration-200
          active:scale-90
        `}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = bgHover;
          e.currentTarget.style.color = textColorHover;
          e.currentTarget.style.borderColor = color; // Viền đậm lên khi hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = bgDefault;
          e.currentTarget.style.color = textColorDefault;
          e.currentTarget.style.borderColor = borderColor;
        }}
      >
        {icon && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
        {label && <span>{label}</span>}
      </button>

      {/* Tooltip: Chỉ hiện khi có icon-only hoặc có prop tooltip */}
      {(isIconOnly || tooltip) && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[11px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
          {tooltip || label || "Thao tác"}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
}
