import React from "react";
import type { BatchStat } from "../type";

const BatchStatCard = ({ stat }: { stat: BatchStat }) => {
  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header: Batch Name & Total */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Đợt xét tuyển
          </span>
          <span className="text-base font-bold text-gray-800">
            {stat.batch}
          </span>
        </div>
        <div className="bg-cyan-50 px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-cyan-700">
            {stat.total} <span className="font-normal text-xs">HS</span>
          </span>
        </div>
      </div>

      {/* Stats Grid: Phân bổ 3 cột cho 3 trạng thái */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50">
        {/* Đạt */}
        <div className="flex flex-col items-center p-2 rounded-lg bg-green-50/50">
          <span className="text-[10px] font-medium text-green-600 uppercase">
            Đạt
          </span>
          <span className="text-sm font-bold text-green-700">
            {stat.approved}
          </span>
        </div>

        {/* Chờ xét */}
        <div className="flex flex-col items-center p-2 rounded-lg bg-yellow-50/50">
          <span className="text-[10px] font-medium text-yellow-600 uppercase">
            Chờ
          </span>
          <span className="text-sm font-bold text-yellow-700">
            {stat.pending}
          </span>
        </div>

        {/* Không đạt (Mới thêm) */}
        <div className="flex flex-col items-center p-2 rounded-lg bg-red-50/50">
          <span className="text-[10px] font-medium text-red-600 uppercase">
            Trượt
          </span>
          <span className="text-sm font-bold text-red-700">{0}</span>
        </div>
      </div>

      {/* Progress Bar (Optional): Hiển thị trực quan tỷ lệ đạt */}
      <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden flex">
        <div
          className="bg-green-500 h-full transition-all"
          style={{
            width: `${(stat.approved / stat.total) * 100}%`,
          }}
        />
        <div
          className="bg-yellow-400 h-full transition-all"
          style={{ width: `${(stat.pending / stat.total) * 100}%` }}
        />
        <div
          className="bg-red-400 h-full transition-all"
          style={{
            width: `${(0 / stat.total) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default BatchStatCard;
