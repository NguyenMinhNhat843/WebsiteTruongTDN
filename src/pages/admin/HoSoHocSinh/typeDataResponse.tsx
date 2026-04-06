export type EducationSystem = "9+" | "Cao đẳng" | "Liên kết Đại học";
export type StudentStatus = "Đang xử lý" | "Đã nhập học" | "Đã rút hồ sơ";

export interface Student {
  id: string;
  fullName: string;
  system: EducationSystem;
  major: string;
  phoneNumber: string;
  email: string;
  status: StudentStatus;
  address: string;
  createdAt: string;
}
