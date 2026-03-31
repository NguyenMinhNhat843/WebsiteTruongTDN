import React from "react";

interface InfoRowProps {
  label: string;
  value: string | number | React.ReactNode;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex gap-3 px-3.5 py-2.25 border-b border-solid border-slate-100 last:border-b-0 transition-colors duration-150 hover:bg-slate-50">
      <span className="text-[12px] text-slate-500 w-30 shrink-0 font-medium">
        {label}
      </span>
      <span className="text-[13px] text-slate-700 font-semibold break-all flex-1">
        {value}
      </span>
    </div>
  );
}
