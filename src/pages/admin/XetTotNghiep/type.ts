export type EducationSystem =
  | "Trung cấp"
  | "Sơ cấp"
  | "9+"
  | "Đại học liên kết";

export type StudentStatus =
  | "Đủ điều kiện"
  | "Không đủ điều kiện"
  | "Đang xem xét";

export interface Student {
  id: string;
  name: string;
  system: EducationSystem;
  major: string;
  gpa: number;
  vocationalCert: boolean;
  status: StudentStatus;
}
