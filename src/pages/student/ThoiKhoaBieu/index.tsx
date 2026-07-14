import { useState, useEffect, useMemo } from "react";
import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";
import moment from "moment";

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

// Inline SVG Icons tinh giản để loại bỏ Emoji Anti-pattern
const ChevronLeftIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5l7 7-7 7"
    />
  </svg>
);
const CalendarIcon = () => (
  <svg
    className="w-4 h-4 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
const MapPinIcon = () => (
  <svg
    className="w-3.5 h-3.5 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const AlertIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-amber-600 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);
const StarIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-amber-500"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const WeeklySchedule = () => {
  const { currentUser } = useAppContext();
  const studentId = currentUser?.profile?.id;

  const [selectedSemesterId, setSelectedSemesterId] = useState<number | "">("");
  const [weekNumber, setWeekNumber] = useState<number>(1);

  // 1. API: Lấy danh sách học kỳ
  const { data: semesters, isLoading: isLoadingSemesters } = $api.useQuery(
    "get",
    "/semesters",
    {
      params: {
        query: {
          ...(studentId ? { studentId: Number(studentId) } : {}),
        },
      },
    },
    { enabled: !!studentId },
  );

  useEffect(() => {
    if (semesters && semesters.length > 0) {
      const currentSemester = semesters.find((s: any) => s.isCurrent);
      if (currentSemester) {
        setSelectedSemesterId(currentSemester.id);
      } else {
        setSelectedSemesterId(semesters[0].id);
      }
    }
  }, [semesters]);

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

  // 3. API: Lấy thời khóa biểu tuần
  const {
    data: schedule,
    isLoading: isLoadingSchedule,
    error,
  } = $api.useQuery(
    "get",
    "/time-table/weekly",
    {
      params: {
        query: {
          weekNumber,
          ...(selectedSemesterId
            ? { semesterId: Number(selectedSemesterId) }
            : {}),
          ...(studentId ? { studentId: Number(studentId) } : {}),
        },
      },
    },
    { enabled: !!studentId && !!selectedSemesterId },
  );

  const getSchedulesForCell = (dayValue: string, shiftValue: string) => {
    if (!schedule) return [];
    return schedule.filter(
      (item: any) => item.dayOfWeek === dayValue && item.shift === shiftValue,
    );
  };

  if (error) {
    return (
      <div className="p-4 mx-6 my-6 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-center gap-3 shadow-sm text-sm">
        <AlertIcon />
        <p>Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen">
      {/* Bộ điều khiển Bộ lọc (Topbar UI nâng cấp thành dạng thanh sảnh Dashboard) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
        {/* Dropdown Chọn Học Kỳ */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            Học kỳ
          </label>
          <div className="relative w-full sm:w-64">
            <select
              value={selectedSemesterId}
              onChange={(e) => {
                setSelectedSemesterId(
                  e.target.value ? Number(e.target.value) : "",
                );
                setWeekNumber(1);
              }}
              disabled={isLoadingSemesters}
              className="w-full pl-3 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800 transition-all cursor-pointer appearance-none disabled:opacity-60"
            >
              {isLoadingSemesters ? (
                <option>Đang tải học kỳ...</option>
              ) : (
                semesters?.map((sem: any) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.name ||
                      `Học kỳ ${sem.term} (${sem.schoolYear || sem.year})`}
                    {sem.isCurrent ? " (Hiện tại)" : ""}
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
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
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setWeekNumber((prev) => Math.max(1, prev - 1))}
              className="p-1.5 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 rounded-lg transition shadow-sm border border-slate-200/60"
              disabled={weekNumber <= 1 || isLoadingSchedule}
              title="Tuần trước"
            >
              <ChevronLeftIcon />
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
              <ChevronRightIcon />
            </button>
          </div>

          {/* Phạm vi ngày */}
          {weekDatesInfo && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100/80 px-3 py-2 rounded-xl border border-slate-200/40">
              <CalendarIcon />
              <span>{weekDatesInfo.formattedRange}</span>
            </div>
          )}
        </div>
      </div>

      {/* Giao diện thời khóa biểu dạng bảng tuần Grid */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full table-fixed border-collapse min-w-[1000px]">
          {/* Tiêu đề các Thứ */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="w-[120px] p-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200/60">
                Ca học
              </th>
              {DAYS_OF_WEEK.map((day) => (
                <th
                  key={day.value}
                  className="p-3.5 text-center border-r border-slate-200/60 last:border-r-0"
                >
                  <div className="text-sm font-bold text-slate-800">
                    {day.label}
                  </div>
                  {weekDatesInfo && (
                    <div className="text-xs font-semibold text-slate-400 mt-0.5 px-2 py-0.5 bg-slate-100/50 inline-block rounded-md">
                      {weekDatesInfo.dateMap[day.value]}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Nội dung các ca học */}
          <tbody className="divide-y divide-slate-200">
            {SHIFTS.map((shift) => (
              <tr key={shift.value} className="group">
                {/* Cột hiển thị Ca (Sáng/Chiều/Tối) */}
                <td className="p-4 text-center bg-slate-50/60 group-hover:bg-slate-50 border-r border-slate-200/60 transition-colors align-middle">
                  <div className="font-bold text-slate-800 text-sm">
                    Ca {shift.label}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1.5 px-1.5 py-0.5 bg-slate-100 rounded-md inline-block whitespace-nowrap">
                    {shift.value === "S"
                      ? "07:30 - 11:30"
                      : shift.value === "C"
                        ? "13:30 - 17:30"
                        : "18:00 - 21:00"}
                  </div>
                </td>

                {/* Cột cho từng Thứ */}
                {DAYS_OF_WEEK.map((day) => {
                  const cellSchedules = getSchedulesForCell(
                    day.value,
                    shift.value,
                  );

                  return (
                    <td
                      key={`${day.value}-${shift.value}`}
                      className="p-3 border-r border-slate-200/60 last:border-r-0 align-top bg-white hover:bg-slate-50/40 transition-colors"
                    >
                      {isLoadingSchedule ? (
                        <div className="h-24 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : cellSchedules.length > 0 ? (
                        <div className="space-y-3">
                          {cellSchedules.map((item: any) => (
                            <div
                              key={item.scheduleId}
                              className={`p-3.5 rounded-xl border text-left transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                                item.isRoomOverridden
                                  ? "border-amber-200 bg-amber-50/40 hover:bg-amber-50/80"
                                  : "border-blue-100 bg-blue-50/30 hover:bg-blue-50/60"
                              }`}
                            >
                              {/* Cảnh báo đổi phòng học */}
                              {item.isRoomOverridden && (
                                <div className="text-[10px] font-bold text-amber-700 mb-2 flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-md w-max">
                                  <AlertIcon /> ĐỔI PHÒNG HỌC
                                </div>
                              )}

                              {/* Tên môn học */}
                              <div className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                {item.subjectName}
                              </div>

                              {/* Chi tiết thông tin */}
                              <div className="space-y-1 text-xs text-slate-600 font-medium">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">
                                    Mã môn:
                                  </span>
                                  <span className="text-slate-700 font-semibold">
                                    {item.subjectCode}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Lớp:</span>
                                  <span className="text-slate-700">
                                    {item.className}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Tiết:</span>
                                  <span className="text-slate-700">
                                    {item.startPeriod} - {item.endPeriod}{" "}
                                    <span className="text-slate-400 text-[10px]">
                                      ({item.countPeriod}t)
                                    </span>
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">
                                    Giảng viên:
                                  </span>
                                  <span
                                    className="text-slate-700 truncate max-w-[120px]"
                                    title={item.teacherName}
                                  >
                                    {item.teacherName}
                                  </span>
                                </div>

                                {/* Phòng học dạng Tag nổi bật */}
                                <div
                                  className={`mt-2.5 pt-2 border-t border-dashed flex items-center gap-1.5 font-bold ${
                                    item.isRoomOverridden
                                      ? "border-amber-200 text-amber-800"
                                      : "border-blue-100 text-blue-700"
                                  }`}
                                >
                                  <MapPinIcon />
                                  <span className="text-xs">
                                    Phòng: {item.roomCode}{" "}
                                    {item.building ? `(${item.building})` : ""}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Trường hợp không có lịch học: Thiết kế lại tinh gọn, thanh thoát hơn
                        <div className="h-full min-h-[90px] flex items-center justify-center text-slate-300 text-xs font-medium italic select-none">
                          Trống
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklySchedule;
