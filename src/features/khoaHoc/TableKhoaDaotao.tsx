import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useKhoaDaoTaoContext, type khoaDaoTaoDto } from "./KhoaHocProvider";
import { useMemo } from "react";
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
  columns?: ColumnDef<khoaDaoTaoDto>[];
}

const KhoaDaoTaoTable: React.FC<KhoaDaoTaoTableProps> = ({
  data,
  columns: customColumns,
}) => {
  const { deleteBatch, setBatchSelected } = useKhoaDaoTaoContext();

  const defaultColumns = useMemo<ColumnDef<khoaDaoTaoDto>[]>(
    () => [
      {
        accessorKey: "batchCode",
        header: "Mã khóa",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Fingerprint size={14} className="text-gray-400" />
            <span className="font-mono font-medium text-gray-700">
              {info.getValue() as string}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "batchName",
        header: "Tên khóa đào tạo",
        cell: (info) => (
          <span
            className="font-semibold cursor-pointer text-blue-600 underline transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click lan ra hàng (nếu hàng cũng có sự kiện click)
              setBatchSelected(info.row.original);
            }}
          >
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorFn: (row) => `${row.startYear} - ${row.endYear}`,
        id: "period",
        header: "Niên khóa",
        cell: (info) => (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} />
            <span>{info.getValue() as string}</span>
          </div>
        ),
      },
      {
        accessorKey: "major.majorName",
        header: "Ngành học",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span className="font-medium text-blue-600">
              {info.getValue() as string}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "curriculumId",
        header: "Chương trình học",
        cell: (info) => (
          <span className="font-medium text-green-600">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: (info) => renderStatusBadge(info.getValue() as string),
      },
    ],
    [],
  ); // dependency array

  const tableColumns = customColumns || defaultColumns;

  const table = useReactTable({
    data,
    columns: [
      ...tableColumns,
      {
        accessorKey: "actions",
        header: "", // Bỏ tiêu đề cho cột hành động để thoáng hơn
        cell: (info) => (
          <div className="flex justify-end">
            <button
              onClick={() =>
                deleteBatch(
                  { params: { path: { id: info.row.original.id } } },
                  { onSuccess: () => alert("Xóa khóa đào tạo thành công") },
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
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-gray-50/50 border-b border-gray-100"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-50">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="group hover:bg-blue-50/30 transition-all duration-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm leading-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer thông tin thêm nếu cần */}
      <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <p>Hiển thị {data.length} khóa đào tạo</p>
        <p className="italic">* Dữ liệu cập nhật thời gian thực</p>
      </div>
    </div>
  );
};

export default KhoaDaoTaoTable;
