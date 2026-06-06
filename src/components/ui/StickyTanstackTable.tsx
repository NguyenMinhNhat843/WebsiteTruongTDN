import { flexRender, type Table as TableType } from "@tanstack/react-table";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface StickyTanStackTableProps {
  table: TableType<any>;
  stickyColumnCount?: number; // Số lượng cột muốn sticky từ bên trái vào
}

export const StickyTanStackTable = ({
  table,
  stickyColumnCount = 2,
}: StickyTanStackTableProps) => {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar border border-gray-200 rounded-lg shadow-inner">
      <table
        className="border-collapse text-left table-fixed min-w-full"
        style={{ width: table.getTotalSize() }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="bg-gray-50 border-b border-gray-200"
            >
              {headerGroup.headers.map((header, index) => {
                const isSticky = index < stickyColumnCount;
                return (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: isSticky ? "sticky" : undefined,
                      left: isSticky ? header.column.getStart() : undefined,
                    }}
                    className={`px-3 py-2.5 font-bold border-r border-gray-200 uppercase tracking-wider text-xs text-center ${
                      isSticky ? "z-10 bg-gray-50" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50/70 transition-colors group"
            >
              {row.getVisibleCells().map((cell, cellIndex) => {
                const isWeekColumn = cell.column.id.startsWith("tuan_");
                const isSticky = cellIndex < stickyColumnCount;
                return (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                      position: isSticky ? "sticky" : undefined,
                      left: isSticky ? cell.column.getStart() : undefined,
                    }}
                    className={`px-3 py-2 border-r border-gray-100 text-[12px] ${
                      isWeekColumn ? "text-center whitespace-nowrap" : ""
                    } ${isSticky ? "z-10 bg-white group-hover:bg-gray-50" : ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
