import type { components } from "../v1";

export type StudentStatusEnum =
  | components["schemas"]["StudentResponseDto"]["status"]
  | "";

export const getStudentStatusEnum = (status: string) => {
  switch (status) {
    case "approved":
      return "Đậu";
    case "rejected":
      return "Rớt";
    case "pending":
      return "Chờ duyệt";
    case "dropped":
      return "Bỏ học";
    case "enrolled":
      return "Đợi đóng học phí";
    case "studying":
      return "Đang học";
    case "graduated":
      return "Đã tốt nghiệp";
    case "reviewing":
      return "Đang xem xét";
    case "suspended":
      return "Bị đình chỉ";
    case "expelled":
      return "Bị đuổi học";
    default:
      return "Không xác định";
  }
};
