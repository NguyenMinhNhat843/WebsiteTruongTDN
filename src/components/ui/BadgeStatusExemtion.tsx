import type { EnumExemptionStatus } from "../../type/enum";
import { StyleMapEnumExemptionStatus } from "../StyleMapEnum/StyleMapEnum";

interface BadgeStatusExemtionProps {
  status: EnumExemptionStatus;
}

const BadgeStatusExemtion = ({ status }: BadgeStatusExemtionProps) => {
  const { Icon, bgColor, label, textColor } =
    StyleMapEnumExemptionStatus[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

export default BadgeStatusExemtion;
