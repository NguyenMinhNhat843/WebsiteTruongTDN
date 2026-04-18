import {
  AlertCircle,
  CheckCircle,
  Clock,
  PieChart,
  ShieldCheck,
  User,
} from "lucide-react";
import { StatCard } from "../../../../components/ui/StatCard";
import { formatCurrency } from "../../../../util/format";
import { useThuHocPhiContext } from "../ThuHocPhiProvider";

const StatOVerview = () => {
  const { stats } = useThuHocPhiContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {[
        {
          label: "Tổng số học viên",
          value: stats.totalStudents,
          icon: (
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          ),
        },
        {
          label: "Đã thu",
          value: formatCurrency(stats.totalRevenue),
          icon: (
            <div className="p-3 bg-white/20 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          ),
          className: "bg-linear-to-br from-green-500 to-emerald-600 text-white",
        },
        {
          label: "Còn nợ",
          value: formatCurrency(stats.totalRemaining),
          icon: (
            <div className="p-3 bg-white/20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          ),
          className: "bg-linear-to-br from-orange-500 to-red-600 text-white",
        },
        {
          label: "Đã đóng đủ",
          value: `${stats.paidStudents} Sinh viên`,
          icon: (
            <div className="p-3 bg-white/20 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
          ),
          className: "bg-linear-to-br from-emerald-400 to-teal-500 text-white",
        },
        {
          label: "Đóng 1 phần",
          value: `${stats.partialStudents} Sinh viên`,
          icon: (
            <div className="p-3 bg-white/20 rounded-lg">
              <PieChart className="w-6 h-6" />
            </div>
          ),
          className: "bg-linear-to-br from-amber-400 to-orange-500 text-white",
        },
        {
          label: "Chưa đóng",
          value: `${stats.unpaidStudents} Sinh viên`,
          icon: (
            <div className="p-3 bg-white/20 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
          ),
          className: "bg-linear-to-br from-rose-500 to-red-700 text-white",
        },
      ].map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          className={stat.className}
        />
      ))}
    </div>
  );
};

export default StatOVerview;
