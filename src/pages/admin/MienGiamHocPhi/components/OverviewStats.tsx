import { useExemtionContext } from "../ExemtionProvider";
import { Clock, FileText, TrendingDown } from "lucide-react";
import { formatCurrency } from "../../../../util/format";

const OverviewStats = () => {
  const { stats } = useExemtionContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        {
          label: "Tổng số đơn",
          val: stats.totalExemptions,
          unit: "đơn",
          Icon: FileText,
          css: "bg-white border-gray-200 text-gray-900",
          iconBg: "bg-purple-100 text-purple-600",
        },
        {
          label: "Tổng miễn giảm",
          val: formatCurrency(stats.totalAmount),
          unit: "đã miễn giảm",
          Icon: TrendingDown,
          css: "bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-lg",
          iconBg: "bg-white/20",
        },
        {
          label: "Chờ phê duyệt",
          val: stats.pendingCount,
          unit: "đơn",
          Icon: Clock,
          css: "bg-linear-to-br from-yellow-500 to-orange-600 text-white shadow-lg",
          iconBg: "bg-white/20",
        },
      ].map((item, i) => {
        return (
          <div key={i} className={`${item.css} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg ${item.iconBg}`}>
                <item.Icon className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{item.val}</div>
                <div className="text-xs opacity-70">{item.unit}</div>
              </div>
            </div>
            <div className="text-md font-semibold tracking-wide">
              {item.label}
            </div>
          </div>
        );
      })}

      {/* Card Trạng thái xử lý - Giữ riêng vì cấu trúc khác biệt hoàn toàn */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Trạng thái xử lý
        </div>
        <div className="space-y-2">
          {[
            {
              label: "Đã duyệt",
              val: stats.approvedCount,
              color: "text-green-600",
            },
            {
              label: "Chờ duyệt",
              val: stats.pendingCount,
              color: "text-yellow-600",
            },
            {
              label: "Từ chối",
              val: stats.rejectedCount,
              color: "text-red-600",
            },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{s.label}:</span>
              <span className={`font-semibold ${s.color}`}>{s.val} đơn</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewStats;
