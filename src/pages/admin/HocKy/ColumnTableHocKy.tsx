import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import type { HocKyDto } from "./HocKyProvider";

export const useHocKyColumns = () => {
  return useMemo<ColumnDef<HocKyDto>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Mã học kỳ",
      },
      {
        accessorKey: "name",
        header: "Tên học kỳ",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-bold text-gray-800">
              {info.getValue() as string}
            </span>
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
              {info.row.original.schoolYear}
            </span>
          </div>
        ),
      },
      {
        accessorFn: (row) => `${row.startDate} - ${row.endDate}`,
        id: "duration",
        header: "Thời gian",
        cell: (info) => (
          <div className="flex flex-col text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>
                {new Date(info.row.original.startDate).toLocaleDateString(
                  "vi-VN",
                )}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock size={14} className="text-gray-400" />
              <span>
                {new Date(info.row.original.endDate).toLocaleDateString(
                  "vi-VN",
                )}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "isCurrent",
        header: "Trạng thái",
        cell: (info) => {
          const isCurrent = info.getValue() as boolean;
          return isCurrent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
              <CheckCircle2 size={12} /> Hiện tại
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
              Lưu trữ
            </span>
          );
        },
      },
    ],
    [],
  );
};
