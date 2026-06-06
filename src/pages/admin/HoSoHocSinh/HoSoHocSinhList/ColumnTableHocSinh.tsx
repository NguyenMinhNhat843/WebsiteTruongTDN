import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "../../../../util/formatDate";
import type { HocSinhDto } from "../HocSinhProvider";
import { BadgeStudentStatus } from "../../../../components/enum/StudentStatusBadge";

export const studentColumns: ColumnDef<HocSinhDto>[] = [
  {
    accessorKey: "studentCode",
    header: "Mã SV",
    cell: ({ getValue, row }) => {
      const id = row.original.id;
      const code = getValue();

      return (
        <div className="flex flex-col gap-0.5 group">
          <span className="font-bold text-slate-800 tracking-tight">
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
      const student = row.original;
      const renderGender = (gender: boolean | null) => {
        if (typeof gender === "boolean") return gender ? "Nam" : "Nữ";
        return gender || "Chưa xác định";
      };

      return (
        <div className="flex items-center gap-2.5">
          <div>
            <div className="font-bold text-slate-800 text-[13px]">
              {(student.fullName as unknown as string) || "Chưa có tên"}
            </div>
            <div className="text-[11px] text-slate-400">
              {renderGender(student.gender || null)} ·{" "}
              {formatDate(String(student.dob))}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "class.classCode",
    header: "Lớp học",
  },
  {
    accessorKey: "batch.batchCode",
    header: "Khóa đào tạo",
  },
  {
    accessorKey: "batch.batchName",
    header: "Ngành nghề",
  },
  {
    accessorKey: "documentProgress",
    header: "Hồ sơ",
    cell: ({ row }) => {
      const progress = row.original.documentProgress;

      if (!progress) {
        return <span className="text-slate-400 text-xs">-</span>;
      }

      const isCompleted =
        progress.current === progress.total && progress.total > 0;

      return (
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center justify-center font-semibold text-xs px-2 py-0.5 rounded-full ${
              isCompleted
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                : "bg-amber-50 text-amber-600 border border-amber-200/50"
            }`}
          >
            {progress.current}/{progress.total}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      return <BadgeStudentStatus status={status} />;
    },
  },
];
