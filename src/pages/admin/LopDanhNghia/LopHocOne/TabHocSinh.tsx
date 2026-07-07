import { useMemo, useState } from "react";
import { useLopHocContext } from "../LopHocProvider";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Loader2, Trash2, FileDown, Paperclip } from "lucide-react";
import ButtonAction from "../../../../components/ui/ButtonAction";
import ModalPhieuDiemRenLuyen from "./ModalPhieuDiemRenLuyen";
import { useLopHocOneContext } from "./LopHocOneProvider";
import { useAppContext } from "../../../../AppProvider";

const TableDanhSachHocSinh = () => {
  const { userRole } = useAppContext();

  const {
    studentsInLopHoc,
    isLoadingStudentsInLopHoc,
    isLoadingLopHocDetail,
    exportStudentGrade,
    isExportingStudentGrade,
  } = useLopHocContext();

  const { selectedSemesterId } = useLopHocOneContext();

  // State quản lý học sinh đang chọn để mở modal điểm rèn luyện
  const [selectedStudentForPoint, setSelectedStudentForPoint] = useState<{
    id: number;
    periodId: number;
  } | null>(null);

  const currentPeriodId = 1;

  // 1. Chuẩn hóa dữ liệu danh sách học sinh
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
        params: { path: { id: studentId } },
      },
      {
        onSuccess: (blobData) => {
          const url = window.URL.createObjectURL(blobData as unknown as Blob);
          const link = document.createElement("a");
          link.href = url;
          const safeName = studentName.replace(/\s+/g, "_");
          link.setAttribute("download", `Bang_Diem_${safeName}.xlsx`);
          document.body.appendChild(link);
          link.click();
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

  // 2. Định nghĩa các cột cho TanStack Table
  const columns = useMemo<ColumnDef<(typeof dataDanhSachHocSinh)[0]>[]>(
    () => [
      { header: "STT", accessorKey: "stt" },
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
      { header: "Ngày sinh", accessorKey: "dob" },
      {
        id: "actions",
        header: "Hành động",
        cell: (info) => {
          const student = info.row.original;

          // Nếu là học sinh (student) -> Ẩn toàn bộ nút hành động
          if (userRole === "student") return null;

          return (
            <div className="flex items-center gap-2">
              {/* Nút Xuất Bảng Điểm (Hiện cho admin, teacher, staff) */}
              <ButtonAction
                title="Xuất bảng điểm Excel"
                variant="export"
                disabled={isExportingStudentGrade}
                onClick={() =>
                  handleExportGrade(student.id!, student.tenHocSinh)
                }
                icon={
                  isExportingStudentGrade ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4" />
                  )
                }
              />

              {/* Nút Xóa Học Sinh (Chỉ hiển thị khi là admin) */}
              {userRole === "admin" && (
                <ButtonAction
                  title="Xóa học sinh khỏi lớp học"
                  variant="danger"
                  icon={<Trash2 className="h-4 w-4" />}
                />
              )}

              {/* Nút Điểm rèn luyện (Hiện cho admin, teacher, staff) */}
              <ButtonAction
                title="Điểm rèn luyện"
                variant="primary"
                icon={<Paperclip className="h-4 w-4" />}
                onClick={() =>
                  setSelectedStudentForPoint({
                    id: student.id!,
                    periodId: currentPeriodId,
                  })
                }
              />
            </div>
          );
        },
      },
    ],
    [isExportingStudentGrade, currentPeriodId, userRole], // Thêm userRole vào dependency array
  );

  // 3. Khởi tạo TanStack Table
  const table = useReactTable({
    data: dataDanhSachHocSinh,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

      {selectedStudentForPoint && (
        <ModalPhieuDiemRenLuyen
          isOpen={!!selectedStudentForPoint}
          onClose={() => setSelectedStudentForPoint(null)}
          studentId={selectedStudentForPoint.id}
          semesterId={selectedSemesterId!}
          isTeacher={true}
        />
      )}
    </div>
  );
};

export default TableDanhSachHocSinh;
