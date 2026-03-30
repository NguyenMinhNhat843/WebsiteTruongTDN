export const USER_ROLE = {
  ADMIN: "ADMIN", // Quản trị viên hệ thống
  TEACHER: "TEACHER", // Giáo viên
  STAFF: "STAFF", // Nhân viên (Kế toán/Hành chính)
  STUDENT: "STUDENT", // Học sinh
  PARENT: "PARENT", // Phụ huynh
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  avatarUrl?: string;
  status: "active" | "inactive" | "locked";
  createdAt: Date;
}
