import { useState, useEffect, useMemo } from "react";
import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";
import moment from "moment";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Star,
  ChevronDown,
  BookOpen,
  Loader2,
} from "lucide-react";
import PageShell from "../../../components/ui/PageShell";

// Cấu hình các Thứ trong tuần cần hiển thị
const DAYS_OF_WEEK = [
  { label: "Thứ 2", value: "MONDAY" },
  { label: "Thứ 3", value: "TUESDAY" },
  { label: "Thứ 4", value: "WEDNESDAY" },
  { label: "Thứ 5", value: "THURSDAY" },
  { label: "Thứ 6", value: "FRIDAY" },
  { label: "Thứ 7", value: "SATURDAY" },
];

// Cấu hình các Ca học
const SHIFTS = [
  { label: "Sáng", value: "S" },
  { label: "Chiều", value: "C" },
  { label: "Tối", value: "T" },
];

const StarIcon = () => <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />;
const MapPinIcon = () => <MapPin className="w-3.5 h-3.5 flex-shrink-0" />;

const TeacherThoiKhoaBieu = () => {
  const { profile, currentSemester } = useAppContext();
  const teacherId = profile?.id;

  const [selectedSemesterId, setSelectedSemesterId] = useState<number | "">("");
  const [weekNumber, setWeekNumber] = useState<number>(1);

  // 1. API: Lấy danh sách học kỳ
  const { data: semesters, isLoading: isLoadingSemesters } = $api.useQuery(
    "get",
    "/semesters",
  );

  // Chọn học kỳ hiện tại làm mặc định
  useEffect(() => {
    if (semesters && semesters.length > 0) {
      const current = semesters.find((s: any) => s.isCurrent) || semesters[0];
      setSelectedSemesterId(current.id);
    } else if (currentSemester?.id) {
      setSelectedSemesterId(currentSemester.id);
    }
  }, [semesters, currentSemester]);

  const activeSemester = useMemo(() => {
    return semesters?.find((s: any) => s.id === selectedSemesterId);
  }, [semesters, selectedSemesterId]);

  // 2. Tính toán ngày của tuần
  const weekDatesInfo = useMemo(() => {
    if (!activeSemester?.startDate) return null;

    const semesterStart = moment(activeSemester.startDate);
    const mondayOfWeek = semesterStart
      .clone()
      .add(weekNumber - 1, "weeks")
      .startOf("isoWeek");
    const sundayOfWeek = mondayOfWeek.clone().endOf("isoWeek");

    const dateMap: Record<string, string> = {};
    DAYS_OF_WEEK.forEach((day, index) => {
      const dateOfCurrentDay = mondayOfWeek.clone().add(index, "days");
      dateMap[day.value] = dateOfCurrentDay.format("DD/MM");
    });

    return {
      formattedRange: `${mondayOfWeek.format("DD/MM/YYYY")} - ${sundayOfWeek.format("DD/MM/YYYY")}`,
      dateMap,
    };
  }, [activeSemester, weekNumber]);

  // 3. API: Lấy lịch dạy theo tuần của giáo viên
  const {
    data: schedule,
    isLoading: isLoadingSchedule,
  } = $api.useQuery(
    "get",
    "/time-table/weekly",
    {
      params: {
        query: {
          weekNumber,
          ...(selectedSemesterId ? { semesterId: Number(selectedSemesterId) } : {}),
          teacherId: teacherId!,
        },
      },
    },
    { enabled: !!teacherId && !!selectedSemesterId },
  );

  const getSchedulesForCell = (dayValue: string, shiftValue: string) => {
    if (!schedule) return [];
    return (schedule as any[]).filter(
      (item: any) => item.dayOfWeek === dayValue && item.shift === shiftValue,
    );
  };

  const hasAnySchedule = useMemo(() => {
    return schedule && (schedule as any[]).length > 0;
  }, [schedule]);

  return (
    <PageShell
      title="Lịch giảng dạy"
      sub="Xem thời khóa biểu lịch dạy của bạn theo từng tuần trong học kỳ."
      icon={Calendar}
    >
      <div className="space-y-5">
        {/* ===== Thanh điều khiển: chọn HK + điều hướng tuần ===== */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {/* Chọn Học Kỳ */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              Học kỳ
            </label>
            <div className="relative w-full sm:w-64">
              <select
                value={selectedSemesterId}
                onChange={(e) => {
                  setSelectedSemesterId(e.target.value ? Number(e.target.value) : "");
                  setWeekNumber(1);
                }}
                disabled={isLoadingSemesters}
                className="w-full pl-3 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800 transition-all cursor-pointer appearance-none disabled:opacity-60"
              >
                {isLoadingSemesters ? (
                  <option>Đang tải học kỳ...</option>
                ) : (
                  semesters?.map((sem: any) => (
                    <option key={sem.id} value={sem.id}>
                      {sem.name || `Học kỳ ${sem.term} (${sem.schoolYear || sem.year})`}
                      {sem.isCurrent ? " (Hiện tại)" : ""}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {activeSemester?.isCurrent && (
              <span className="hidden lg:flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 font-bold px-2 py-1 rounded-md border border-amber-200">
                <StarIcon /> HỌC KỲ HIỆN TẠI
              </span>
            )}
          </div>

          {/* Thanh điều hướng tuần */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            {weekDatesInfo && (
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                📅 {weekDatesInfo.formattedRange}
              </span>
            )}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
              <button
                onClick={() => setWeekNumber((prev) => Math.max(1, prev - 1))}
                className="p-1.5 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 rounded-lg transition shadow-sm border border-slate-200/60"
                disabled={weekNumber <= 1 || isLoadingSchedule}
                title="Tuần trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold px-4 flex items-center text-slate-800 min-w-[80px] justify-center">
                Tuần {weekNumber}
              </span>
              <button
                onClick={() => setWeekNumber((prev) => prev + 1)}
                className="p-1.5 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 rounded-lg transition shadow-sm border border-slate-200/60"
                disabled={isLoadingSchedule}
                title="Tuần sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ===== Bảng TKB ===== */}
        {isLoadingSchedule ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Đang tải lịch giảng dạy...</p>
          </div>
        ) : !selectedSemesterId ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
            <Calendar className="w-12 h-12 text-slate-200" />
            <p className="text-sm font-medium">Vui lòng chọn học kỳ để xem lịch dạy</p>
          </div>
        ) : !hasAnySchedule ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
            <BookOpen className="w-12 h-12 text-slate-200" />
            <p className="text-sm font-medium">Không có lịch dạy trong tuần này</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    {/* Cột Ca học */}
                    <th className="w-24 px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left border-r border-slate-100">
                      Ca học
                    </th>
                    {/* Cột từng Thứ */}
                    {DAYS_OF_WEEK.map((day) => (
                      <th
                        key={day.value}
                        className="px-3 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 last:border-r-0"
                      >
                        <div className="font-bold text-slate-700">{day.label}</div>
                        {weekDatesInfo?.dateMap[day.value] && (
                          <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                            {weekDatesInfo.dateMap[day.value]}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SHIFTS.map((shift) => (
                    <tr key={shift.value} className="align-top hover:bg-slate-50/30 transition-colors">
                      {/* Label Ca */}
                      <td className="px-4 py-4 border-r border-slate-100">
                        <span className={`inline-flex items-center justify-center w-16 py-1 rounded-lg text-xs font-bold ${shift.value === "S"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : shift.value === "C"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-violet-50 text-violet-700 border border-violet-100"
                          }`}>
                          {shift.label}
                        </span>
                      </td>

                      {/* Cells - từng thứ */}
                      {DAYS_OF_WEEK.map((day) => {
                        const cellItems = getSchedulesForCell(day.value, shift.value);
                        return (
                          <td
                            key={day.value}
                            className="px-2 py-3 border-r border-slate-100 last:border-r-0 min-w-[140px]"
                          >
                            <div className="space-y-2">
                              {cellItems.map((item: any) => (
                                <div
                                  key={item.scheduleId}
                                  className="p-3 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50/60 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                >
                                  {/* Tên môn học */}
                                  <div className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-2">
                                    {item.subjectName}
                                  </div>

                                  {/* Tiết học */}
                                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1.5 font-medium">
                                    <span className="bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                                      Tiết {item.startPeriod} - {item.endPeriod}
                                    </span>
                                  </div>

                                  {/* Lớp học */}
                                  {item.className && (
                                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mb-1">
                                      <BookOpen className="w-3 h-3 flex-shrink-0" />
                                      <span>{item.className}</span>
                                    </div>
                                  )}

                                  {/* Phòng học */}
                                  <div className={`flex items-center gap-1 text-[11px] font-semibold mt-1.5 pt-1.5 border-t border-dashed border-blue-100 ${item.isRoomOverridden ? "text-amber-700" : "text-blue-700"}`}>
                                    <MapPinIcon />
                                    <span>{item.roomCode}</span>
                                    {item.building && (
                                      <span className="text-slate-400 font-normal">
                                        – {item.building}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default TeacherThoiKhoaBieu;
