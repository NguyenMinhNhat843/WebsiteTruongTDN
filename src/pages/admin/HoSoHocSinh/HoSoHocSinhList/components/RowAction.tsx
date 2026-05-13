import { Edit3, Eye, Trash2 } from "lucide-react";

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
      <button
        onClick={onDelete}
        title="Xóa"
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default RowActions;
