import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sun,
  Sunrise,
  Moon,
} from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import {
  ThoiKhoaBieuProvider,
  useThoiKhoaBieuContext,
} from "./ThoiKhoaBieuProvider";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import { getWeeksInRange } from "../TienDoGiangDay/tableTienDoDaoTao/helpers";
import ButtonAction from "../../../components/ui/ButtonAction";
import DateInput from "../../../components/ui/Form/DateInput";

const ThoiKhoaBieu = () => {
  return (
    <ThoiKhoaBieuProvider>
      <Inner />
    </ThoiKhoaBieuProvider>
  );
};

const Inner = () => {
  const {
    semesterId,
    classId,
    lopHocsData,
    hocKysData,
    setSemesterId,
    setClassId,
    studySchedule,
  } = useThoiKhoaBieuContext();
  console.log(studySchedule);
  const semester = hocKysData?.find((hk) => hk.id === semesterId);
  const year = semester?.year;
  const startDate = semester ? new Date(semester.startDate) : null;
  const endDate = semester ? new Date(semester.endDate) : null;
  const weeks = getWeeksInRange(
    startDate ? new Date(startDate) : new Date(),
    endDate ? new Date(endDate) : new Date(),
  );

  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const dateValue = new Date(weeks[currentWeek - 1].start);
  const month = String(
    dateValue.getDate() ? dateValue.getMonth() + 1 : 1,
  ).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  const fullDateString = `${year}-${month}-${day}`;

  // Mảng danh sách các Thứ trong tuần
  const daysOfWeek = [
    { key: "MONDAY", label: "Thứ Hai" },
    { key: "TUESDAY", label: "Thứ Ba" },
    { key: "WEDNESDAY", label: "Thứ Tư" },
    { key: "THURSDAY", label: "Thứ Năm" },
    { key: "FRIDAY", label: "Thứ Sáu" },
    { key: "SATURDAY", label: "Thứ Bảy" },
    { key: "SUNDAY", label: "Chủ Nhật" },
  ];

  // Định nghĩa cấu trúc các Ca học theo chiều dọc
  const shifts = [
    {
      key: "SANG",
      label: "Ca Sáng",
      sub: "Tiết 1 - Tiết 5",
      icon: Sunrise,
      color: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      key: "CHIEU",
      label: "Ca Chiều",
      sub: "Tiết 6 - Tiết 10",
      icon: Sun,
      color: "bg-sky-50 text-sky-700 border-sky-100",
    },
    {
      key: "TOI",
      label: "Ca Tối",
      sub: "Tiết 11 - Tiết 14",
      icon: Moon,
      color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
  ];

  // Hàm chuyển đổi tuần
  const handlePrevWeek = () => {
    if (currentWeek > 1) setCurrentWeek((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    if (currentWeek < weeks.length) setCurrentWeek((prev) => prev + 1);
  };

  return (
    <PageShell
      title="Thời khóa biểu"
      sub="Quản lý thời khóa biểu của các lớp học"
      icon={Calendar}
    >
      <div className="space-y-6">
        {/* ================= BỘ LỌC (FILTERS) ================= */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-64 space-y-1.5">
            <SelectOption
              label="Chọn học kỳ để xem thời khóa biểu"
              options={[
                {
                  value: "",
                  label: "Chọn học kỳ để xem",
                },
                ...(hocKysData?.map((hocKy) => ({
                  value: hocKy.id,
                  label: hocKy.name,
                })) || []),
              ]}
              value={semesterId || undefined}
              onChange={(e) => setSemesterId(Number(e.target.value))}
            />
          </div>

          <div className="w-full sm:w-64 space-y-1.5">
            <SelectOption
              label="Chọn lớp học để xem thời khóa biểu"
              options={[
                {
                  value: "",
                  label: "Chọn lớp học để xem",
                },
                ...(lopHocsData?.map((lopHoc) => ({
                  value: lopHoc.id,
                  label: lopHoc.className,
                })) || []),
              ]}
              value={classId || undefined}
              onChange={(e) => setClassId(Number(e.target.value))}
            />
          </div>

          {/* Bộ chọn nhanh Tuần nằm trong thanh Filter */}
          <div className="w-full sm:w-auto sm:ml-auto flex gap-6 items-center">
            <DateInput value={fullDateString} />
            <div className="flex items-center gap-2">
              <ButtonAction
                icon={<ChevronLeft size={18} />}
                onClick={handlePrevWeek}
                disabled={currentWeek === 1}
              />

              <SelectOption
                options={Array.from({ length: weeks.length }).map((_, i) => ({
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
                disabled={currentWeek === weeks.length}
              />
            </div>
          </div>
        </div>

        {/* ================= BẢNG THỜI KHÓA BIỂU CỐ ĐỊNH LAYOUT ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header hiển thị tuần hiện tại dạng Banner nhỏ */}
          <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-slate-700">
                Lịch học chi tiết:{" "}
                <span className="text-blue-600">Tuần {currentWeek}</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-fixed min-w-200">
              {/* Tiêu đề Cột ngang (Thứ 2 -> CN) */}
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  {/* Ô góc trên cùng bên trái trống */}
                  <th className="w-40 p-3 text-xs font-bold uppercase tracking-wider text-slate-400 border-r border-slate-200 text-center">
                    Buổi / Ca
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

              {/* Thân bảng hàng dọc (Ca học) */}
              <tbody className="divide-y divide-slate-200">
                {shifts.map((shift) => {
                  const ShiftIcon = shift.icon;
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
                      {/* Cột dọc hiển thị tên ca học */}
                      <td className="p-4 border-r border-slate-200 font-medium align-middle text-center bg-slate-50/20 sticky left-0 z-10">
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`p-2 rounded-xl border ${shift.color}`}
                          >
                            <ShiftIcon size={18} />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-800">
                              {shift.label}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {shift.sub}
                            </p>
                          </div>
                        </div>
                      </td>

                      {daysOfWeek.map((day) => {
                        const cellSchedule = studySchedule?.find(
                          (item) =>
                            item.weekNumber === currentWeek &&
                            item.dayOfWeek === day.key &&
                            item.shift === dbShiftMap[shift.key],
                        );

                        return (
                          <td
                            key={`${shift.key}-${day.key}`}
                            className="border-r p-1 border-slate-200 last:border-r-0 align-top 
                            min-h-[120px] transition-all group-hover:bg-slate-50/10"
                          >
                            {cellSchedule ? (
                              <div
                                className="rounded-lg bg-slate-100 w-full p-2.5  
                               flex flex-col gap-2 text-left group/card 
                              hover:border-slate-300 hover:shadow transition-all"
                              >
                                <p
                                  className="text-[13px] font-semibold text-slate-900 
                                leading-snug break-words whitespace-normal"
                                >
                                  {cellSchedule.classSubject?.subject
                                    ?.subjectName ||
                                    `Môn học #${cellSchedule.classSubjectId}`}
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
      </div>
    </PageShell>
  );
};

export default ThoiKhoaBieu;
