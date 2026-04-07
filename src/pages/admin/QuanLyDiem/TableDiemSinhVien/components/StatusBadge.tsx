import type { TrangThai } from "../../type";
import { STATUS_STYLES } from "../StyleMapEnum";

interface StatusBadgeProps {
  status: TrangThai;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  text-[10px] font-bold uppercase tracking-wide border
                  ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
