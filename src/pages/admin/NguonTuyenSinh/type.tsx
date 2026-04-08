export interface RecruitmentSource {
  id: string;
  name: string; // Ví dụ: "THPT", "Trung tâm GDTX", "Facebook", "Người thân", "Tuyển sinh trực tiếp"
  color: string; // Tailwind class: bg-blue-500, bg-green-500, ...
  count: number;
  percentage: number;
}

export interface AdmissionStat {
  total: number;
  bySource: RecruitmentSource[];
  byProgram: {
    programName: string;
    system: "TCN" | "SCN" | "9+" | "DH_LK" | "KHAC"; // Trung cấp nghề, Sơ cấp nghề, Lớp 9+, Đại học liên kết, Khác
    count: number;
  }[];
}
