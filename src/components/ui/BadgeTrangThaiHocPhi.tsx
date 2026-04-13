import clsx from "clsx";
import type { EnumTrangThaiHocPhi } from "../../type/enum";
import { StyleMapEnumTrangThaiHocPhi } from "../StyleMapEnum/StyleMapEnum";

interface BadgeTrangThaiHocPhiProps {
  status: EnumTrangThaiHocPhi;
  className?: string;
  classNameIcon?: string;
}

const BadgeTrangThaiHocPhi = ({
  status,
  className,
  classNameIcon,
}: BadgeTrangThaiHocPhiProps) => {
  const badge = StyleMapEnumTrangThaiHocPhi[status];
  const Icon = badge.Icon;

  return (
    <span
      className={clsx(
        `inline-flex items-center gap-1 px-1 py-1 rounded-full text-xs font-semibold ${badge.bgColor} ${badge.textColor}`,
        className,
      )}
    >
      <Icon className={clsx("w-4 h-4", classNameIcon)} />
      {badge.label}
    </span>
  );
};

export default BadgeTrangThaiHocPhi;
