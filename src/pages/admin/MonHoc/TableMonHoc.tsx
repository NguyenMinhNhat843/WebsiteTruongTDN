import type { ColumnDef } from "@tanstack/react-table";
import type { MonHocResponse } from "./MonHocProvider";
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { BookOpen, Hash, Layers, Clock } from "lucide-react";

const columnHelper = createColumnHelper<MonHocResponse>();

interface Props {
  data: MonHocResponse[];
  columns?: ColumnDef<MonHocResponse>[];
  isLoading?: boolean; // Thêm prop check loading danh sách
  deleteMonHoc?: (id: number) => Promise<void> | void; // Hàm xóa môn học
  isDeleting?: boolean; // Trạng thái đang xóa từ API (mutate)
  onClickRow?: (id: number) => void; // Hàm xử lý khi click vào dòng
}

const MonHocTable: React.FC<Props> = ({
  data,
  columns = [],
  isLoading = false,
  deleteMonHoc,
  isDeleting = false,
  onClickRow,
}) => {
  // Định nghĩa các cột mặc định - Chữ to rõ, UI hiện đại sạch sẽ
  const defaultColumns = React.useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <Hash size={15} /> ID
          </span>
        ),
        cell: (info) => (
          <span className="font-mono font-bold text-slate-400">
            #{info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("subjectCode", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <BookOpen size={15} /> Mã môn
          </span>
        ),
        cell: (info) => (
          <span className="font-mono font-bold text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100 text-sm">
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("subjectName", {
        header: () => (
          <span className="flex items-center gap-1.5">Tên môn học</span>
        ),
        cell: (info) => (
          <span
            className="font-black text-slate-800 tracking-tight text-base cursor-pointer hover:text-blue-600"
            onClick={() => onClickRow?.(info.row.original.id)}
          >
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("credits", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <Layers size={15} /> Tín chỉ
          </span>
        ),
        cell: (info) => (
          <span className="font-bold text-slate-700 text-base">
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("theoryHours", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <Clock size={15} /> LT (Giờ)
          </span>
        ),
        cell: (info) => (
          <span className="font-semibold text-slate-600">
            {info.getValue()} h
          </span>
        ),
      }),

      columnHelper.accessor("practiceHours", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <Clock size={15} /> TH (Giờ)
          </span>
        ),
        cell: (info) => (
          <span className="font-semibold text-slate-600">
            {info.getValue()} h
          </span>
        ),
      }),

      columnHelper.accessor("testHours", {
        header: () => (
          <span className="flex items-center gap-1.5">
            <Clock size={15} /> KT (Giờ)
          </span>
        ),
        cell: (info) => (
          <span className="font-semibold text-slate-600">
            {info.getValue()} h
          </span>
        ),
      }),
    ],
    [isDeleting, deleteMonHoc],
  );

  const table = useReactTable({
    data,
    columns: React.useMemo(
      () => [...defaultColumns, ...columns],
      [defaultColumns, columns],
    ),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white text-base">
          {/* Table Header với chữ in hoa, đậm cá tính */}
          <thead className="bg-slate-50/70 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4.5 font-bold text-slate-500 uppercase tracking-wider text-xs align-middle"
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

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Trạng thái xương cá (Skeleton Loading) khi danh sách đang tải
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-5">
                    <div className="h-4 bg-slate-100 rounded w-8" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-7 bg-slate-100 rounded w-20" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-5 bg-slate-100 rounded w-48" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-5 bg-slate-100 rounded w-10" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 bg-slate-100 rounded w-12" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 bg-slate-100 rounded w-12" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-6 bg-slate-100 rounded-full w-20" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-9 bg-slate-100 rounded-xl w-20 ml-auto" />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4.5 text-slate-600 align-middle"
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
              // Trạng thái rỗng (Empty State)
              <tr>
                <td
                  colSpan={defaultColumns.length + columns.length}
                  className="px-6 py-14 text-center text-slate-400 italic bg-white"
                >
                  Không tìm thấy dữ liệu môn học nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonHocTable;
