import type { AdmissionStat } from "./type";

// --- Mock Data ---
export const mockAdmissionStat: AdmissionStat = {
  total: 1247,
  bySource: [
    {
      id: "thpt",
      name: "Trường THPT",
      color: "bg-blue-500",
      count: 582,
      percentage: 46.67,
    },
    {
      id: "ttgdnn",
      name: "Trung tâm GDNN",
      color: "bg-indigo-500",
      count: 294,
      percentage: 23.58,
    },
    {
      id: "facebook",
      name: "Facebook/Zalo",
      color: "bg-green-500",
      count: 187,
      percentage: 15.0,
    },
    {
      id: "nguoithan",
      name: "Người thân/Giới thiệu",
      color: "bg-amber-500",
      count: 112,
      percentage: 8.98,
    },
    {
      id: "tructiep",
      name: "Tuyển sinh trực tiếp",
      color: "bg-purple-500",
      count: 72,
      percentage: 5.77,
    },
  ],
  byProgram: [
    { programName: "Điện công nghiệp", system: "TCN", count: 215 },
    { programName: "Cắt gọt kim loại", system: "TCN", count: 198 },
    { programName: "May công nghiệp", system: "TCN", count: 176 },
    { programName: "Sửa chữa xe máy", system: "SCN", count: 142 },
    { programName: "Lớp 9+ Điện tử", system: "9+", count: 137 },
    {
      programName: "Đại học liên kết Quản trị kinh doanh",
      system: "DH_LK",
      count: 112,
    },
    { programName: "Khác", system: "KHAC", count: 267 },
  ],
};
