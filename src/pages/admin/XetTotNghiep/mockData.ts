import type { Student } from "./type";

export const INITIAL_MAJORS = [
  "Kỹ thuật máy tính",
  "Điện công nghiệp",
  "Sửa chữa ô tô",
  "Quản trị mạng",
  "Kế toán",
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: "SV001",
    name: "Nguyễn Văn A",
    system: "Trung cấp",
    major: "Kỹ thuật máy tính",
    gpa: 3.2,
    vocationalCert: true,
    status: "Đủ điều kiện",
  },
  {
    id: "SV002",
    name: "Trần Thị B",
    system: "9+",
    major: "Điện công nghiệp",
    gpa: 2.8,
    vocationalCert: true,
    status: "Đủ điều kiện",
  },
  {
    id: "SV003",
    name: "Lê Văn C",
    system: "Sơ cấp",
    major: "Sửa chữa ô tô",
    gpa: 2.4,
    vocationalCert: false,
    status: "Không đủ điều kiện",
  },
  {
    id: "SV004",
    name: "Phạm Minh D",
    system: "Đại học liên kết",
    major: "Quản trị mạng",
    gpa: 3.5,
    vocationalCert: true,
    status: "Đang xem xét",
  },
];
