import type { TrangThai } from "../type";

export interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export const STATUS_STYLES: Record<TrangThai, StatusStyle> = {
  "Chờ duyệt": {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  "Đã duyệt": {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  "Cần chỉnh sửa": {
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  "Đã khóa": {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};
