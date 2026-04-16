import type React from "react";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  subValue?: string | number | null;
}

const InfoItem = ({ icon, label, value, subValue }: InfoItemProps) => {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 leading-tight">
          {value}
        </p>
        {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
      </div>
    </div>
  );
};

export default InfoItem;
