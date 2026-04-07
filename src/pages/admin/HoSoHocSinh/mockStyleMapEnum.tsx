import { CheckCircle2, Clock, UserCheck, UserX } from "lucide-react";
import type { HeDaoTao, TrangThaiHocSinh } from "./mockType";

export const HE_DAO_TAO_STYLES: Record<
  HeDaoTao,
  { bg: string; text: string; border: string }
> = {
  "Trung cấp nghề": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "Sơ cấp nghề": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  "Cao đẳng": {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  "Đại học liên kết": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
};

export const TRANG_THAI_STYLES: Record<
  TrangThaiHocSinh,
  { bg: string; text: string; dot: string; icon: React.ReactNode }
> = {
  "Đang học": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: <UserCheck size={11} />,
  },
  "Bảo lưu": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    icon: <Clock size={11} />,
  },
  "Thôi học": {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    icon: <UserX size={11} />,
  },
  "Tốt nghiệp": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    icon: <CheckCircle2 size={11} />,
  },
};

export const ALL_HE_DAO_TAO: HeDaoTao[] = [
  "Trung cấp nghề",
  "Sơ cấp nghề",
  "Cao đẳng",
  "Đại học liên kết",
];
export const ALL_TRANG_THAI: TrangThaiHocSinh[] = [
  "Đang học",
  "Bảo lưu",
  "Thôi học",
  "Tốt nghiệp",
];
