import { CheckCircle, Clock, FileCheck, XCircle } from "lucide-react";
import { StatCard } from "../../../../../components/ui/StatCard";
import { useQuanLyHoSoContext } from "../QuanLyHoSoProvider";

const OverviewStat = () => {
  const { stats } = useQuanLyHoSoContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {[
        {
          label: "Tổng hồ sơ",
          value: stats.totalApplications,
          icon: (
            <div className="p-3 bg-cyan-100 rounded-lg">
              <FileCheck className="w-6 h-6 text-cyan-600" />
            </div>
          ),
        },
        {
          label: "Đã nộp",
          value: stats.submittedCount,
          icon: (
            <div className="p-3 bg-white/20 rounded-lg">
              <FileCheck className="w-6 h-6" />
            </div>
          ),
          bgColor: "bg-linear-to-br from-blue-500 to-blue-600 text-white",
        },
        {
          label: "Đang xét",
          value: stats.reviewingCount,
          icon: (
            <div className="p-3 bg-white/20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          ),
          bgColor:
            "bg-linear-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white",
        },
        {
          label: "Đạt",
          value: stats.approvedCount,
          icon: (
            <div className="p-3 bg-white/20 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          ),
          bgColor:
            "bg-linear-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white",
        },
        {
          label: "Không đạt",
          value: stats.rejectedCount,
          icon: (
            <div className="p-3 bg-white/20 rounded-lg">
              <XCircle className="w-6 h-6" />
            </div>
          ),
          bgColor:
            "bg-linear-to-br from-red-500 to-rose-600 rounded-xl shadow-lg p-6 text-white",
        },
      ].map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          className={stat.bgColor || ""}
        />
      ))}
    </div>
  );
};

export default OverviewStat;
