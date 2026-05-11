import { CheckCircle2, FileEdit, LayoutGrid } from "lucide-react";
import { StatCard } from "../../../../components/ui/StatCard";

const StatOverview = () => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        {
          l: "Tổng chương trình",
          v: 1,
          className: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
          icon: LayoutGrid,
        },
        {
          l: "Đang áp dụng",
          v: 1,
          className:
            "bg-gradient-to-br from-emerald-400 to-teal-600 text-white",
          icon: CheckCircle2,
        },
        {
          l: "Bản nháp",
          v: 0,
          className: "bg-gradient-to-br from-orange-400 to-rose-500 text-white",
          icon: FileEdit,
        },
      ].map((s) => {
        const Icon = s.icon;
        return (
          <StatCard
            label={s.l}
            value={s.v}
            className={s.className}
            icon={
              <div className="p-3 rounded-lg bg-white/30">
                <Icon size={20} />
              </div>
            }
          />
        );
      })}
    </div>
  );
};

export default StatOverview;
