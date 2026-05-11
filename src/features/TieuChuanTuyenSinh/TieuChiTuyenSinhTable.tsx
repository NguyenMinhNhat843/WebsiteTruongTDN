import { type ColumnDef } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

type TieuChiTuyenSinh = {
  id: number;
  criterionName: string;
  type: "NUMBER" | "STRING" | "BOOLEAN";
  description?: Record<string, never> | null | undefined;
};

const columns: ColumnDef<TieuChiTuyenSinh>[] = [
  {
    accessorKey: "id",
    header: () => <span className="font-bold">ID</span>,
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorKey: "criterionName",
    header: "Tên tiêu chí",
    cell: (info) => (
      <span className="font-medium text-blue-600">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại dữ liệu",
    cell: (info) => {
      const type = info.getValue() as "NUMBER" | "STRING" | "BOOLEAN";
      const colors = {
        NUMBER: "bg-green-100 text-green-700 border-green-200",
        STRING: "bg-purple-100 text-purple-700 border-purple-200",
        BOOLEAN: "bg-orange-100 text-orange-700 border-orange-200",
      };

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold border ${colors[type]}`}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: () => (
      <span className="text-gray-500 text-sm italic">Không có mô tả</span>
    ),
  },
];

const TieuChiTable = ({
  data,
  columnAdd,
}: {
  data: TieuChiTuyenSinh[];
  columnAdd?: ColumnDef<TieuChiTuyenSinh>[];
}) => {
  const finalColumn = columnAdd ? [...columns, ...columnAdd] : columns;
  const table = useReactTable({
    data,
    columns: finalColumn,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider"
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
                className="hover:bg-blue-50/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 text-sm text-gray-700">
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

export default TieuChiTable;
