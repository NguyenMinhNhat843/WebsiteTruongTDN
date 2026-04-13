import type { EnumHeDaoTao } from "../../type/enum";
import { StyleMapEnumHeDaoTao } from "../StyleMapEnum/StyleMapEnum";

interface HeDaoTaoBadgeProps {
  value: EnumHeDaoTao;
}
export const HeDaoTaoBadge: React.FC<HeDaoTaoBadgeProps> = ({ value }) => {
  const s = StyleMapEnumHeDaoTao[value];
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${s.bgColor} ${s.textColor} ${s.borderColor}`}
    >
      {s.label}
    </span>
  );
};
