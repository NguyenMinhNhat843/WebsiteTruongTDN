import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "../../../../util/formatDate";
import type { HocSinhDto } from "../HocSinhProvider";
import { BadgeStudentStatus } from "../../../../components/enum/StudentStatusBadge";

export const studentColumns: ColumnDef<HocSinhDto>[] = [
  {
    accessorKey: "studentCode",
    header: "Mã SV",
    cell: ({ getValue, row }) => {
      const id = row.original.id; // Lấy ID từ dữ liệu dòng
      const code = getValue(); // Mã lớp (courseCode)

      return (
        <div className="flex flex-col gap-0.5 group">
          <span className="font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
            {String(code)}
          </span>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium uppercase text-slate-400 bg-slate-100 px-1 rounded">
              ID
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              #{id}
            </span>
          </div>
        </div>
      );
    },
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
        return gender || "Chưa xác định";
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
  // {
  //   header: "Hệ đào tạo",
  //   accessorKey: "heDaoTao",
  //   cell: ({ row }) => {
  //     // Lấy giá trị từ dữ liệu, nếu không có thì để "Không xác định"
  //     const label = (row.getValue("heDaoTao") as string) || "Không xác định";

  //     return (
  //       <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border border-gray-300 bg-gray-50 text-gray-600">
  //         {label}
  //       </span>
  //     );
  //   },
  // },
  {
    accessorKey: "classId",
  },
  {
    accessorKey: "batch.batchCode",
    header: "Khóa đào tạo",
  },
  {
    accessorKey: "batch.batchName",
    header: "Ngành nghề",
  },
  // {
  //   accessorKey: "phone",
  //   header: "Số điện thoại",
  // },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      return <BadgeStudentStatus status={status} />;
    },
  },
];
