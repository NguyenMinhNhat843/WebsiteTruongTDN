import { useKhoaDaoTaoContext, type khoaDaoTaoDto } from "./KhoaHocProvider";
import { Trash2, Calendar, Fingerprint } from "lucide-react";

// Hàm helper để render Badge trạng thái tiếng Việt
const renderStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; class: string }> = {
    ACTIVE: {
      label: "Đang hoạt động",
      class: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    INACTIVE: {
      label: "Ngừng hoạt động",
      class: "bg-slate-100 text-slate-600 border-slate-200",
    },
    UPCOMING: {
      label: "Sắp diễn ra",
      class: "bg-amber-100 text-amber-700 border-amber-200",
    },
  };

  const config = statusConfig[status] || {
    label: status,
    class: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.class}`}
    >
      {config.label}
    </span>
  );
};

interface KhoaDaoTaoTableProps {
  data: khoaDaoTaoDto[];
}

const KhoaDaoTaoTable: React.FC<KhoaDaoTaoTableProps> = ({ data }) => {
  const { deleteBatch, setBatchSelected } = useKhoaDaoTaoContext();

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed min-w-[820px]">
          <colgroup>
            <col className="w-[160px]" />
            <col className="w-[260px]" />
            <col className="w-[180px]" />
            <col className="w-[180px]" />
            <col className="w-[180px]" />
            <col className="w-[80px]" />
          </colgroup>
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Mã khóa
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Tên khóa đào tạo
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Niên khóa
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Ngành học
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item) => (
              <tr
                key={item.id}
                className="group hover:bg-blue-50/30 transition-all duration-200"
              >
                <td className="px-6 py-4 text-sm leading-6">
                  <div className="flex items-center gap-2">
                    <Fingerprint size={14} className="text-gray-400 shrink-0" />
                    <span className="font-mono font-medium text-gray-700 truncate">
                      {item.batchCode}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm leading-6">
                  <span
                    className="font-semibold cursor-pointer text-blue-600 underline transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBatchSelected(item);
                    }}
                  >
                    {item.batchName}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm leading-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} className="shrink-0" />
                    <span>
                      {item.startYear} - {item.endYear}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm leading-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                    <span className="font-medium text-blue-600 truncate">
                      {item.major?.majorName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm leading-6">
                  {renderStatusBadge(item.status)}
                </td>
                <td className="px-6 py-4 text-sm leading-6">
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        deleteBatch(
                          { params: { path: { id: item.id } } },
                          {
                            onSuccess: () =>
                              alert("Xóa khóa đào tạo thành công"),
                          },
                        )
                      }
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Xóa khóa học"
                    >
                      <Trash2
                        size={18}
                        className="text-gray-400 group-hover:text-red-500"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <p>Hiển thị {data.length} khóa đào tạo</p>
        <p className="italic">* Dữ liệu cập nhật thời gian thực</p>
      </div>
    </div>
  );
};

export default KhoaDaoTaoTable;
