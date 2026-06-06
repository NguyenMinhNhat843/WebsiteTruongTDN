import type { DayOfWeek } from "../TienDoDaoTaoProvider";
import type { TienDoDaoTaoRow } from "./columnType";

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

// Hàm tách theo từng tuần dựa trên startDate và enđate của học kỳ
export const getWeeksInRange = (
  startDateSemester: Date,
  endDateSemester: Date,
) => {
  if (!startDateSemester || !endDateSemester) return [];
  const weeks = [];
  let currentStart = new Date(startDateSemester);
  const finalEnd = new Date(endDateSemester);

  if (currentStart > finalEnd) return [];

  let weekIndex = 1;
  while (currentStart <= finalEnd) {
    let currentEnd = new Date(currentStart);
    currentEnd.setDate(currentStart.getDate() + 6);

    if (currentEnd > finalEnd) {
      currentEnd = new Date(finalEnd);
    }

    weeks.push({
      weekNumber: `Tuần ${weekIndex}`,
      start: currentStart.toISOString(),
      end: currentEnd.toISOString(),
    });

    currentStart = new Date(currentEnd);
    currentStart.setDate(currentStart.getDate() + 1);
    weekIndex++;
  }
  return weeks;
};

export const calculateStudyDate = (
  startDateInWeek: Date | string,
  endDateInWeek: Date | string,
  dayOfWeek: DayOfWeek,
): string | null => {
  if (!startDateInWeek || !dayOfWeek) return null;

  // Định nghĩa số ngày chênh lệch cần cộng thêm so với ngày đầu tuần (Thứ Hai = 0)
  const dayOffsets: Record<DayOfWeek, number> = {
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THURSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6,
  };

  const offset = dayOffsets[dayOfWeek];
  if (offset === undefined) return null;

  const targetDate = new Date(startDateInWeek);

  targetDate.setDate(targetDate.getDate() + offset);

  const maxEnd = new Date(endDateInWeek);
  if (targetDate > maxEnd) {
    return maxEnd.toLocaleDateString("fr-CA"); // Trả về ngày max nếu có sai lệch logic chia tuần
  }

  return targetDate.toLocaleDateString("fr-CA");
};

// Tính tổng giờ của 1 buổi học của 1 môn
// Dùng trong TotalHoursCell.tsx
export const calculateRowTotal = (
  row: TienDoDaoTaoRow,
  weeksCount: number,
): number => {
  let total = 0;
  for (let idx = 0; idx < weeksCount; idx++) {
    const cellValue = row[`tuan_${idx + 1}`];
    if (cellValue && !isNaN(Number(cellValue))) {
      total += Number(cellValue);
    }
  }
  return total;
};

// TÍnh tổng giờ của cả môn học (cộng tất cả các buổi học) để so sánh với tongGioMonHoc
// Dùng trong TotalHoursCell.tsx
export const calculateSubjectTotal = (
  data: TienDoDaoTaoRow[],
  classSubjectId: number,
  weeksCount: number,
): number => {
  let total = 0;
  data.forEach((row) => {
    if (row.classSubjectId === classSubjectId) {
      total += calculateRowTotal(row, weeksCount);
    }
  });
  return total;
};
