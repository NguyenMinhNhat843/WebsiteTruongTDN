import { CheckCircle, Clock, FileText } from "lucide-react";
import SectionCard from "../../../../../components/ui/SectionCard";
import type { HocSinh } from "../../mockType";

const TabHoSo = ({ hs }: { hs: HocSinh }) => (
  <div className="space-y-4">
    <SectionCard title={`Đã nộp (${hs.daNopHoSo.length})`}>
      <ul className="space-y-2">
        {hs.daNopHoSo.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100"
          >
            <CheckCircle size={15} className="text-emerald-500 shrink-0" />
            <span className="text-[13px] text-slate-700 font-medium flex-1">
              {item}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              ĐÃ NỘP
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>

    <SectionCard title={`Chưa nộp (${hs.chuaNopHoSo.length})`}>
      <ul className="space-y-2">
        {hs.chuaNopHoSo.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100"
          >
            <Clock size={15} className="text-red-400 shrink-0" />
            <span className="text-[13px] text-slate-700 font-medium flex-1">
              {item}
            </span>
            <span className="text-[10px] text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded-full">
              THIẾU
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>

    {hs.ghiChu && (
      <SectionCard title="Ghi chú">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <FileText size={15} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[13px] text-blue-800 leading-relaxed">
            {hs.ghiChu}
          </p>
        </div>
      </SectionCard>
    )}
  </div>
);

export default TabHoSo;
