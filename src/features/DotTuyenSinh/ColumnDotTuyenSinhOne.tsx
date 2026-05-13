import type { ColumnDef } from "@tanstack/react-table";
import type {
  ChiTietDotTuyenSinhDto,
  TieuChiTuyenSinhDto,
} from "./DotTuyenSinhProvider";
import { School, Users } from "lucide-react";

export const columns: ColumnDef<ChiTietDotTuyenSinhDto>[] = [
  {
    accessorKey: "batchName",
    header: "Tên khóa đào tạo",
    cell: (info) => (
      <span className="font-semibold text-gray-900">
        {String(info.getValue())}
      </span>
    ),
  },
  {
    header: "Mã đợt tuyển sinh",
    accessorKey: "id",
    cell: (info) => (
      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
        {/* Ép kiểu string nếu TS báo unknown */}
        {String(info.getValue())}
      </span>
    ),
  },
  {
    header: "Mã ngành",
    accessorKey: "major.majorCode",
    cell: (info) => (
      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
        {/* Ép kiểu string nếu TS báo unknown */}
        {String(info.getValue())}
      </span>
    ),
  },
  {
    header: "Ngành đào tạo",
    accessorKey: "major.majorName",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">
          {String(info.getValue())}
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <School size={12} />
          {info.row.original.major.department?.deptName || "Chưa phân khoa"}
        </span>
      </div>
    ),
  },
  {
    header: () => <div className="text-center">Chỉ tiêu</div>,
    accessorKey: "quota",
    cell: (info) => (
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold border border-emerald-200">
          <Users size={14} /> {String(info.getValue())}
        </span>
      </div>
    ),
  },
  {
    header: "Tiêu chí xét tuyển",
    accessorKey: "criteria",
    cell: (info) => {
      // Lấy dữ liệu và ép kiểu mảng để an toàn
      const criteria = info.getValue() as TieuChiTuyenSinhDto[];

      return (
        <div className="flex flex-wrap gap-2">
          {criteria && criteria.length > 0 ? (
            criteria.map((cri: TieuChiTuyenSinhDto) => (
              <div
                key={cri.criterionId}
                className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded shadow-sm hover:border-indigo-400 transition-all cursor-default"
              >
                <span className="text-xs font-medium text-slate-700">
                  {cri.criterion?.criterionName || "N/A"}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded font-mono uppercase">
                  {cri.criterion?.type || "N/A"}
                </span>
              </div>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">
              Không có tiêu chí
            </span>
          )}
        </div>
      );
    },
  },
];
