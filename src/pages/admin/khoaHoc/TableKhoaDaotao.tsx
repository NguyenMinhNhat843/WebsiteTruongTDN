import React from "react";
import { useKhoaDaoTaoContext, type khoaDaoTaoDto } from "./KhoaHocProvider";
import {
  Trash2,
  Calendar,
  Fingerprint,
  Sparkles,
  GraduationCap,
  Edit2,
  FolderOpen,
} from "lucide-react";

// Hàm helper để render Badge trạng thái tiếng Việt cao cấp
const renderStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    { label: string; class: string; dotClass: string }
  > = {
    ACTIVE: {
      label: "Đang hoạt động",
      class:
        "bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-[0_2px_6px_-1px_rgba(16,185,129,0.05)]",
      dotClass: "bg-emerald-500 animate-pulse",
    },
    INACTIVE: {
      label: "Ngừng hoạt động",
      class: "bg-slate-50 text-slate-600 border-slate-200/60",
      dotClass: "bg-slate-400",
    },
    UPCOMING: {
      label: "Sắp diễn ra",
      class:
        "bg-amber-50 text-amber-700 border-amber-200/60 shadow-[0_2px_6px_-1px_rgba(245,158,11,0.05)]",
      dotClass: "bg-amber-500",
    },
  };

  const config = statusConfig[status] || {
    label: status,
    class: "bg-gray-50 text-gray-600 border-gray-200/60",
    dotClass: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.class}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
};

interface KhoaDaoTaoTableProps {
  data: khoaDaoTaoDto[];
}

const KhoaDaoTaoTable: React.FC<KhoaDaoTaoTableProps> = ({ data }) => {
  const { deleteBatch, setBatchSelected } = useKhoaDaoTaoContext();

  const handleDelete = (item: khoaDaoTaoDto) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa khóa đào tạo "${item.batchName}" không?`,
      )
    ) {
      deleteBatch(
        { params: { path: { id: item.id } } },
        {
          onSuccess: () => alert("Xóa khóa đào tạo thành công"),
        },
      );
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
          <colgroup>
            <col className="w-[140px]" />
            <col className="w-[280px]" />
            <col className="w-[170px]" />
            <col className="w-[210px]" />
            <col className="w-[160px]" />
            <col className="w-[110px]" />
          </colgroup>
          <thead>
            <tr className="bg-slate-50/65 border-b border-slate-100">
              <th className="px-6 py-4.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Mã khóa
              </th>
              <th className="px-6 py-4.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Tên khóa đào tạo
              </th>
              <th className="px-6 py-4.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Niên khóa
              </th>
              <th className="px-6 py-4.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Ngành học
              </th>
              <th className="px-6 py-4.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Trạng thái
              </th>
              <th className="px-6 py-4.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-slate-50 rounded-full text-slate-400">
                      <FolderOpen size={36} className="stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700">
                        Trống trải quá!
                      </p>
                      <p className="text-xs text-slate-400 max-w-[280px] mx-auto">
                        Không tìm thấy dữ liệu khóa đào tạo nào trong hệ thống
                        hiện tại.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-indigo-50/20 transition-all duration-200"
                >
                  {/* Mã khóa */}
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600 border border-transparent group-hover:border-slate-100 transition-colors shadow-sm">
                        <Fingerprint size={14} className="shrink-0" />
                      </div>
                      <span className="font-mono font-bold text-slate-700 tracking-wide">
                        {item.batchCode}
                      </span>
                    </div>
                  </td>

                  {/* Tên khóa đào tạo */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col max-w-full">
                      <span
                        className="font-extrabold text-[15px] text-slate-800 group-hover:text-indigo-600 hover:underline decoration-indigo-500/30 cursor-pointer transition-all duration-150 truncate leading-snug"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBatchSelected(item);
                        }}
                        title={item.batchName}
                      >
                        {item.batchName}
                      </span>
                    </div>
                  </td>

                  {/* Niên khóa */}
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar size={15} className="text-slate-400 shrink-0" />
                      <span className="font-semibold tracking-tight text-[13.5px]">
                        {item.startYear} — {item.endYear}
                      </span>
                    </div>
                  </td>

                  {/* Ngành học */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2 max-w-full">
                      <GraduationCap
                        size={16}
                        className="text-indigo-500 shrink-0"
                      />
                      <span
                        className="font-semibold text-slate-700 truncate text-[13.5px]"
                        title={item.major?.majorName}
                      >
                        {item.major?.majorName || "Chưa phân ngành"}
                      </span>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>

                  {/* Hành động */}
                  <td className="px-6 py-3 text-sm whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                      {/* Nút Chỉnh sửa */}
                      <button
                        onClick={() => setBatchSelected(item)}
                        className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-100 hover:border-indigo-100 rounded-xl transition-all active:scale-95"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit2 size={14} strokeWidth={2.2} />
                      </button>

                      {/* Nút Xóa */}
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-100 rounded-xl transition-all active:scale-95"
                        title="Xóa khóa học"
                      >
                        <Trash2 size={14} strokeWidth={2.2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer chân trang của bảng */}
      <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-bold tracking-wide">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-indigo-500 animate-pulse" />
          <span>Tổng số: {data.length} khóa đào tạo</span>
        </div>
        <p className="italic font-normal">Dữ liệu cập nhật thời gian thực</p>
      </div>
    </div>
  );
};

export default KhoaDaoTaoTable;
