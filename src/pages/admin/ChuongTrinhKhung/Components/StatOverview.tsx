import {
  CheckCircle2,
  FileEdit,
  GraduationCap,
  LayoutGrid,
} from "lucide-react";
import { StatCard } from "../../../../components/ui/StatCard";
import { useChuongTrinhKhungContext } from "../ChuongTrinhKhungProvider";

const StatOverview = () => {
  const { stats } = useChuongTrinhKhungContext();
  return (
    <div className="grid grid-cols-4 gap-3">
      {[
        {
          l: "Tổng chương trình",
          v: stats.total,
          className: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
          icon: LayoutGrid,
        },
        {
          l: "Đang áp dụng",
          v: stats.active,
          className:
            "bg-gradient-to-br from-emerald-400 to-teal-600 text-white",
          icon: CheckCircle2,
        },
        {
          l: "Bản nháp",
          v: stats.draft,
          className: "bg-gradient-to-br from-orange-400 to-rose-500 text-white",
          icon: FileEdit,
        },
        {
          l: "Số hệ đào tạo",
          v: stats.systems,
          className:
            "bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white",
          icon: GraduationCap,
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
