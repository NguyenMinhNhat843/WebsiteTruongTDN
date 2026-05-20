import { Users, BookOpen, GraduationCap, AlertCircle } from "lucide-react";
import { StatCard } from "../../../../components/ui/StatCard";
import { useHocSinhContext } from "../HocSinhProvider";

const StatOverview = () => {
  const { dataAnalyst } = useHocSinhContext();

  // Đảm bảo dữ liệu luôn có fallback an toàn nếu API chưa trả về
  const stats = {
    total: dataAnalyst?.total || 0,
    studying: dataAnalyst?.studying || 0,
    graduated: dataAnalyst?.graduated || 0,
    other:
      (dataAnalyst?.dropped || 0) +
      (dataAnalyst?.expelled || 0) +
      (dataAnalyst?.suspended || 0),
  };

  const cardData = [
    {
      label: "Tổng học sinh",
      value: stats.total,
      icon: <Users size={20} />,
      bgIcon: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      label: "Đang học tập",
      value: stats.studying,
      icon: <BookOpen size={20} />,
      bgIcon: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      sub: `Chiếm ${stats.total ? Math.round((stats.studying / stats.total) * 100) : 0}% tổng số`,
    },
    {
      label: "Đã tốt nghiệp",
      value: stats.graduated,
      icon: <GraduationCap size={20} />,
      bgIcon: "bg-purple-50 text-purple-600 border border-purple-100",
    },
    {
      label: "Biến động (Nghỉ/Đình chỉ)",
      value: stats.other,
      icon: <AlertCircle size={20} />,
      bgIcon: "bg-amber-50 text-amber-600 border border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map((s, index) => {
        return (
          <StatCard
            key={index}
            label={
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">
                {s.label}
              </span>
            }
            value={
              <span className="text-2xl font-bold tracking-tight text-slate-800">
                {s.value}
              </span>
            }
            icon={
              <div
                className={`p-2.5 rounded-xl flex items-center justify-center ${s.bgIcon}`}
              >
                {s.icon}
              </div>
            }
            description={
              s.sub ? (
                <div className="mt-1 text-xs text-slate-400 font-medium">
                  {s.sub}
                </div>
              ) : null
            }
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs transition-all hover:shadow-sm"
          />
        );
      })}
    </div>
  );
};

export default StatOverview;
