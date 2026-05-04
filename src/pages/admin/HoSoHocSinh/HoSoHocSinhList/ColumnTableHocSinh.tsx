import { type ColumnDef } from "@tanstack/react-table";
import type { Student } from "../../../../api/models/studentResponseDto";
import { getStudentStatusEnum } from "../../../../api/enum/studentStatusEnum";
import { formatDate } from "../../../../util/formatDate";

export const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "studentCode",
    header: "Mã SV",
    cell: ({ getValue }) => (
      <span className="font-bold">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Họ và tên",
    cell: ({ row }) => {
      // Lấy toàn bộ data của hàng hiện tại
      const student = row.original;

      // Hàm xử lý giới tính nhanh
      const renderGender = (gender: boolean | null) => {
        // Vì data của bạn đang bị Record<string, never>, hãy ép kiểu hoặc kiểm tra kỹ
        if (typeof gender === "boolean") return gender ? "Nam" : "Nữ";
        return gender || "Nưa xác định";
      };

      return (
        <div className="flex items-center gap-2.5">
          <div>
            <div className="font-bold text-slate-800 text-[13px]">
              {/* Ép kiểu string do lỗi Record<string, never> ở schema của bạn */}
              {(student.fullName as unknown as string) || "Chưa có tên"}
            </div>
            <div className="text-[11px] text-slate-400">
              {renderGender(student.gender)} · {formatDate(String(student.dob))}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Hệ đào tạo",
    accessorKey: "heDaoTao",
    cell: ({ row }) => {
      // Lấy giá trị từ dữ liệu, nếu không có thì để "Không xác định"
      const label = (row.getValue("heDaoTao") as string) || "Không xác định";

      return (
        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border border-gray-300 bg-gray-50 text-gray-600">
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "nganh",
    header: "Ngành",
    cell: () => {
      return "Không xác định";
    },
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ getValue }) => {
      const status = getValue<string>();
      // Ví dụ logic hiển thị màu sắc dựa trên status
      const statusMap: Record<string, string> = {
        active: "text-green-600",
        pending: "text-yellow-600",
        dropped: "text-red-600",
      };
      return (
        <span className={statusMap[status] || ""}>
          {getStudentStatusEnum(status)}
        </span>
      );
    },
  },
];
