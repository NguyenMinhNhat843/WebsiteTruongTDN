import { useMemo } from "react";
// Đổi lại hook useLopHocOneContext nếu provider của bạn export tên này
import { useLopHocContext } from "../LopHocProvider";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Loader2, Trash2, FileDown } from "lucide-react"; // Thêm icon FileDown
import ButtonAction from "../../../../components/ui/ButtonAction";

const TableDanhSachHocSinh = () => {
  // Lấy thêm hàm mutation và trạng thái loading từ Provider context xuống
  const {
    studentsInLopHoc,
    isLoadingStudentsInLopHoc,
    isLoadingLopHocDetail,
    exportStudentGrade,
    isExportingStudentGrade,
  } = useLopHocContext();

  // 1. Chuẩn hóa dữ liệu danh sách học sinh cho TanStack Table [cite: 14]
  const dataDanhSachHocSinh = useMemo(() => {
    return (studentsInLopHoc?.students || []).map((student, index) => ({
      stt: index + 1,
      id: student.id,
      tenHocSinh: student.fullName || "Chưa cập nhật",
      maSinhVien: student.studentCode || "N/A",
      dob: student.dob
        ? new Date(student.dob).toLocaleDateString("vi-VN")
        : "N/A",
    }));
  }, [studentsInLopHoc]);

  // Xuất điểm 1 học sinh
  const handleExportGrade = (studentId: number, studentName: string) => {
    exportStudentGrade(
      {
        parseAs: "blob",
        params: {
          path: { id: studentId },
        },
      },
      {
        onSuccess: (blobData) => {
          // Khởi tạo link ảo để trình duyệt trigger hành động tải file xuống máy
          const url = window.URL.createObjectURL(blobData as unknown as Blob);
          const link = document.createElement("a");
          link.href = url;

          // Định dạng tên file sạch khi lưu về máy học sinh
          const safeName = studentName.replace(/\s+/g, "_");
          link.setAttribute("download", `Bang_Diem_${safeName}.xlsx`);

          document.body.appendChild(link);
          link.click();

          // Thu dọn bộ nhớ sau khi hoàn tất tải file
          link.parentNode?.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        onError: (error) => {
          console.error("Lỗi khi xuất bảng điểm học sinh:", error);
          alert(
            "Không thể xuất tệp Excel bảng điểm. Vui lòng kiểm tra lại hệ thống.",
          );
        },
      },
    );
  };

  // 2. Định nghĩa các cột cho TanStack Table [cite: 26]
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
      {
        id: "actions",
        header: "Hành động",
        cell: (info) => {
          const student = info.row.original; // Lấy dữ liệu dòng hiện tại
          return (
            <div className="flex items-center gap-2">
              {/* Nút Xuất Bảng Điểm Mới Thêm Vào */}
              <ButtonAction
                title="Xuất bảng điểm Excel"
                variant="outline"
                disabled={isExportingStudentGrade}
                onClick={() =>
                  handleExportGrade(student!.id!, student.tenHocSinh)
                }
                icon={
                  isExportingStudentGrade ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <FileDown className="h-4 w-4 hover:text-blue-500" />
                  )
                }
              />

              {/* Nút Xóa Gốc Giữ Nguyên [cite: 60-65] */}
              <ButtonAction
                title="Xóa học sinh khỏi lớp học"
                variant="outline"
                icon={<Trash2 className="h-4 w-4 hover:text-red-500" />}
              />
            </div>
          );
        },
      },
    ],
    [isExportingStudentGrade], // Nạp loading state vào dependency để cập nhật trạng thái icon xoay
  );

  // 3. Khởi tạo TanStack Table [cite: 71]
  const table = useReactTable({
    data: dataDanhSachHocSinh,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Trạng thái Loading toàn trang [cite: 77]
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
        <h2 className="font-bold text-gray-800 text-lg">
          {" "}
          Danh sách học sinh{" "}
        </h2>
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
