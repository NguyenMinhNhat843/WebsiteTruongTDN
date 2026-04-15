import clsx from "clsx";
import type { ReactNode } from "react";

// Định nghĩa kiểu cho một cột
export interface Column<T> {
  key: string;
  label: string;
  className?: string;
  headerClassName?: string;
  // Hàm render tùy chỉnh nhận vào toàn bộ object của dòng
  render?: (item: T, index: number) => ReactNode;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T | ((item: T) => string | number);
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export default function ReusableTable<T>({
  data,
  columns,
  rowKey,
  onRowClick,
  emptyMessage = "Không có dữ liệu hiển thị",
  className,
}: ReusableTableProps<T>) {
  const getRowKey = (item: T) => {
    return typeof rowKey === "function"
      ? rowKey(item)
      : (item[rowKey] as unknown as string);
  };

  return (
    <div
      className={clsx(
        "bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-[11px] uppercase font-bold tracking-wider">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    "px-4 py-3.5 font-semibold text-xs tracking-wider",
                    col.headerClassName,
                    col.className,
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={getRowKey(item)}
                  onClick={() => onRowClick?.(item)}
                  className={clsx(
                    "transition-colors group",
                    onRowClick
                      ? "cursor-pointer hover:bg-slate-50"
                      : "hover:bg-slate-50/50",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx(
                        "px-4 py-3 text-sm text-slate-600",
                        col.className,
                      )}
                    >
                      {col.render
                        ? col.render(item, index)
                        : (item[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-400 italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
