import type { components } from "../v1";

// Enum cho trạng thái học sinh
export type StudentStatusEnum =
  components["schemas"]["StudentResponseDto"]["status"];
export const STUDENT_STATUS_MAP: Record<
  NonNullable<StudentStatusEnum>,
  string
> = {
  registered: "Đợi tư vấn",
  pending: "Chờ xét tuyển",
  failed: "Không đậu",
  approved: "Đã đậu / Chờ nhập học",
  studying: "Đã nhập học / Đang học",
  dropped: "Thôi học",
  graduated: "Đã tốt nghiệp",
};
export const STUDENT_STATUS_TABS = [
  { value: "" as StudentStatusEnum, label: "Tất cả" },
  ...Object.entries(STUDENT_STATUS_MAP).map(([value, label]) => ({
    value: value as StudentStatusEnum,
    label,
  })),
];

// Enum các ngày trong tuần
export type EnumDayOfWeek =
  components["schemas"]["ClassSubjectSessionDto"]["dayOfWeek"];

// Enum roles người dùng
export type EnumRoleUser = components["schemas"]["UserResponseDto"]["role"];
export const UserRoles: EnumRoleUser[] = [
  "admin",
  "teacher",
  "staff",
  "student",
];
export const UserRoleViMap: Record<EnumRoleUser, string> = {
  admin: "Quản trị viên",
  teacher: "Giáo viên",
  staff: "Nhân viên",
  student: "Học sinh",
};
