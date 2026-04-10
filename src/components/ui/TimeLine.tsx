import type { ReactNode } from "react";

// Props cho từng item lẻ
interface TimelineItemProps {
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode; // Dùng cho những thứ như "Người thực hiện"
  active?: boolean;
  isLast?: boolean;
}

// Props cho Container tổng
interface TimelineProps {
  items: TimelineItemProps[];
  className?: string;
}

export const TimelineItem = ({
  label,
  value,
  description,
  active = false,
  isLast = false,
}: TimelineItemProps) => (
  <div className={`relative pl-8 ${!isLast ? "pb-6" : ""}`}>
    {/* Đường line nối các node */}
    {!isLast && (
      <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-gray-100" />
    )}

    {/* Dot tròn */}
    <div
      className={`absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-colors duration-300 ${
        active ? "bg-cyan-500" : "bg-gray-200"
      }`}
    />

    {/* Nội dung */}
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-700">{value}</p>
      {description && (
        <div className="mt-1 text-xs text-gray-500 leading-relaxed">
          {description}
        </div>
      )}
    </div>
  </div>
);

export const Timeline = ({ items, className = "" }: TimelineProps) => {
  return (
    <div className={`relative ${className}`}>
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          {...item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};
