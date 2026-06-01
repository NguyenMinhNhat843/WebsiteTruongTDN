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
  } = useThoiKhoaBieuContext();
  const semester = hocKysData?.find((hk) => hk.id === semesterId);
  const startDate = semester ? new Date(semester.startDate) : null;

  // State quản lý tuần đang chọn (mặc định tuần 1)
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const totalWeeks = 18; // Định nghĩa số tuần mặc định của một học kỳ

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
    if (currentWeek < totalWeeks) setCurrentWeek((prev) => prev + 1);
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
              options={
                hocKysData?.map((hocKy) => ({
                  value: hocKy.id,
                  label: hocKy.name,
                })) || []
              }
              value={semesterId || undefined}
              onChange={(e) => setSemesterId(Number(e.target.value))}
            />
          </div>

          <div className="w-full sm:w-64 space-y-1.5">
            <SelectOption
              label="Chọn lớp học để xem thời khóa biểu"
              options={
                lopHocsData?.map((lopHoc) => ({
                  value: lopHoc.id,
                  label: lopHoc.className,
                })) || []
              }
              value={classId || undefined}
              onChange={(e) => setClassId(Number(e.target.value))}
            />
          </div>

          {/* Bộ chọn nhanh Tuần nằm trong thanh Filter */}
          <div className="w-full sm:w-auto sm:ml-auto flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Chọn nhanh tuần
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevWeek}
                disabled={currentWeek === 1}
                className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-all"
              >
                <ChevronLeft size={18} />
              </button>

              <select
                value={currentWeek}
                onChange={(e) => setCurrentWeek(Number(e.target.value))}
                className="px-4 py-2 bg-white text-sm font-semibold text-slate-700 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-all text-center min-w-[120px]"
              >
                {Array.from({ length: totalWeeks }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tuần {i + 1}
                  </option>
                ))}
              </select>

              <button
                onClick={handleNextWeek}
                disabled={currentWeek === totalWeeks}
                className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-all"
              >
                <ChevronRight size={18} />
              </button>
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
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium">
              Layout chuẩn Học đường
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-fixed min-w-[800px]">
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

                      {/* Các ô tương ứng với từng Thứ (Hiện tại chưa đổ dữ liệu rác) */}
                      {daysOfWeek.map((day) => (
                        <td
                          key={`${shift.key}-${day.key}`}
                          className="p-3 border-r border-slate-200 last:border-r-0 align-top min-h-[120px] transition-all group-hover:bg-slate-50/10"
                        >
                          {/* Khung trống thiết kế sẵn hiệu ứng hover nhẹ nét đứt để sau này render Card lịch học */}
                          <div className="w-full h-24 rounded-xl border border-dashed border-slate-100 bg-slate-50/30 flex items-center justify-center group-hover:border-slate-200 group-hover:bg-white transition-all">
                            <span className="text-[11px] text-slate-300 font-medium select-none italic">
                              Trống
                            </span>
                          </div>
                        </td>
                      ))}
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
