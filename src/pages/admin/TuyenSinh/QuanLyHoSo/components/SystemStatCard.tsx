import { useQuanLyHoSoContext } from "../QuanLyHoSoProvider";
import type { SystemStat } from "../type";

const SystemStatCard = ({ stat }: { stat: SystemStat }) => {
  const { getSystemColor } = useQuanLyHoSoContext();
  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 group">
      {/* Header: System Name & Total */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Một dot màu nhỏ chỉ định hệ đào tạo */}
          <span
            className={`w-2 h-2 rounded-full ${getSystemColor(stat.system).replace("text-", "bg-")}`}
          />
          <span
            className={`text-sm font-bold tracking-tight ${getSystemColor(stat.system)}`}
          >
            {stat.system}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-gray-900 leading-none">
            {stat.count}
          </span>
          <span className="text-[10px] ml-1 font-semibold text-gray-400 uppercase tracking-wider">
            Hồ sơ
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-xs font-medium text-gray-500">
            Tỷ lệ xét tuyển đạt
          </span>
          <span className="text-xs font-bold text-green-600">
            {stat.count > 0
              ? Math.round((stat.approved / stat.count) * 100)
              : 0}
            %
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex shadow-inner">
          <div
            className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-500 ease-out relative"
            style={{
              width: `${stat.count > 0 ? (stat.approved / stat.count) * 100 : 0}%`,
            }}
          >
            {/* Hiệu ứng ánh sáng chạy dọc thanh bar */}
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {/* Icon giả lập người dùng hoặc avatar */}
            <div className="w-5 h-5 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
              <span className="text-[10px] text-green-700">✓</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-700">
            {stat.approved}{" "}
            <span className="text-gray-400 font-normal">đã trúng tuyển</span>
          </span>
        </div>

        {/* Nút xem chi tiết mờ hiện lên khi hover card */}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-cyan-600 uppercase tracking-tighter">
          Chi tiết →
        </button>
      </div>
    </div>
  );
};

export default SystemStatCard;
