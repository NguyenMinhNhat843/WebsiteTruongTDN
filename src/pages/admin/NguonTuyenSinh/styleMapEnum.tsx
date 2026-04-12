import type { AdmissionStat } from "./type";

// --- Helper: Hệ đào tạo → label & badge màu ---
export const SYSTEM_LABELS: Record<
  AdmissionStat["byProgram"][0]["system"],
  { label: string; badgeClass: string }
> = {
  TCN: { label: "Trung cấp nghề", badgeClass: "bg-blue-100 text-blue-800" },
  SCN: { label: "Sơ cấp nghề", badgeClass: "bg-green-100 text-green-800" },
  "9+": { label: "Lớp 9+", badgeClass: "bg-amber-100 text-amber-800" },
  DH_LK: { label: "ĐH Liên kết", badgeClass: "bg-purple-100 text-purple-800" },
  KHAC: { label: "Khác", badgeClass: "bg-gray-100 text-gray-800" },
};
