import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  color: string; // Mã hex động, ví dụ: #3b82f6
  icon: ReactNode;
}

export default function StatCard({ label, value, color, icon }: StatCardProps) {
  // Màu viền mặc định nhẹ nhàng hơn cho nền trắng
  const defaultBorder = "#e2e8f0";
  const hoverBorder = `${color}88`; // Đậm hơn một chút để nổi bật trên nền trắng

  return (
    <div
      style={{ borderColor: defaultBorder }}
      className="
        bg-white border border-solid rounded-[14px] 
        px-5 py-4.5 flex items-center gap-3.5
        transition-all duration-200 cursor-default
        shadow-sm hover:shadow-md
      "
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hoverBorder;
        e.currentTarget.style.boxShadow = `0 4px 12px ${color}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = defaultBorder;
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Icon Wrapper */}
      <div
        style={{
          backgroundColor: `${color}12`, // Màu nền icon nhạt hơn
          color: color,
        }}
        className="
          w-11 h-11 rounded-xl shrink-0
          flex items-center justify-center text-[20px]
        "
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <div className="text-[#1e293b] text-2xl font-extrabold leading-none">
          {value}
        </div>
        <div className="text-[#64748b] text-[12px] mt-[3px] font-medium">
          {label}
        </div>
      </div>
    </div>
  );
}
