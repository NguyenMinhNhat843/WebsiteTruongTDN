import RowActions from "./components/RowAction";
import { studentColumns } from "./ColumnTableHocSinh";
import { useHocSinhContext } from "../HocSinhProvider";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const TableHoSoHocSinh = () => {
  const { navigate, students, deleteStudent, isLoadingStudents } =
    useHocSinhContext();

  const table = useReactTable({
    data: students || [],
    columns: [
      {
        id: "stt",
        header: "STT",
        cell: ({ row }) => (
          <span className="font-medium text-slate-500">{row.index + 1}</span>
        ),
        size: 50,
      },
      ...studentColumns,
      {
        id: "actions",
        header: () => <span className="flex justify-end pr-2">Thao tác</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <RowActions
              onView={() => {
                navigate(`/admin/hoc-sinh/ho-so/${row.original.studentCode}`);
              }}
              onDelete={() => {
                deleteStudent(
                  {
                    params: {
                      path: {
                        id: row.original.id || -1,
                      },
                    },
                  },
                  {
                    onSuccess: () => {
                      alert("Xóa sinh viên thành công!");
                    },
                    onError: () => {
                      alert("❌ Xóa thất bại:");
                    },
                  },
                );
              }}
            />
          </div>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-slate-50/70 border-b border-slate-200"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider"
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
          <tbody className="divide-y divide-slate-100">
            {/* 1. TRẠNG THÁI ĐANG TẢI (SKELETON LOADING) */}
            {isLoadingStudents ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {table.getAllColumns().map((col, colIdx) => (
                    <td key={colIdx} className="px-5 py-4">
                      <div className="h-4 bg-slate-200/80 rounded-md w-full max-w-[120px]"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : /* 2. TRẠNG THÁI CÓ DỮ LIỆU */
            table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/40 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => {
                    // Logic xử lý hiển thị riêng cho cột classId (hoặc lớp học)
                    const isClassColumn = cell.column.id
                      .toLowerCase()
                      .includes("class");
                    const classValue = cell.getValue();

                    return (
                      <td
                        key={cell.id}
                        className="px-5 py-3.5 text-slate-700 alignment-middle"
                      >
                        {isClassColumn && !classValue ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200/60 shadow-sm select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Chưa phân lớp
                          </span>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              /* 3. TRẠNG THÁI TRỐNG (NO DATA) */
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="h-32 text-center text-slate-400 font-medium bg-slate-50/20"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-xl">📭</span>
                    <span>Không có dữ liệu sinh viên nào được tìm thấy.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableHoSoHocSinh;
