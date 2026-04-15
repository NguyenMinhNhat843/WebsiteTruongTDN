import React from "react";
import { useTuyenSinhContext } from "../TuyenSinhProvider";
import { fillRate } from "../helpers";
import { StatCard } from "../../../../components/ui/StatCard";
import { FileCheck, Layers, Target, UserCheck } from "lucide-react";

const StatsOverview = () => {
  const { rounds } = useTuyenSinhContext();
  const totalQuota = rounds
    .filter((r) => r.status === "open")
    .reduce((s, r) => s + r.totalQuota, 0);
  const totalRegistered = rounds
    .filter((r) => r.status === "open")
    .reduce((s, r) => s + r.totalRegistered, 0);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        {
          label: "Tổng đợt chỉ tiêu",
          value: rounds.length,
          icon: Layers,
          className:
            "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
        },
        {
          label: "Chỉ tiêu đang mở",
          value: totalQuota.toLocaleString(),
          sub: (
            <span className="text-blue-50">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-cyan-200 font-bold">
                {fillRate(totalRegistered, totalQuota)}%
              </span>{" "}
              Tỉ lệ lấp đầy
            </span>
          ),
          icon: Target,
          className: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white",
        },
        {
          label: "Đã đăng ký",
          value: totalRegistered.toLocaleString(),
          sub: (
            <span className="text-blue-50">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-cyan-200 font-bold">
                {fillRate(totalRegistered, totalQuota)}%
              </span>{" "}
              Tỉ lệ lấp đầy
            </span>
          ),
          icon: UserCheck,
          className:
            "bg-gradient-to-br from-orange-400 to-amber-500 text-white",
        },
        {
          label: "Hồ sơ đã duyệt",
          value: 100,
          sub: (
            <span className="text-emerald-50">
              Hoàn thành{" "}
              <span className="text-yellow-300 font-extrabold underline decoration-2">
                75%
              </span>{" "}
              kế hoạch
            </span>
          ),
          icon: FileCheck,
          className:
            "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
        },
      ].map((stat) => {
        const Icon = stat.icon;
        return (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.sub}
            icon={<Icon size={26} />}
            className={stat.className}
          />
        );
      })}
    </div>
  );
};

export default StatsOverview;
