import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { cn } from "../../util/cn";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  noDataMessage?: string;
  className?: string; // Class cho container bao ngoài
  tableClassName?: string; // Class cho thẻ table
  rowClassName?: string; // Class cho thẻ tr (dòng)
  headerClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  noDataMessage = "Không có dữ liệu hiển thị.",
  className,
  tableClassName,
  rowClassName,
  headerClassName,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-gray-200",
        className,
      )}
    >
      <table
        className={cn(
          "min-w-full divide-y divide-gray-200 bg-white text-sm",
          tableClassName,
        )}
      >
        <thead className={cn("bg-blue-600", headerClassName)}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  // Thêm cn vào đây để headerClassName có thể ghi đè text-gray-900
                  className={cn(
                    "px-4 py-3 text-left font-bold text-gray-900", // Mặc định
                    headerClassName?.includes("text-") ? "" : "text-white", // Nếu ko truyền màu chữ thì mặc định trắng
                    headerClassName,
                  )}
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "hover:bg-gray-50 transition-colors",
                  rowClassName,
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="h-24 text-center text-gray-500"
              >
                {noDataMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
