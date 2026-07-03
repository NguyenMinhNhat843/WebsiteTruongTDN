import type { components } from "../v1";

export type StudentStatusEnum =
  components["schemas"]["StudentResponseDto"]["status"];
export const STUDENT_STATUS_MAP: Record<StudentStatusEnum, string> = {
  pending: "Chờ xét tuyển",
  approved: "Đã đậu / Chờ nhập học",
  failed: "Không đậu",
  studying: "Đã nhập học / Đang học",
  suspended: "Bảo lưu",
  dropped: "Thôi học",
  expelled: "Buộc thôi học",
  graduated: "Đã tốt nghiệp",
};
export const STUDENT_STATUS_TABS = Object.entries(STUDENT_STATUS_MAP).map(
  ([value, label]) => ({
    value: value as StudentStatusEnum,
    label,
  }),
);

export type EnumDayOfWeek =
  components["schemas"]["ClassSubjectSessionDto"]["dayOfWeek"];
