import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { nganhHocResponse } from "./NganhProvider";
import { useMemo } from "react";

interface Props {
  data: nganhHocResponse[];
  columns?: ColumnDef<nganhHocResponse>[];
}

const NganhHocList = ({ data, columns }: Props) => {
  // 2. Định nghĩa Columns
  const columnsFinal = useMemo<ColumnDef<nganhHocResponse>[]>(
    () => [
      ...(columns || []),
      {
        header: "STT",
        accessorIdx: "id", // Tanstack v8 dùng id hoặc accessorKey
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Mã ngành",
        accessorKey: "majorCode",
        cell: (info) => (
          <span className="font-semibold text-blue-600">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        header: "Tên ngành",
        accessorKey: "majorName",
      },
      {
        header: "Mã khoa",
        accessorKey: "deptId",
        cell: (info) => (
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
            {info.getValue<number>()}
          </span>
        ),
      },
      {
        header: "Tên khoa",
        accessorKey: "department.deptName",
        cell: (info) =>
          info.getValue() || (
            <span className="text-gray-400 italic">Chưa cập nhật</span>
          ),
      },
      {
        header: "Mô tả",
        accessorKey: "description",
        cell: (info) => (
          <div className="max-w-50 truncate" title={info.getValue<string>()}>
            {info.getValue<string>() || "---"}
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns: columnsFinal,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider"
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
            <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 text-sm text-gray-600">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          Không có dữ liệu hiển thị
        </div>
      )}
    </div>
  );
};

export default NganhHocList;
