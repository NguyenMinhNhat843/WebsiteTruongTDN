import {
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Globe,
  GraduationCap,
  Newspaper,
  School,
  UserPlus,
  XCircle,
} from "lucide-react";
import {
  EnumAudience,
  EnumCategoryPost,
  EnumExemptionStatus,
  EnumHeDaoTao,
  EnumTrangThaiHocPhi,
} from "../../type/enum";

export const StyleMapEnumAudience = {
  [EnumAudience.TOAN_TRUONG]: {
    label: "Toàn trường",
    // Gradient từ xanh dương nhạt sang xanh teal
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    border: "border-blue-200",
    textColor: "text-blue-700",
    iconColor: "text-blue-500",
    Icon: Globe,
  },
  [EnumAudience.HOC_SINH]: {
    label: "Học sinh",
    // Gradient từ xanh lá mạ sang emerald
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    textColor: "text-emerald-700",
    iconColor: "text-emerald-500",
    Icon: GraduationCap,
  },
  [EnumAudience.GIAO_VIEN]: {
    label: "Giáo viên",
    // Gradient từ vàng nắng sang cam nhạt
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    border: "border-amber-200",
    textColor: "text-amber-700",
    iconColor: "text-amber-500",
    Icon: School,
  },
};

export const StyleMapEnumCategory = {
  [EnumCategoryPost.THONG_BAO]: {
    label: "Thông báo",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    Icon: Bell,
  },
  [EnumCategoryPost.TUYEN_SINH]: {
    label: "Tuyển sinh",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    Icon: UserPlus,
  },
  [EnumCategoryPost.TUYEN_DUNG]: {
    label: "Tuyển dụng",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    Icon: Briefcase,
  },
  [EnumCategoryPost.SU_KIEN]: {
    label: "Sự kiện",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-800",
    Icon: Calendar,
  },
  [EnumCategoryPost.HOC_TAP]: {
    label: "Học tập",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-800",
    Icon: BookOpen,
  },
  [EnumCategoryPost.TIN_TUC]: {
    label: "Tin tức",
    bgColor: "bg-slate-100",
    textColor: "text-slate-800",
    Icon: Newspaper,
  },
};

export const StyleMapEnumTrangThaiHocPhi = {
  [EnumTrangThaiHocPhi.PAID]: {
    label: "Đã đóng",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    Icon: CheckCircle,
  },
  [EnumTrangThaiHocPhi.PARTIAL]: {
    label: "Đóng 1 phần",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    Icon: Clock,
  },
  [EnumTrangThaiHocPhi.UNPAID]: {
    label: "Chưa đóng",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    Icon: XCircle,
  },
};

export const StyleMapEnumHeDaoTao = {
  [EnumHeDaoTao.HE_9]: {
    label: "Hệ 9+",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-300",
    Icon: CheckCircle,
  },
  [EnumHeDaoTao.TRUNG_CAP_NGHE]: {
    label: "Trung cấp nghề",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-300",
    Icon: Clock,
  },
  [EnumHeDaoTao.SOCAPNGHE]: {
    label: "Sơ cấp nghề",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-800",
    borderColor: "border-emerald-300",
    Icon: XCircle,
  },
  [EnumHeDaoTao.DAI_HOC_LIEN_KET]: {
    label: "Đại học liên kết",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    borderColor: "border-orange-300",
    Icon: CheckCircle,
  },
  [EnumHeDaoTao.CAO_DANG]: {
    label: "Cao đẳng",
    bgColor: "bg-teal-100",
    textColor: "text-teal-800",
    borderColor: "border-teal-300",
    Icon: CheckCircle,
  },
};

export const StyleMapEnumExemptionStatus = {
  [EnumExemptionStatus.PENDING]: {
    label: "Đang chờ duyệt",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    Icon: Clock,
  },
  [EnumExemptionStatus.APPROVED]: {
    label: "Đã duyệt",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    Icon: CheckCircle,
  },
  [EnumExemptionStatus.REJECTED]: {
    label: "Bị từ chối",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    Icon: XCircle,
  },
};
