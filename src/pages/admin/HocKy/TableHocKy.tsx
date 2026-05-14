import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import type { HocKyDto } from "./HocKyProvider";
import { useHocKyColumns } from "./ColumnTableHocKy";

interface Props {
  hocKyList: HocKyDto[];
  isHocKyListPending: boolean;
  columnsAdditional?: ColumnDef<HocKyDto>[];
}

const HocKyTable = ({
  hocKyList,
  isHocKyListPending,
  columnsAdditional,
}: Props) => {
  const columns = useHocKyColumns();

  const table = useReactTable({
    data: hocKyList || [],
    columns: [...columns, ...(columnsAdditional || [])],
    getCoreRowModel: getCoreRowModel(),
  });

  if (isHocKyListPending) {
    return (
      <div className="w-full h-40 flex items-center justify-center bg-white rounded-xl border border-dashed border-gray-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-gray-50/50 border-b border-gray-200"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-indigo-50/30 transition-colors duration-150 group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (columnsAdditional?.length || 0)}
                  className="px-6 py-10 text-center text-gray-400 italic"
                >
                  Không có dữ liệu học kỳ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HocKyTable;
