import { type ColumnDef } from "@tanstack/react-table";
import { Mail, Phone, Calendar } from "lucide-react";
import type { HoSoTuyenSinhDto } from "./HoSoTuyenSInhProvider";

// Định nghĩa màu sắc cho từng trạng thái
const statusMap = {
  PENDING: {
    label: "Chờ duyệt",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  QUALIFIED: {
    label: "Đạt điều kiện",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  ADMITTED: {
    label: "Trúng tuyển",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  REJECTED: {
    label: "Từ chối",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  ENROLLED: {
    label: "Đã nhập học",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export const columns: ColumnDef<HoSoTuyenSinhDto>[] = [
  {
    header: "Ứng viên",
    accessorKey: "fullName",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-slate-900">
          {row.original.fullName}
        </span>
        <span className="text-xs text-slate-400">ID: #{row.original.id}</span>
      </div>
    ),
  },
  {
    header: "Thông tin liên hệ",
    id: "contact",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Mail size={14} /> {row.original.email}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone size={14} /> {row.original.phone}
        </div>
      </div>
    ),
  },
  {
    header: "Ngành ứng tuyển",
    accessorKey: "admissionItem.major.majorName",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-indigo-700">
          {row.original.admissionItem.major.majorName}
        </span>
        <span className="text-xs text-slate-500 italic">
          Chỉ tiêu: {row.original.admissionItem.quota}
        </span>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const status = getValue<HoSoTuyenSinhDto["status"]>();
      const config = statusMap[status] || statusMap.PENDING;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color} border`}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    header: "Ngày nộp",
    accessorKey: "createdAt",
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Calendar size={14} />
        {new Date(getValue<string>()).toLocaleDateString("vi-VN")}
      </div>
    ),
  },
];
