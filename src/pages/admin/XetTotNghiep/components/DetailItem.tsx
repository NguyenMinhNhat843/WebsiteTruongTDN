import type { FunctionComponent } from "react";

interface DetailItemProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number | null;
  bold?: boolean;
}

const DetailItem: FunctionComponent<DetailItemProps> = ({
  icon,
  label,
  value,
  bold = false,
}) => (
  <div>
    <p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5 tracking-tight">
      {label}
    </p>
    <div className="flex items-center gap-2">
      {icon && <span className="text-slate-400">{icon}</span>}
      <p
        className={`text-sm ${bold ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}
      >
        {value || "---"}
      </p>
    </div>
  </div>
);

export default DetailItem;
