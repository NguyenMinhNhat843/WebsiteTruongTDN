import { useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  useDotTuyenSinhContext,
  type DotTuyenSinhDto,
} from "./DotTuyenSinhProvider";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const AdmissionTable = ({ data }: { data: DotTuyenSinhDto[] }) => {
  const { deleteDotTuyenSinh, isDeletingDotTuyenSinh } =
    useDotTuyenSinhContext();
  const columns = useMemo<ColumnDef<DotTuyenSinhDto>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => (
          <span className="font-medium text-gray-700">
            #{info.getValue<number>()}
          </span>
        ),
      },
      {
        id: "heDaoTao",
        header: "Hệ đào tạo",
        cell: () => <span className="italic text-gray-400">Chưa xác định</span>,
      },
      {
        accessorKey: "name",
        header: "Tên đợt tuyển sinh",
      },
      {
        header: "Thời gian tuyển sinh",
        cell: ({ row }) => {
          const start = new Date(row.original.startDate).toLocaleDateString(
            "vi-VN",
          );
          const end = new Date(row.original.endDate).toLocaleDateString(
            "vi-VN",
          );
          return (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-blue-600">
                {start}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                đến {end}
              </span>
            </div>
          );
        },
      },
      {
        id: "totalQuota",
        header: "Tổng chỉ tiêu",
        accessorFn: (row) =>
          row.items?.reduce((acc, item) => acc + (item.quota || 0), 0) || 0,
        cell: (info) => (
          <div className="text-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {info.getValue<number>().toLocaleString()}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const styles = {
            OPEN: "bg-green-100 text-green-700 border-green-200",
            CLOSE: "bg-red-100 text-red-700 border-red-200",
            ARCHIVED: "bg-gray-100 text-gray-700 border-gray-200",
          };
          return (
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold border ${styles[status as keyof typeof styles]}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "__action",
        header: "",
        cell: (info) => {
          const id = info.row.original.id;
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteDotTuyenSinh(
                  { params: { path: { id } } },
                  {
                    onSuccess: () => {
                      alert("Xóa đợt tuyển sinh thành công!");
                    },
                  },
                );
              }}
              disabled={isDeletingDotTuyenSinh}
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
            </button>
          );
        },
      },
    ],
    [],
  );

  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-gray-200 bg-gray-50/50"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-blue-50/30 transition-colors duration-200"
                onClick={() => {
                  navigate(
                    `/admin/tuyen-sinh/dot-tuyen-sinh/${row.original.id}`,
                  );
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdmissionTable;
