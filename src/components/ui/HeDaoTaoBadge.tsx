import { HE_DAO_TAO_STYLES } from "../../pages/admin/HoSoHocSinh/mockStyleMapEnum";
import type { HeDaoTao } from "../../pages/admin/HoSoHocSinh/mockType";

interface HeDaoTaoBadgeProps {
  value: HeDaoTao;
}
export const HeDaoTaoBadge: React.FC<HeDaoTaoBadgeProps> = ({ value }) => {
  const s = HE_DAO_TAO_STYLES[value];
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${s.bg} ${s.text} ${s.border}`}
    >
      {value}
    </span>
  );
};
