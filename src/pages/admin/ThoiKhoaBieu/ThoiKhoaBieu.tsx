import {
  Clock,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
  Sunrise,
  Sun,
  Moon,
} from "lucide-react";
import ButtonAction from "../../../components/ui/ButtonAction";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import DateInput from "../../../components/ui/Form/DateInput";
import type { ScheduleItemDto, SemesterDto } from "./ThoiKhoaBieuProvider";
import { useState } from "react";
import { getWeeksInRange } from "../TienDoGiangDay/tableTienDoDaoTao/helpers";

interface ThoiKhoaBieuTableProps {
  scheduleData?: ScheduleItemDto[];
  semester?: SemesterDto;
}

// Cấu hình cố định cho Thứ và Ca học
const daysOfWeek = [
  { key: "MONDAY", label: "Thứ Hai" },
  { key: "TUESDAY", label: "Thứ Ba" },
  { key: "WEDNESDAY", label: "Thứ Tư" },
  { key: "THURSDAY", label: "Thứ Năm" },
  { key: "FRIDAY", label: "Thứ Sáu" },
  { key: "SATURDAY", label: "Thứ Bảy" },
  { key: "SUNDAY", label: "Chủ Nhật" },
];

const shifts: Array<{
  key: string;
  label: string;
  sub: string;
  icon: LucideIcon;
  color: string;
}> = [
  {
    key: "SANG",
    label: "Ca Sáng",
    sub: "T1 - 5",
    icon: Sunrise,
    color: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    key: "CHIEU",
    label: "Ca Chiều",
    sub: "T1 - 5",
    icon: Sun,
    color: "bg-sky-50 text-sky-700 border-sky-100",
  },
  {
    key: "TOI",
    label: "Ca Tối",
    sub: "T1 - 5",
    icon: Moon,
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
];

export const ThoiKhoaBieuTable = ({
  scheduleData,
  semester,
}: ThoiKhoaBieuTableProps) => {
  const year = semester?.year;
  const startDate = semester ? new Date(semester.startDate) : null;
  const endDate = semester ? new Date(semester.endDate) : null;
  const weeks = getWeeksInRange(
    startDate ? new Date(startDate) : new Date(),
    endDate ? new Date(endDate) : new Date(),
  );
  const [currentWeek, setCurrentWeek] = useState<number>(1);

  // Tính toán chuỗi ngày hiển thị dựa vào tuần hiện tại
  const currentWeekData = weeks[currentWeek - 1];
  const dateValue = currentWeekData
    ? new Date(currentWeekData.start)
    : new Date();
  const month = String(
    dateValue.getDate() ? dateValue.getMonth() + 1 : 1,
  ).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  const fullDateString = year ? `${year}-${month}-${day}` : "";
  const weeksCount = weeks.length || 1;

  // Hàm điều hướng tuần
  const handlePrevWeek = () => {
    if (currentWeek > 1) setCurrentWeek((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    if (currentWeek < weeks.length) setCurrentWeek((prev) => prev + 1);
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ================= BANNER TUẦN ================= */}
      <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-600" />
          <span className="text-sm font-bold text-slate-700">
            Lịch học chi tiết:{" "}
            <span className="text-blue-600">Tuần {currentWeek}</span>
          </span>
        </div>
        <div className="w-full sm:w-auto sm:ml-auto flex gap-6 items-center">
          <DateInput value={fullDateString} />
          <div className="flex items-center gap-2">
            <ButtonAction
              icon={<ChevronLeft size={18} />}
              onClick={handlePrevWeek}
              disabled={currentWeek === 1}
            />
            <SelectOption
              options={Array.from({ length: weeksCount }).map((_, i) => ({
                value: i + 1,
                label: `Tuần ${i + 1}`,
              }))}
              containerClassName="w-32"
              value={currentWeek}
              onChange={(e) => setCurrentWeek(Number(e.target.value))}
            />
            <ButtonAction
              icon={<ChevronRight size={18} />}
              onClick={handleNextWeek}
              disabled={currentWeek === weeksCount}
            />
          </div>
        </div>
      </div>

      {/* ================= BẢNG THỜI KHÓA BIỂU ================= */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse table-fixed min-w-200">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="sticky left-0 z-20 w-20 min-w-20 p-3 text-xs font-bold uppercase tracking-wider text-slate-400 border-r border-slate-200 text-center bg-slate-50">
                Ca
              </th>
              {daysOfWeek.map((day) => (
                <th
                  key={day.key}
                  className="p-3 text-xs font-extrabold uppercase tracking-wider text-slate-700 border-r border-slate-200 text-center last:border-r-0"
                >
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {shifts.map((shift) => {
              const dbShiftMap: Record<string, string> = {
                SANG: "S",
                CHIEU: "C",
                TOI: "T",
              };
              return (
                <tr
                  key={shift.key}
                  className="hover:bg-slate-50/30 transition-colors group"
                >
                  {/* SỬA: Chuẩn hóa lại độ rộng cố định và tăng z-index để không bị đè */}
                  <td
                    className="p-2 border-r border-slate-200 font-medium align-middle 
              text-center bg-slate-50 sticky left-0 z-10 w-[80px] min-w-[80px]"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-xs font-bold text-slate-900 leading-tight break-words">
                        {shift.label}
                      </p>
                      {shift.sub && (
                        <p className="text-[10px] text-slate-500 font-medium leading-none break-words mt-0.5">
                          {shift.sub}
                        </p>
                      )}
                    </div>
                  </td>

                  {daysOfWeek.map((day) => {
                    const cellSchedule = scheduleData?.find(
                      (item) =>
                        item.weekNumber === currentWeek &&
                        item.dayOfWeek === day.key &&
                        item.shift === dbShiftMap[shift.key],
                    );

                    return (
                      <td
                        key={`${shift.key}-${day.key}`}
                        className="border-r p-1 border-slate-200 last:border-r-0 align-top min-h-[120px] transition-all group-hover:bg-slate-50/10"
                      >
                        {cellSchedule ? (
                          <div className="rounded-lg bg-slate-100 w-full p-2.5 flex flex-col gap-2 text-left group/card hover:border-slate-300 hover:shadow transition-all">
                            <p className="text-[13px] font-semibold text-slate-900 leading-snug break-words whitespace-normal">
                              {cellSchedule.classSubject?.subject
                                ?.subjectName ||
                                `Môn học # ${cellSchedule.classSubjectId}`}
                            </p>
                            <p className="text-[13px] font-semibold text-slate-900 leading-snug break-words whitespace-normal">
                              {cellSchedule.classSubject?.baseClass
                                ?.className ||
                                `Lớp # ${cellSchedule.classSubject?.baseClass?.className}`}
                            </p>
                            <div className="flex flex-col gap-1 text-[11px] text-slate-500 font-medium">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
                                  Tiết {cellSchedule.startPeriod} -{" "}
                                  {cellSchedule.endPeriod}
                                </span>
                                <span className="text-slate-400 whitespace-nowrap">
                                  ({cellSchedule.countPeriod} tiết)
                                </span>
                              </div>
                              <div className="flex items-start gap-1 mt-0.5">
                                <span className="text-slate-400 shrink-0">
                                  GV:
                                </span>
                                <span className="text-slate-700 font-semibold break-words whitespace-normal">
                                  {cellSchedule.classSubject?.teacher
                                    ?.fullName || "Chưa phân công"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 shrink-0">
                                  Phòng:
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold break-words whitespace-normal ${
                                    cellSchedule.roomId
                                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                                      : "text-slate-400 italic font-normal"
                                  }`}
                                >
                                  {cellSchedule.roomId || "Chưa có"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
