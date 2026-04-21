import { LayoutGrid, GraduationCap, ArrowRight } from "lucide-react";

interface KhoaCardProps {
  name: string;
  code: string;
  head: string;
  teachers: number;
  students: number;
  color: string;
  onClick?: () => void;
}

const KhoaCard = ({
  name,
  code,
  head,
  teachers,
  students,
  color,
  onClick,
}: KhoaCardProps) => {
  return (
    <div
      className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      {/* Icon & Code */}
      <div className="flex justify-between items-start mb-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <LayoutGrid size={24} />
        </div>
        <span className="text-[11px] font-bold px-3 py-1 bg-slate-50 text-slate-400 rounded-full tracking-wider uppercase">
          {code}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <GraduationCap size={14} className="text-slate-400" />
          <p className="text-[13px] text-slate-500 font-medium">
            Trưởng khoa: {head}
          </p>
        </div>
      </div>

      {/* Stats Divider */}
      <div className="my-5 border-t border-dashed border-slate-100" />

      {/* Footer Stats */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-slate-700">
              {teachers}
            </span>
            <span className="text-[11px] text-slate-400 font-medium uppercase">
              Giảng viên
            </span>
          </div>
          <div className="w-[1px] h-8 bg-slate-100" />
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-slate-700">
              {students}
            </span>
            <span className="text-[11px] text-slate-400 font-medium uppercase">
              Học sinh
            </span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default KhoaCard;
