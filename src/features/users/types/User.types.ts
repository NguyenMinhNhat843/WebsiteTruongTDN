// ==========================================
// ENUMS & CONSTANTS
// ==========================================

export const USER_ROLE = {
  ADMIN: "ADMIN", // Quản trị viên hệ thống
  TEACHER: "TEACHER", // Giáo viên
  STAFF: "STAFF", // Nhân viên
  STUDENT: "STUDENT", // Học sinh
  PARENT: "PARENT", // Phụ huynh
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// Phòng ban / bộ phận trong trường
export const DEPARTMENT = {
  MANAGEMENT: "Ban giám hiệu",
  ACADEMIC: "Phòng đào tạo",
  ACCOUNTING: "Phòng kế toán",
  ADMINISTRATION: "Phòng hành chính",
  STUDENT_AFFAIRS: "Phòng công tác HS",
  IT: "Phòng IT",
  MATH: "Tổ Toán",
  LITERATURE: "Tổ Văn",
  ENGLISH: "Tổ Tiếng Anh",
  SCIENCE: "Tổ KHTN",
  SOCIAL: "Tổ KHXH",
} as const;

export type Department = (typeof DEPARTMENT)[keyof typeof DEPARTMENT];
export type DepartmentKey = keyof typeof DEPARTMENT;

// Chức vụ — map rõ với từng role
export const STAFF_POSITION = {
  PRINCIPAL: "Hiệu trưởng",
  VICE_PRINCIPAL: "Phó hiệu trưởng",
  ACCOUNTANT: "Kế toán",
  CHIEF_ACCOUNTANT: "Kế toán trưởng",
  ADMIN_OFFICER: "Nhân viên hành chính",
  ADMIN_MANAGER: "Trưởng phòng hành chính",
  LIBRARIAN: "Thủ thư",
  IT_OFFICER: "Nhân viên IT",
  SECURITY: "Bảo vệ",
  TEACHER: "Giáo viên",
  HEAD_OF_DEPARTMENT: "Tổ trưởng",
  DEPUTY_HEAD_OF_DEPARTMENT: "Tổ phó",
  HOMEROOM_TEACHER: "GVCN",
} as const;

export type StaffPosition =
  (typeof STAFF_POSITION)[keyof typeof STAFF_POSITION];
export type StaffPositionKey = keyof typeof STAFF_POSITION;

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  LOCKED: "locked",
} as const;

export type UserStatus = (typeof STATUS)[keyof typeof STATUS];

// ==========================================
// CORE USER ENTITY
// ==========================================

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  avatarUrl?: string | null;
  status: "active" | "inactive" | "locked";
  createdAt: Date;
  updatedAt?: Date;
}

// ==========================================
// STAFF PROFILE (role: TEACHER | STAFF)
// ==========================================

export interface StaffProfile {
  id: number;
  userId: number; // FK → User
  staffCode: string; // Mã nhân viên, VD: "GV001"
  position: StaffPositionKey; // Chức vụ chính
  department: DepartmentKey; // Phòng/tổ bộ môn
  additionalPositions?: StaffPositionKey[]; // Chức vụ kiêm nhiệm (GV kiêm GVCN...)
  specialization?: string | null; // Chuyên môn, VD: "Toán - Lý"
  qualification?: string; // Bằng cấp, VD: "Thạc sĩ Toán"
  joinDate: Date; // Ngày vào trường
  contractType: "FULL_TIME" | "PART_TIME" | "CONTRACT"; // Loại hợp đồng
}

// ==========================================
// STUDENT PROFILE (role: STUDENT)
// ==========================================

export interface StudentProfile {
  id: number;
  userId: number; // FK → User
  studentCode?: string; // Mã học sinh, VD: "HS2024001"
  dateOfBirth?: Date;
  gender?: "MALE" | "FEMALE";
  address?: string;
  classId?: number; // FK → Class (lớp danh nghĩa)
  enrollmentYear?: number; // Năm nhập học
  status?: "STUDYING" | "GRADUATED" | "TRANSFERRED" | "DROPPED_OUT";
}

// ==========================================
// PARENT PROFILE (role: PARENT)
// ==========================================

export interface ParentProfile {
  id: number;
  userId: number; // FK → User
  occupation?: string; // Nghề nghiệp
  relationship: "FATHER" | "MOTHER" | "GUARDIAN"; // Quan hệ với học sinh
}

// Bảng liên kết nhiều-nhiều Parent ↔ Student
export interface ParentStudentLink {
  parentId: number; // FK → ParentProfile
  studentId: number; // FK → StudentProfile
  isPrimary: boolean; // Phụ huynh liên lạc chính
}

// ==========================================
// CLASS ENTITY
// ==========================================

export interface Class {
  id: number;
  name: string; // VD: "10A1", "11B2"
  grade: number; // Năm 1, năm 2, năm 3
  academicYear: string; // Năm học: "2024-2025"
  homeroomTeacherId?: number; // FK → StaffProfile (GVCN)
  capacity: number; // Sĩ số tối đa
}

// StudentProfiel types for API responses
export type StudentProfileResponse = Omit<StudentProfile, "userId" | "id"> & {
  classId: number;
  className: string;
};

// ParentProfile types for API responses
export type ParentProfileResponse = Omit<ParentProfile, "userId" | "id"> & {
  children: (StudentProfileResponse & {
    name: string;
  })[];
};

// User types for API responses
export type UserResponse = User & {
  staffProfile?: Omit<StaffProfile, "userId" | "id"> | null;
  studentProfile?: StudentProfileResponse;
  parentProfile?: ParentProfileResponse;
};
