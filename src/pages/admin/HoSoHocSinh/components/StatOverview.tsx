import React from "react";
import { Users, BookOpen, GraduationCap, AlertCircle } from "lucide-react";
import { useHocSinhContext } from "../HocSinhProvider";

const StatOverview = () => {
  const { dataAnalyst } = useHocSinhContext();

  // Đảm bảo dữ liệu luôn có fallback an toàn nếu API chưa hoặc không trả về dữ liệu
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
      icon: Users,
      colorClass:
        "text-blue-600 bg-blue-50/80 border-blue-100/80 group-hover:bg-blue-600 group-hover:text-white",
      hoverClass: "hover:border-blue-200/80 hover:shadow-blue-50/50",
      gradient: "from-blue-50/20 to-transparent",
    },
    {
      label: "Đang học tập",
      value: stats.studying,
      icon: BookOpen,
      colorClass:
        "text-emerald-600 bg-emerald-50/80 border-emerald-100/80 group-hover:bg-emerald-600 group-hover:text-white",
      hoverClass: "hover:border-emerald-200/80 hover:shadow-emerald-50/50",
      gradient: "from-emerald-50/20 to-transparent",
      sub: `Chiếm ${stats.total ? Math.round((stats.studying / stats.total) * 100) : 0}% tổng số`,
    },
    {
      label: "Đã tốt nghiệp",
      value: stats.graduated,
      icon: GraduationCap,
      colorClass:
        "text-purple-600 bg-purple-50/80 border-purple-100/80 group-hover:bg-purple-600 group-hover:text-white",
      hoverClass: "hover:border-purple-200/80 hover:shadow-purple-50/50",
      gradient: "from-purple-50/20 to-transparent",
    },
    {
      label: "Biến động (Nghỉ/Đình chỉ)",
      value: stats.other,
      icon: AlertCircle,
      colorClass:
        "text-amber-600 bg-amber-50/80 border-amber-100/80 group-hover:bg-amber-600 group-hover:text-white",
      hoverClass: "hover:border-amber-200/80 hover:shadow-amber-50/50",
      gradient: "from-amber-50/20 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {cardData.map((s, index) => {
        const IconComponent = s.icon;

        return (
          <div
            key={index}
            className={`group relative flex flex-col justify-between p-6 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden ${s.hoverClass}`}
          >
            {/* Lớp phủ Gradient nền góc khuất tinh tế */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${s.gradient} pointer-events-none`}
            />

            {/* Khối nội dung chính phía trên */}
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex flex-col space-y-2">
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  {s.label}
                </span>
                <span className="text-3xl font-bold tracking-tight text-slate-900 transition-colors duration-200">
                  {s.value.toLocaleString("vi-VN")}
                </span>
              </div>

              {/* Vùng chứa Icon với hiệu ứng lật màu khi Hover vào thẻ cha */}
              <div
                className={`p-3 rounded-xl flex items-center justify-center border transition-all duration-300 transform group-hover:scale-110 shadow-xs ${s.colorClass}`}
              >
                <IconComponent size={22} strokeWidth={2} />
              </div>
            </div>

            {/* Khối chỉ số phụ phía dưới */}
            {s.sub ? (
              <div className="relative z-10 mt-5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
                {s.sub}
              </div>
            ) : (
              // Giữ khoảng cách đồng đều giữa các thẻ nếu không có chuỗi text phụ
              <div className="mt-5 pt-3 border-t border-transparent text-xs opacity-0 select-none">
                &nbsp;
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatOverview;
