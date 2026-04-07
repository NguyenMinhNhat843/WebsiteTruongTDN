import { Edit3, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

interface RowActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const RowActions: React.FC<RowActionsProps> = ({
  onView,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex items-center gap-1 justify-end">
      <button
        onClick={onView}
        title="Xem hồ sơ"
        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
      >
        <Eye size={14} />
      </button>
      <button
        onClick={onEdit}
        title="Chỉnh sửa"
        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
      >
        <Edit3 size={14} />
      </button>
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          title="Thêm"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <MoreHorizontal size={14} />
        </button>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-xl w-44 py-1 overflow-hidden">
              <button
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] font-semibold text-red-600 hover:bg-red-50 transition-all"
              >
                <Trash2 size={13} /> Xóa học sinh
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RowActions;
