import type { ReactNode } from "react";

interface InfoSectionProps {
  title: string;
  children: ReactNode;
}

export default function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <div className="mb-4">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.08em] mb-2 px-1">
        {title}
      </div>
      <div className="bg-slate-50/50 rounded-xl border border-solid border-slate-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
