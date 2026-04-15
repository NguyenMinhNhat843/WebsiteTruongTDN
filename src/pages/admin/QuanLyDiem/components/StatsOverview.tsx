import { BookX, ClipboardCheck, GraduationCap, Users } from "lucide-react";
import { StatCard } from "../../../../components/ui/StatCard";

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        {
          label: "Tổng sinh viên",
          value: "1,240",
          Icon: Users,
          className: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
        },
        {
          label: "Sinh viên rớt môn",
          value: "45",
          Icon: BookX,
          className: "bg-gradient-to-br from-rose-500 to-orange-600 text-white",
        },
        {
          label: "Học lại (Nợ môn)",
          value: "12",
          Icon: GraduationCap,
          className:
            "bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white",
        },
        {
          label: "Thiếu đầu điểm",
          value: "08",
          Icon: ClipboardCheck,
          className:
            "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
        },
      ].map((item) => {
        const Icon = item.Icon;
        return (
          <StatCard
            label={item.label}
            value={item.value}
            icon={<Icon size={30} />}
            className={item.className}
          />
        );
      })}
    </div>
  );
};

export default StatsOverview;
