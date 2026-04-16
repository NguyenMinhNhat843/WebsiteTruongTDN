import { FileWarning, GraduationCap, Users } from "lucide-react";
import { StatCard } from "../../../../components/ui/StatCard";
import { useHoSoHocSinhContext } from "../HoSoHocSinhProvider";

const StatOverview = () => {
  const { stats } = useHoSoHocSinhContext();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        {
          label: "Tổng học sinh",
          value: stats.total,
          icon: <Users size={24} className="text-white" />,
          className:
            "bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-200",
          accent: "text-blue-100",
        },
        {
          label: "Học sinh thiếu Hồ sơ",
          value: stats.hoSoThieu,
          icon: <FileWarning size={24} className="text-white" />,
          className:
            "bg-linear-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-200",
          accent: "text-orange-100",
        },
        {
          label: "Có học bổng",
          value: stats.hocBong,
          icon: <GraduationCap size={24} className="text-white" />,
          className:
            "bg-linear-to-br from-violet-600 to-purple-700 text-white shadow-lg shadow-purple-200",
          sub: (
            <span className="text-white">
              Đạt{" "}
              <span className="text-yellow-300 font-black text-lg">
                {Math.round((stats.hocBong / stats.total) * 100)}%
              </span>{" "}
              trên tổng số
            </span>
          ),
          accent: "text-purple-100",
        },
      ].map((s, index) => {
        return (
          <StatCard
            key={index}
            label={<span className="opacity-90 font-medium">{s.label}</span>}
            value={
              <span className="text-3xl font-bold tracking-tight">
                {s.value}
              </span>
            }
            icon={
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                {s.icon}
              </div>
            }
            description={<div className="mt-1 text-xs">{s.sub}</div>}
            className={`${s.className} rounded-2xl p-5 border-none transition-transform hover:scale-[1.02]`}
          />
        );
      })}
    </div>
  );
};

export default StatOverview;
