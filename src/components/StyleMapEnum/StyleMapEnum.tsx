import { CheckCircle, Clock, XCircle } from "lucide-react";
import {
  EnumExemptionStatus,
  EnumHeDaoTao,
  EnumTrangThaiHocPhi,
} from "../../type/enum";

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
