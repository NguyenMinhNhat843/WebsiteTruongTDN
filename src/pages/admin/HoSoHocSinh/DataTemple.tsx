import type { Student } from "./typeDataResponse";

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "SV001",
    fullName: "Nguyễn Văn An",
    system: "9+",
    major: "Công nghệ ô tô",
    phoneNumber: "0901234567",
    email: "an.nv@school.edu.vn",
    status: "Đang xử lý",
    address: "Quận 12, TP.HCM",
    createdAt: "2026-04-01",
  },
  {
    id: "SV002",
    fullName: "Trần Thị Bình",
    system: "Cao đẳng",
    major: "Thiết kế đồ họa",
    phoneNumber: "0907654321",
    email: "binh.tt@school.edu.vn",
    status: "Đã nhập học",
    address: "Hóc Môn, TP.HCM",
    createdAt: "2026-04-02",
  },
  {
    id: "SV003",
    fullName: "Lê Hoàng Việt",
    system: "Liên kết Đại học",
    major: "Quản trị kinh doanh",
    phoneNumber: "0988888888",
    email: "viet.lh@school.edu.vn",
    status: "Đã rút hồ sơ",
    address: "Dĩ An, Bình Dương",
    createdAt: "2026-04-05",
  },
];
