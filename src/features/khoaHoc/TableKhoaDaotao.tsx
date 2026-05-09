import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { khoaDaoTaoDto } from "./KhoaHocProvider";
import { useMemo } from "react";

const useKhoaDaoTaoColumns = (): ColumnDef<khoaDaoTaoDto>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "batchCode",
        header: "Mã khóa",
      },
      {
        accessorKey: "batchName",
        header: "Tên khóa đào tạo",
      },
      {
        accessorFn: (row) => `${row.startYear} - ${row.endYear}`,
        id: "period",
        header: "Thời gian",
      },
      {
        accessorKey: "major.majorName",
        header: "Ngành học",
        cell: (info) => (
          <span className="font-medium text-blue-600">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: (info) => (
          <span
            className={`badge ${info.getValue() === "Active" ? "bg-green-100" : "bg-gray-100"}`}
          >
            {info.getValue() as string}
          </span>
        ),
      },
    ],
    [],
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
  const defaultColumns = useKhoaDaoTaoColumns();

  // Ưu tiên sử dụng customColumns nếu có
  const tableColumns = customColumns || defaultColumns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50 text-left uppercase">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 font-semibold text-gray-700"
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
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-gray-600">
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

export default KhoaDaoTaoTable;
