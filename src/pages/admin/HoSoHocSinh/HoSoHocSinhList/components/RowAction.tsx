import React from "react";
import { Eye, Trash2 } from "lucide-react";

interface RowActionsProps {
  onView: () => void;
  onDelete: () => void;
}

const RowActions: React.FC<RowActionsProps> = ({ onView, onDelete }) => {
  return (
    <div className="flex items-center gap-2.5 justify-end">
      {/* 1. NÚT XEM CHI TIẾT */}
      {/* Thay đổi: Sử dụng "group/view" để đặt tên định danh riêng cho nút Xem */}
      <div className="relative group/view">
        <button
          type="button"
          onClick={onView}
          className="flex items-center justify-center p-2 text-gray-500 
          hover:text-blue-600 bg-white hover:bg-blue-50 border 
          border-gray-200 hover:border-blue-200 rounded-lg transition-all 
          duration-150 active:scale-95 cursor-pointer 
          focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <Eye className="w-4 h-4 transition-transform duration-150 group-hover/view:scale-110" />
        </button>

        {/* Chỉ hiển thị khi hover đúng vào group/view */}
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
          invisible opacity-0 group-hover/view:visible group-hover/view:opacity-100
          flex items-center justify-center px-2 py-1 
          text-[10px] font-medium text-white bg-gray-900 
          rounded-md whitespace-nowrap pointer-events-none z-10 
          transition-all duration-150"
        >
          Xem hồ sơ
        </span>
      </div>

      {/* 2. NÚT XÓA */}
      {/* Thay đổi: Sử dụng "group/delete" để đặt tên định danh riêng cho nút Xóa */}
      <div className="relative group/delete">
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center p-2 
          text-red-500 hover:text-red-650 bg-white 
          hover:bg-red-50 border border-red-200/60 
          hover:border-red-300 rounded-lg transition-all duration-150 
          active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          <Trash2 className="w-4 h-4 transition-transform duration-150 group-hover/delete:scale-110" />
        </button>

        {/* Chỉ hiển thị khi hover đúng vào group/delete */}
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
          invisible opacity-0 group-hover/delete:visible group-hover/delete:opacity-100
          flex items-center justify-center px-2 py-1 
          text-[10px] font-medium text-white bg-gray-900 rounded-md 
          whitespace-nowrap pointer-events-none z-10 
          transition-all duration-150"
        >
          Xóa hồ sơ
        </span>
      </div>
    </div>
  );
};

export default RowActions;
