import React from "react";
import { useKhoaDaoTaoContext, type khoaDaoTaoDto } from "./KhoaHocProvider";
import {
  Trash2,
  Calendar,
  Fingerprint,
  Sparkles,
  GraduationCap,
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.class}`}
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
    // Tích hợp xác nhận cơ bản trực tiếp ở UI để đảm bảo an toàn dữ liệu trước khi gọi API
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
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse table-fixed min-w-[850px]">
          <colgroup>
            <col className="w-[150px]" />
            <col className="w-[280px]" />
            <col className="w-[180px]" />
            <col className="w-[200px]" />
            <col className="w-[160px]" />
            <col className="w-[70px]" />
          </colgroup>
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100">
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Mã khóa
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Tên khóa đào tạo
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Niên khóa
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Ngành học
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Trạng thái
              </th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-slate-400"
                >
                  Không tìm thấy dữ liệu khóa đào tạo nào.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50/50 transition-colors duration-150"
                >
                  {/* Mã khóa */}
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700 transition-colors">
                        <Fingerprint size={13} className="shrink-0" />
                      </div>
                      <span className="font-mono font-medium text-slate-600">
                        {item.batchCode}
                      </span>
                    </div>
                  </td>

                  {/* Tên khóa đào tạo */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col max-w-full">
                      <span
                        className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors duration-150 truncate"
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
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      <span className="font-medium tracking-tight">
                        {item.startYear} — {item.endYear}
                      </span>
                    </div>
                  </td>

                  {/* Ngành học */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2 max-w-full">
                      <GraduationCap
                        size={15}
                        className="text-blue-500/80 shrink-0"
                      />
                      <span
                        className="font-medium text-slate-700 truncate"
                        title={item.major?.majorName}
                      >
                        {item.major?.majorName}
                      </span>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>

                  {/* Hành động */}
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all duration-150 active:scale-95 border border-transparent hover:border-red-100"
                        title="Xóa khóa học"
                      >
                        <Trash2 size={16} strokeWidth={2.2} />
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
      <div className="px-6 py-3.5 bg-slate-50/40 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-blue-500" />
          <span>Hiển thị {data.length} khóa đào tạo</span>
        </div>
        <p className="italic">Dữ liệu cập nhật thời gian thực</p>
      </div>
    </div>
  );
};

export default KhoaDaoTaoTable;
