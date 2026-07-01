import React from "react";
import {
  UserCheck,
  BookOpen,
  UserMinus,
  XCircle,
  AlertOctagon,
  GraduationCap,
} from "lucide-react";
import type { StudentStatusEnum } from "../../api/enum";

interface BadgeStudentStatusProps {
  status: StudentStatusEnum;
  className?: string;
}

export const BadgeStudentStatus: React.FC<BadgeStudentStatusProps> = ({
  status,
  className = "",
}) => {
  // Cấu hình UI (Màu sắc, Icon, Chữ hiển thị) dựa theo từng trạng thái
  const statusConfig: Record<
    StudentStatusEnum,
    { label: string; classes: string; icon: React.ReactNode }
  > = {
    pending: {
      label: "Chờ duyệt",
      classes: "bg-yellow-50 text-yellow-700 border-yellow-200/60",
      icon: <UserCheck size={13} className="text-yellow-500" />,
    },
    approved: {
      label: "Chờ nhập học",
      classes:
        "bg-amber-50 text-amber-700 border-amber-200/60 bg-animate-pulse",
      icon: <UserCheck size={13} className="text-amber-500" />,
    },
    studying: {
      label: "Đang học",
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      icon: <BookOpen size={13} className="text-emerald-500" />,
    },
    suspended: {
      label: "Bảo lưu",
      classes: "bg-blue-50 text-blue-700 border-blue-200/60",
      icon: <UserMinus size={13} className="text-blue-500" />,
    },
    dropped: {
      label: "Thôi học",
      classes: "bg-slate-100 text-slate-600 border-slate-300",
      icon: <XCircle size={13} className="text-slate-400" />,
    },
    expelled: {
      label: "Buộc thôi học",
      classes: "bg-rose-50 text-rose-700 border-rose-200/60",
      icon: <AlertOctagon size={13} className="text-rose-500" />,
    },
    graduated: {
      label: "Đã tốt nghiệp",
      classes: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
      icon: <GraduationCap size={13} className="text-indigo-500" />,
    },
  };

  const currentStatus = statusConfig[status] || {
    label: status,
    classes: "bg-gray-100 text-gray-700 border-gray-300",
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm shadow-sm transition-all select-none ${currentStatus.classes} ${className}`}
    >
      {currentStatus.icon}
      {currentStatus.label}
    </span>
  );
};
