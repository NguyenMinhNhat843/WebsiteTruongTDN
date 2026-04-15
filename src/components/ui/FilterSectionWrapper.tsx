import React from "react";
import { Filter, X } from "lucide-react";

interface FilterSectionWrapperProps {
  children?: React.ReactNode;
  activeCount: number; // Số lượng bộ lọc đang áp dụng
  onClear: () => void; // Hàm xóa hết bộ lọc
  title?: string;
}

const FilterSectionWrapper = ({
  children,
  activeCount,
  onClear,
  title = "Bộ lọc",
}: FilterSectionWrapperProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Filter size={18} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-slate-700 text-sm">{title}</h3>

          {activeCount > 0 && (
            <span className="flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-in zoom-in duration-300">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-semibold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
          >
            <X size={14} />
            Xóa lọc
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FilterSectionWrapper;
