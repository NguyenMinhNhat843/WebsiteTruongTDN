import { TRANG_THAI_STYLES } from "../../pages/admin/HoSoHocSinh/mockStyleMapEnum";
import type { TrangThaiHocSinh } from "../../pages/admin/HoSoHocSinh/mockType";

interface TrangThaiBadgeProps {
  value: TrangThaiHocSinh;
}
export const TrangThaiBadge: React.FC<TrangThaiBadgeProps> = ({ value }) => {
  const s = TRANG_THAI_STYLES[value];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {value}
    </span>
  );
};
