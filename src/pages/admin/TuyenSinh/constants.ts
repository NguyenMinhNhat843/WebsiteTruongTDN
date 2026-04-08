import type { AdmissionMethod, AdmissionStatus, TrainingSystem } from "./type";

export const TRAINING_SYSTEM_LABELS: Record<TrainingSystem, string> = {
  trung_cap_nghe: "Trung cấp nghề",
  so_cap_nghe: "Sơ cấp nghề",
  cao_dang: "Cao đẳng",
  dai_hoc_lien_ket: "Đại học liên kết",
  dai_hoc: "Đại học",
  thac_si: "Thạc sĩ",
};

export const TRAINING_SYSTEM_COLORS: Record<TrainingSystem, string> = {
  trung_cap_nghe: "bg-orange-100 text-orange-800",
  so_cap_nghe: "bg-yellow-100 text-yellow-800",
  cao_dang: "bg-blue-100 text-blue-800",
  dai_hoc_lien_ket: "bg-purple-100 text-purple-800",
  dai_hoc: "bg-indigo-100 text-indigo-800",
  thac_si: "bg-teal-100 text-teal-800",
};

export const STATUS_LABELS: Record<AdmissionStatus, string> = {
  draft: "Nháp",
  open: "Đang mở",
  closed: "Đã đóng",
  cancelled: "Đã huỷ",
};

export const STATUS_COLORS: Record<AdmissionStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  open: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-500 line-through",
};

export const METHOD_LABELS: Record<AdmissionMethod, string> = {
  xet_tuyen: "Xét tuyển",
  thi_tuyen: "Thi tuyển",
  ket_hop: "Kết hợp",
};
