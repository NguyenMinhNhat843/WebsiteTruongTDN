import type { DayOfWeek } from "../TienDoDaoTaoProvider";

export const mapEnumDayOfWeek = (thu: string) => {
  switch (thu) {
    case "Hai":
      return "MONDAY";
    case "Ba":
      return "TUESDAY";
    case "Tư":
      return "WEDNESDAY";
    case "Năm":
      return "THURSDAY";
    case "Sáu":
      return "FRIDAY";
    case "Bảy":
      return "SATURDAY";
    case "Chủ nhật":
      return "SUNDAY";
    default:
      return null;
  }
};

export const convertEnumDayOfWeekToString = (
  dayOfWeek: DayOfWeek | undefined,
) => {
  switch (dayOfWeek) {
    case "MONDAY":
      return "Hai";
    case "TUESDAY":
      return "Ba";
    case "WEDNESDAY":
      return "Tư";
    case "THURSDAY":
      return "Năm";
    case "FRIDAY":
      return "Sáu";
    case "SATURDAY":
      return "Bảy";
    case "SUNDAY":
      return "Chủ nhật";
    default:
      return "";
  }
};
