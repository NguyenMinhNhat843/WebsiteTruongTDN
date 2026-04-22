import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Monitor,
} from "lucide-react";
import clsx from "clsx";
import PageShell from "../../../components/ui/PageShell";
import Input from "../../../components/ui/Form/Input";
import ButtonAction from "../../../components/ui/ButtonAction";

const ThoiKhoaBieu = () => {
  const [selectedDate, setSelectedDate] = useState("2026-04-22");

  const daysOfWeek = [
    { label: "Thứ 2", date: "20/04/2026" },
    { label: "Thứ 3", date: "21/04/2026" },
    { label: "Thứ 4", date: "22/04/2026" },
    { label: "Thứ 5", date: "23/04/2026" },
    { label: "Thứ 6", date: "24/04/2026" },
    { label: "Thứ 7", date: "25/04/2026" },
  ];

  const shifts = [
    { label: "Ca Sáng", periods: "Tiết 1 - 5" },
    { label: "Ca Chiều", periods: "Tiết 6 - 10" },
    { label: "Ca Tối", periods: "Tiết 11 - 13" },
  ];

  // Dữ liệu mẫu lịch giảng dạy
  const scheduleData = [
    {
      day: 0,
      shift: 0,
      title: "Đảm bảo chất lượng và Kiểm thử phần mềm",
      classCode: "DHKTPM17A - 420300359201",
      periods: "4 - 6",
      room: "X10.02 (X (CS1))",
      teacher: "Châu Thị Bảo Hà",
      type: "theory",
    },
    {
      day: 2,
      shift: 0,
      title: "Lập trình WWW (Java)",
      classCode: "DHKTPM17B - 420300362103",
      periods: "1 - 3",
      room: "TT116 (Trực tuyến)",
      teacher: "Đặng Thị Thu Hà",
      type: "online",
      note: "Zoom H116: 95417118871 / 913870", // Phần ghi chú cho học online
    },
  ];
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "practice":
        return "bg-blue-50 border-l-4 border-blue-500 text-blue-700";
      case "online":
        return "bg-purple-50 border-l-4 border-purple-500 text-purple-700";
      case "exam":
        return "bg-red-50 border-l-4 border-red-500 text-red-700";
      case "suspended":
        return "bg-slate-100 border-l-4 border-slate-400 text-slate-400 opacity-60";
      default:
        return "bg-slate-50 border-l-4 border-slate-500 text-slate-700"; // Lý thuyết
    }
  };

  const renderScheduleItem = (dayIndex: number, shiftIndex: number) => {
    const item = scheduleData.find(
      (d) => d.day === dayIndex && d.shift === shiftIndex,
    );
    if (!item) return null;

    const isOnline = item.type === "online";

    return (
      <div
        className={clsx(
          "p-3 rounded-xl h-full shadow-sm border-l-4 transition-all hover:shadow-md flex flex-col justify-between",
          getTypeStyles(item.type),
        )}
      >
        <div>
          {/* Tên môn học & Mã lớp */}
          <div className="text-[10px] font-bold opacity-70 uppercase tracking-tighter mb-1">
            {item.classCode}
          </div>
          <div className="font-extrabold text-[13px] leading-tight mb-2 line-clamp-2">
            {item.title}
          </div>

          {/* Thông tin chi tiết: Tiết, Phòng */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium">
              <Clock size={12} className="shrink-0" />
              <span>Tiết: {item.periods}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium">
              {isOnline ? (
                <Monitor size={12} className="shrink-0" />
              ) : (
                <MapPin size={12} className="shrink-0" />
              )}
              <span className="truncate">Phòng: {item.room}</span>
            </div>
          </div>
        </div>

        {/* Phần Ghi chú & GV (Hiển thị ở dưới cùng) */}
        <div className="mt-3 pt-2 border-t border-black/5">
          <div className="text-[11px] font-semibold italic truncate">
            GV: {item.teacher}
          </div>

          {item.note && (
            <div className="mt-1 p-1.5 bg-white/50 rounded border border-black/5 text-[10px] leading-tight break-words">
              <span className="font-bold text-red-600">Ghi chú:</span>{" "}
              {item.note}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <PageShell
      title="Lịch giảng dạy"
      sub="Quản lý thời gian và lộ trình giảng dạy cá nhân trong tuần."
      icon={Calendar}
      renderRight={
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            containerClassName="w-48"
          />
          <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <ButtonAction
              icon={<ChevronLeft size={18} />}
              className="border-none rounded-none hover:bg-slate-50"
            />
            <ButtonAction
              label="Hiện tại"
              className="border-y-0 border-x border-slate-200 rounded-none bg-white text-xs"
            />
            <ButtonAction
              icon={<ChevronRight size={18} />}
              className="border-none rounded-none hover:bg-slate-50"
            />
          </div>
        </div>
      }
    >
      {/* Grid Thời khóa biểu */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 w-32 border-r border-slate-100">
                  <div className="flex items-center justify-center text-slate-400">
                    <Clock size={16} />
                  </div>
                </th>
                {daysOfWeek.map((day, idx) => (
                  <th
                    key={idx}
                    className="p-4 min-w-[150px] text-center border-r border-slate-100 last:border-r-0"
                  >
                    <div className="text-xs uppercase text-slate-400 font-bold tracking-widest">
                      {day.label}
                    </div>
                    <div className="text-lg font-black text-slate-700">
                      {day.date}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift, sIdx) => (
                <tr
                  key={sIdx}
                  className="border-b border-slate-50 last:border-b-0"
                >
                  <td className="p-4 text-center bg-slate-50/30 border-r border-slate-100">
                    <div className="font-bold text-slate-700 text-sm">
                      {shift.label}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">
                      {shift.periods}
                    </div>
                  </td>
                  {daysOfWeek.map((_, dIdx) => (
                    <td
                      key={dIdx}
                      className="p-2 border-r border-slate-100 last:border-r-0 h-32 align-top"
                    >
                      {renderScheduleItem(dIdx, sIdx)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer: Legend đánh dấu màu sắc */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <div className="flex flex-wrap gap-6 justify-center items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
              Chú thích:
            </span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-slate-400"></div>
              <span className="text-xs text-slate-600 font-medium">
                Lý thuyết
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
              <span className="text-xs text-slate-600 font-medium">
                Thực hành
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
              <span className="text-xs text-slate-600 font-medium">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-500"></div>
              <span className="text-xs text-slate-600 font-medium">
                Lịch thi
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-400"></div>
              <span className="text-xs text-slate-600 font-medium">
                Tạm ngưng
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ThoiKhoaBieu;
