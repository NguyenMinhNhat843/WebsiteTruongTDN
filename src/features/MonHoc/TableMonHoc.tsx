import type { ColumnDef } from "@tanstack/react-table";
import type { MonHocResponse } from "./MonHocProvider";
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const defaultColumns: ColumnDef<MonHocResponse>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Mã môn",
    accessorKey: "subjectCode",
    cell: (info) => (
      <span className="font-semibold text-gray-700">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    header: "Tên môn học",
    accessorKey: "subjectName",
  },
  {
    header: "Tín chỉ",
    accessorKey: "credits",
  },
  {
    header: "LT (Giờ)",
    accessorKey: "theoryHours",
  },
  {
    header: "TH (Giờ)",
    accessorKey: "practiceHours",
  },
  {
    header: "Bắt buộc",
    accessorKey: "isMandatory",
    cell: (info) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${info.getValue() ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
      >
        {info.getValue() ? "Bắt buộc" : "Tự chọn"}
      </span>
    ),
  },
];

interface Props {
  data: MonHocResponse[];
  columns?: ColumnDef<MonHocResponse>[];
}

const MonHocTable: React.FC<Props> = ({ data, columns = [] }) => {
  const table = useReactTable({
    data,
    columns: [...defaultColumns, ...columns],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-left border-collapse bg-white text-sm">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 font-bold text-gray-900 border-b border-gray-200"
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
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 text-gray-600">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonHocTable;
