import { StatCard } from "../../../../components/ui/StatCard";
import { Activity, LayoutGrid, PieChart, Users } from "lucide-react";
import { useLopHocVaKhoaHocContext } from "../LopHocVaKhoaHocProvider";

const StatsOverview = () => {
  const { stats } = useLopHocVaKhoaHocContext();
  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {[
        {
          label: "Tổng lớp học",
          value: stats.total,
          description: (
            <span className="text-white/70">
              Tất cả <b className="text-white">12</b> hệ đào tạo
            </span>
          ),
          className: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
          icon: <LayoutGrid className="w-5 h-5 opacity-90" />,
        },
        {
          label: "Đang hoạt động",
          value: stats.active,
          description: (
            <span className="text-white/70">
              ↑ <b className="text-emerald-200">5</b> lớp so với HK1
            </span>
          ),
          className:
            "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
          icon: <Activity className="w-5 h-5 opacity-90" />,
        },
        {
          label: "Tổng học sinh/SV",
          value: stats.students,
          description: (
            <span className="text-white/70">Trong tất cả các lớp học</span>
          ),
          className:
            "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white",
          icon: <Users className="w-5 h-5 opacity-90" />,
        },
        {
          label: "Tỉ lệ lấp đầy",
          value: stats.fill,
          description: (
            <span className="text-white/70">
              Bình quân <b className="text-white">35</b> SV/lớp
            </span>
          ),
          className: "bg-gradient-to-br from-orange-400 to-rose-500 text-white",
          icon: <PieChart className="w-5 h-5 opacity-90" />,
        },
      ].map((stat, i) => (
        <StatCard
          key={i}
          label={stat.label}
          value={stat.value}
          description={stat.description} // Truyền trực tiếp ReactNode
          className={stat.className}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default StatsOverview;
