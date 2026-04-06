import type {
  EduSystem,
  ModuleType,
  Status,
  UnitType,
} from "./chuongTrinhKhung.type";

export const EDU_SYSTEM_META: Record<
  EduSystem,
  {
    label: string;
    short: string;
    color: string;
    bg: string;
    border: string;
    accent: string;
  }
> = {
  cao_dang: {
    label: "Cao đẳng",
    short: "CĐ",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "#3b82f6",
  },
  trung_cap: {
    label: "Trung cấp",
    short: "TC",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "#10b981",
  },
  "9_cong_10": {
    label: "9+ (9 cộng 10)",
    short: "9+",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    accent: "#8b5cf6",
  },
  dai_hoc_lien_ket: {
    label: "Đại học liên kết",
    short: "ĐHLK",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    accent: "#f97316",
  },
  day_nghe_ngan_han: {
    label: "Dạy nghề ngắn hạn",
    short: "DNNH",
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
    accent: "#ec4899",
  },
  day_nghe_so_cap: {
    label: "Dạy nghề sơ cấp",
    short: "DNSC",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    accent: "#14b8a6",
  },
};

export const STATUS_META: Record<
  Status,
  { label: string; dot: string; text: string; bg: string }
> = {
  active: {
    label: "Đang áp dụng",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50 border border-emerald-200",
  },
  draft: {
    label: "Bản nháp",
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50 border border-amber-200",
  },
  archived: {
    label: "Lưu trữ",
    dot: "bg-slate-400",
    text: "text-slate-500",
    bg: "bg-slate-100 border border-slate-200",
  },
};

export const MODULE_TYPE_META: Record<
  ModuleType,
  { label: string; color: string; bar: string }
> = {
  chung: {
    label: "Môn chung",
    color: "bg-slate-100 text-slate-600",
    bar: "bg-slate-400",
  },
  co_so: {
    label: "Cơ sở nghề",
    color: "bg-blue-100 text-blue-700",
    bar: "bg-blue-500",
  },
  chuyen_mon: {
    label: "Chuyên môn",
    color: "bg-indigo-100 text-indigo-700",
    bar: "bg-indigo-600",
  },
  tu_chon: {
    label: "Tự chọn",
    color: "bg-violet-100 text-violet-700",
    bar: "bg-violet-500",
  },
  thuc_hanh: {
    label: "Thực hành",
    color: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
  },
  thuc_tap: {
    label: "Thực tập",
    color: "bg-orange-100 text-orange-700",
    bar: "bg-orange-500",
  },
};

export const UNIT_LABEL: Record<UnitType, string> = {
  tin_chi: "tín chỉ",
  don_vi_hoc_trinh: "ĐVHT",
  gio: "giờ",
};
