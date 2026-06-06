import { Eye, Trash2 } from "lucide-react";
import ButtonAction from "../../../../../components/ui/ButtonAction";

interface RowActionsProps {
  onView: () => void;
  onDelete: () => void;
}

const RowActions: React.FC<RowActionsProps> = ({ onView, onDelete }) => {
  return (
    <div className="relative flex items-center gap-1 justify-end">
      <ButtonAction
        onClick={onView}
        title="Xem hồ sơ"
        icon={<Eye size={14} />}
        variant="outline"
      />
      <ButtonAction
        onClick={onDelete}
        title="Xóa"
        icon={<Trash2 size={14} />}
        variant="outline"
      />
    </div>
  );
};

export default RowActions;
