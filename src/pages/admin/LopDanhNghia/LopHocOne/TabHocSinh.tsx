import { useMemo } from "react";
import { useLopHocContext } from "../LopHocProvider";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

const TableDanhSachHocSinh = () => {
  const { studentsInLopHoc, isLoadingStudentsInLopHoc, isLoadingLopHocDetail } =
    useLopHocContext();

  // 2. Chuẩn hóa dữ liệu danh sách học sinh cho TanStack Table
  const dataDanhSachHocSinh = useMemo(() => {
    return (studentsInLopHoc || []).map((student, index) => ({
      stt: index + 1,
      id: student.id,
      tenHocSinh: student.fullName || "Chưa cập nhật",
      maSinhVien: student.studentCode || "N/A",
      dob: student.dob
        ? new Date(student.dob).toLocaleDateString("vi-VN")
        : "N/A",
    }));
  }, [studentsInLopHoc]);

  // 3. Định nghĩa các cột cho TanStack Table
  const columns = useMemo<ColumnDef<(typeof dataDanhSachHocSinh)[0]>[]>(
    () => [
      {
        header: "STT",
        accessorKey: "stt",
      },
      {
        header: "Mã Sinh Viên",
        accessorKey: "maSinhVien",
        cell: (info) => (
          <span className="font-semibold text-gray-700">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        header: "Họ và Tên",
        accessorKey: "tenHocSinh",
        cell: (info) => (
          <span className="font-medium text-gray-900">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        header: "Ngày sinh",
        accessorKey: "dob",
      },
    ],
    [],
  );

  // 4. Khởi tạo TanStack Table
  const table = useReactTable({
    data: dataDanhSachHocSinh,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Trạng thái Loading toàn trang
  if (isLoadingLopHocDetail || isLoadingStudentsInLopHoc) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span>Đang tải dữ liệu lớp học...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="font-bold text-gray-800 text-lg">Danh sách học sinh</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-gray-100 bg-gray-50/70"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500"
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
            {dataDanhSachHocSinh.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-600"
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
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-gray-400"
                >
                  Lớp học này chưa có học sinh nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDanhSachHocSinh;
