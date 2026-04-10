import type { FunctionComponent } from "react";

interface InfoItemProps {
  label: string;
  value: string | number | null;
  icon?: React.ReactNode;
  span2?: boolean;
}

const InfoItem: FunctionComponent<InfoItemProps> = ({
  label,
  value,
  icon,
  span2,
}) => (
  <div className={span2 ? "col-span-full" : ""}>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
      {icon} {label}
    </p>
    <p className="text-sm font-medium text-gray-800">{value || "---"}</p>
  </div>
);

export default InfoItem;
