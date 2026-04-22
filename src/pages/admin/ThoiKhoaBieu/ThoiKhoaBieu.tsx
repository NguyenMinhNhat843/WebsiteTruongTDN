import { useState } from "react";
import { Calendar, MapPin, Filter, ChevronRight } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";

const AdminScheduleGlobal = () => {
  // 1. Quản lý bộ lọc Học kỳ
  const [semester, setSemester] = useState("HK1-2026");

  // 2. Định nghĩa danh sách phòng và thứ
  const rooms = [
    "Phòng 101",
    "Phòng 102",
    "Phòng 201",
    "Phòng 202",
    "Xưởng Cơ khí",
  ];
  const days = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  // 3. Dữ liệu giả lập (Backend sẽ trả về mảng này)
  const scheduleData = [
    {
      className: "Kế toán doanh nghiệp KTDN20A",
      room: "Phòng 101",
      day: "Thứ 2",
      slots: "Tiết 1-3",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      className: "Lập trình hướng đối tượng KTDN20A",
      room: "Phòng 101",
      day: "Thứ 2",
      slots: "Tiết 4-5",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      className: "Kế toán doanh nghiệp KTDN20A",
      room: "Phòng 101",
      day: "Thứ 7",
      slots: "Tiết 1-3",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      className: "Quản trị mạng QTM21B",
      room: "Phòng 201",
      day: "Thứ 4",
      slots: "Tiết 4-6",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  ];

  return (
    <PageShell
      title="Quản lý Thời khóa biểu"
      sub="Phân bổ phòng học theo học kỳ"
      icon={Calendar}
      renderRight={
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <Filter size={18} className="text-slate-400 ml-2" />
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none pr-4"
          >
            <option value="HK1-2026">Học kỳ 1 - 2026</option>
            <option value="HK2-2025">Học kỳ 2 - 2025</option>
          </select>
        </div>
      }
    >
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Grid Bảng thời khóa biểu */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {/* Ô góc trống */}
                <th className="p-4 bg-slate-50 border-b border-r border-slate-200 text-left text-xs uppercase tracking-widest text-slate-400 font-black w-40">
                  Phòng / Thứ
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="p-4 bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-700 min-w-[150px]"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr
                  key={room}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* Cột dọc: Phòng học */}
                  <td className="p-4 border-r border-b border-slate-200 bg-slate-50/30">
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                      <MapPin size={14} className="text-slate-400" />
                      {room}
                    </div>
                  </td>

                  {/* Các ô chứa môn học */}
                  {days.map((day) => {
                    // 1. Dùng filter để lấy TẤT CẢ các lớp học trong phòng và thứ này
                    const lessonsInCell = scheduleData.filter(
                      (d) => d.room === room && d.day === day,
                    );

                    return (
                      <td
                        key={day}
                        className="p-2 border-b border-slate-100 align-top min-w-45"
                      >
                        {/* Container chứa danh sách các lớp */}
                        <div className="flex flex-col gap-2 max-h-[300px]">
                          {lessonsInCell.length > 0 ? (
                            lessonsInCell.map((lesson, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border shadow-sm ${lesson.color} transition-transform hover:scale-[1.02] cursor-pointer shrink-0`}
                              >
                                <p className="text-[11px] font-black uppercase mb-1 leading-tight wrap-break-words">
                                  {lesson.className}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-[10px] font-bold opacity-80 bg-white/50 px-1.5 py-0.5 rounded">
                                    {lesson.slots}
                                  </span>
                                  <ChevronRight size={12} />
                                </div>
                              </div>
                            ))
                          ) : (
                            /* Trạng thái trống */
                            <div className="h-full w-full py-6 flex items-center justify-center">
                              <span className="text-slate-200 text-[10px] italic">
                                Trống
                              </span>
                            </div>
                          )}
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
    </PageShell>
  );
};

export default AdminScheduleGlobal;
