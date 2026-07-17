import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Loader2, Trash2, FileDown, Paperclip } from "lucide-react";
import ModalPhieuDiemRenLuyen from "./ModalPhieuDiemRenLuyen";
import { useLopHocOneContext } from "./LopHocOneProvider";
import { useAppContext } from "../../../../AppProvider";
import { $api } from "../../../../api/client";
import { toast } from "sonner";

// Hàm helper lấy từ cuối cùng để sắp xếp theo Tên (hỗ trợ tiếng Việt)
const getLastNameForSorting = (fullName: string): string => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1].toLowerCase();
};

const TableDanhSachHocSinh = () => {
  const { userRole } = useAppContext();

  const {
    selectedSemesterId,
    studentsInLopHoc,
    isLoadingStudentsInLopHoc,
    isLoadingLopHocDetail,
    exportStudentGrade,
    isExportingStudentGrade,
    refetchStudentsInLopHoc,
  } = useLopHocOneContext();

  const { mutate: removeStudentFromClass, isPending: isRemovingStudent } =
    $api.useMutation("patch", "/students/{id}");

  // Kick 1 học sinh ra khỏi lớp --> cập nhật classId thành null
  const handleKickStudent = (studentId: number) => {
    // Thêm xác nhận trước khi xóa để tránh người dùng bấm nhầm
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?",
    );
    if (!isConfirmed) return;

    removeStudentFromClass(
      {
        params: {
          path: {
            id: studentId,
          },
        },
        body: {
          classId: null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Học sinh đã được xóa khỏi lớp thành công!");
          refetchStudentsInLopHoc();
        },
        onError: () => {
          toast.error("Không thể xóa học sinh khỏi lớp. Vui lòng thử lại.");
        },
      },
    );
  };

  // State quản lý học sinh đang chọn để mở modal điểm rèn luyện
  const [selectedStudentForPoint, setSelectedStudentForPoint] = useState<{
    id: number;
    periodId: number;
  } | null>(null);

  const currentPeriodId = 1;

  // 1. Chuẩn hóa và SẮP XẾP danh sách học sinh theo Tên (từ cuối cùng)
  const dataDanhSachHocSinh = useMemo(() => {
    const rawStudents = studentsInLopHoc?.students || [];

    // Tạo bản sao và sort theo chữ cuối của tên
    const sortedStudents = [...rawStudents].sort((a, b) => {
      const nameA = getLastNameForSorting(a.fullName || "");
      const nameB = getLastNameForSorting(b.fullName || "");
      return nameA.localeCompare(nameB, "vi", { sensitivity: "base" });
    });

    return sortedStudents.map((student, index) => ({
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
            <div className="flex items-center gap-1.5">
              {/* Nút Xuất Bảng Điểm (Xanh lá nhẹ, tinh tế) */}
              <button
                type="button"
                title="Xuất bảng điểm Excel"
                disabled={isExportingStudentGrade}
                onClick={() =>
                  handleExportGrade(student.id!, student.tenHocSinh)
                }
                className="group cursor-pointer p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 disabled:opacity-50 transition-all duration-200"
              >
                {isExportingStudentGrade ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <FileDown className="h-4.5 w-4.5 group-hover:scale-105 transition-transform" />
                )}
              </button>

              {/* Nút Điểm rèn luyện (Xanh dương nhẹ, thanh lịch) */}
              <button
                type="button"
                title="Điểm rèn luyện"
                onClick={() =>
                  setSelectedStudentForPoint({
                    id: student.id!,
                    periodId: currentPeriodId,
                  })
                }
                className="group p-2 cursor-pointer rounded-lg text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-all duration-200"
              >
                <Paperclip className="h-4.5 w-4.5 group-hover:rotate-12 group-hover:scale-105 transition-transform" />
              </button>

              {/* Nút Xóa Học Sinh (Đỏ nhẹ - Chỉ hiện khi là admin) */}
              {userRole === "admin" && (
                <button
                  type="button"
                  title="Xóa học sinh khỏi lớp"
                  disabled={isRemovingStudent}
                  onClick={() => handleKickStudent(student.id!)}
                  className="group p-2 cursor-pointer rounded-lg text-rose-500 hover:bg-rose-50 active:bg-rose-100 disabled:opacity-50 transition-all duration-200"
                >
                  {isRemovingStudent ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-4.5 w-4.5 group-hover:scale-105 transition-transform" />
                  )}
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [isExportingStudentGrade, isRemovingStudent, currentPeriodId, userRole],
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
        />
      )}
    </div>
  );
};

export default TableDanhSachHocSinh;
