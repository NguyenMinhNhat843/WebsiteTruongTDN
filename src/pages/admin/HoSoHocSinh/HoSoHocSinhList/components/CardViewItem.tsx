import { BookOpen, Edit3, Eye, GraduationCap } from "lucide-react";
import { TrangThaiBadge } from "../../../../../components/ui/BadgeStatus";
import { HeDaoTaoBadge } from "../../../../../components/ui/HeDaoTaoBadge";
import { avatarColor, getAvatar } from "../../helpers";
import type { HocSinhRow } from "../../mockType";
import HoSoProgress from "./HoSoProgress";

interface StudentCardProps {
  row: HocSinhRow;
}
const StudentCard: React.FC<StudentCardProps> = ({ row }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all overflow-hidden group">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-xl bg-linear-to-br ${avatarColor(row.id)} flex items-center justify-center text-white font-black text-[16px] shrink-0`}
          >
            {getAvatar(row.hoTen)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-800 text-[14px] truncate">
              {row.hoTen}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {row.maSoHocSinh}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <HeDaoTaoBadge value={row.heDaoTao} />
              <TrangThaiBadge value={row.trangThai} />
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
          <div className="flex items-center gap-1.5 text-slate-500">
            <BookOpen size={11} className="shrink-0 text-slate-400" />
            <span className="truncate">{row.nganh}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <GraduationCap size={11} className="shrink-0 text-slate-400" />
            <span className="truncate">{row.lop}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 col-span-2">
            <span className="text-slate-400 font-semibold">Hồ sơ:</span>
            <HoSoProgress nop={row.soGiayToNop} chuaNop={row.soGiayToChuaNop} />
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span
            className={`text-[13px] font-black ${row.diemTB >= 8 ? "text-emerald-600" : row.diemTB >= 6.5 ? "text-blue-600" : "text-amber-600"}`}
          >
            {row.diemTB.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-400">ĐTB</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
            <Eye size={13} />
          </button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all">
            <Edit3 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
