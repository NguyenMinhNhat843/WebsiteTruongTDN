import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Clock,
  Printer,
  Filter,
  Plus,
} from "lucide-react";

const TimetablePage = () => {
  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
  const timeSlots = ["07:30", "09:30", "13:30", "15:30"]; // Các mốc bắt đầu tiết học

  const scheduleData = [
    {
      id: "1",
      subject: "Sửa chữa Mainboard",
      class: "KTMT-K24A",
      teacher: "Thầy Bình",
      room: "Xưởng MT1",
      day: 0,
      time: "07:30 - 11:30",
      type: "Thực hành",
    },
    {
      id: "2",
      subject: "Cấu trúc máy tính",
      class: "KTMT-K24A",
      teacher: "Cô Lan",
      room: "P.202",
      day: 1,
      time: "07:30 - 09:30",
      type: "Lý thuyết",
    },
    {
      id: "3",
      subject: "Mạng máy tính cơ bản",
      class: "KTMT-K24A",
      teacher: "Thầy Nam",
      room: "P.301",
      day: 2,
      time: "13:30 - 17:30",
      type: "Thực hành",
    },
    {
      id: "4",
      subject: "Anh văn chuyên ngành",
      class: "KTMT-K24A",
      teacher: "Cô Mai",
      room: "P.402",
      day: 4,
      time: "09:30 - 11:30",
      type: "Lý thuyết",
    },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header Điều khiển */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Thời khóa biểu chi tiết
          </h1>
          <p className="text-slate-500 text-sm">
            Tuần 24 (từ 24/03/2026 - 30/03/2026)
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold px-4 text-slate-700 uppercase text-sm">
            Tuần hiện tại
          </span>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Printer size={16} /> In TKB
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-200">
            <Filter size={16} /> Lọc Lớp/GV
          </button>
        </div>
      </div>

      {/* Grid Thời khóa biểu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-slate-400 font-medium text-xs uppercase w-24 border-r border-slate-100">
                  Thời gian
                </th>
                {days.map((day, index) => (
                  <th
                    key={index}
                    className="py-4 px-2 text-slate-700 font-bold text-sm text-center"
                  >
                    {day}
                    <div className="text-[10px] text-slate-400 font-normal mt-1">
                      {24 + index}/03
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Ca Sáng */}
              <tr className="border-b border-slate-100">
                <td className="bg-slate-50/50 py-10 px-4 text-center border-r border-slate-100">
                  <div className="text-xs font-bold text-blue-600">SÁNG</div>
                  <div className="text-[10px] text-slate-400">
                    07:30 - 11:30
                  </div>
                </td>
                {days.map((_, dayIndex) => {
                  const slot = scheduleData.find(
                    (s) => s.day === dayIndex && s.time.includes("07:30"),
                  );
                  return (
                    <td
                      key={dayIndex}
                      className="p-2 align-top h-40 w-1/8 border-r border-slate-50 last:border-r-0"
                    >
                      {slot ? (
                        <div
                          className={`h-full p-3 rounded-xl border-l-4 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer ${
                            slot.type === "Thực hành"
                              ? "bg-orange-50 border-orange-400 text-orange-900"
                              : "bg-blue-50 border-blue-400 text-blue-900"
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase opacity-70 mb-1">
                            {slot.type}
                          </div>
                          <h4 className="font-bold text-sm leading-tight mb-2">
                            {slot.subject}
                          </h4>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium opacity-80">
                              <MapPin size={12} /> {slot.room}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium opacity-80">
                              <User size={12} /> {slot.teacher}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium opacity-80">
                              <Clock size={12} /> {slot.time}
                            </div>
                          </div>
                          <div className="mt-3 pt-2 border-t border-black/5 text-[10px] font-bold">
                            Lớp: {slot.class}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full rounded-xl border-2 border-dashed border-slate-50 flex items-center justify-center group hover:border-slate-200 transition-colors">
                          <button className="opacity-0 group-hover:opacity-100 text-slate-300 transition-opacity">
                            <Plus size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Ca Chiều */}
              <tr>
                <td className="bg-slate-50/50 py-10 px-4 text-center border-r border-slate-100">
                  <div className="text-xs font-bold text-purple-600">CHIỀU</div>
                  <div className="text-[10px] text-slate-400">
                    13:30 - 17:30
                  </div>
                </td>
                {days.map((_, dayIndex) => {
                  const slot = scheduleData.find(
                    (s) => s.day === dayIndex && s.time.includes("13:30"),
                  );
                  return (
                    <td
                      key={dayIndex}
                      className="p-2 align-top h-40 w-1/8 border-r border-slate-50 last:border-r-0"
                    >
                      {slot ? (
                        <div
                          className={`h-full p-3 rounded-xl border-l-4 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer ${
                            slot.type === "Thực hành"
                              ? "bg-orange-50 border-orange-400 text-orange-900"
                              : "bg-blue-50 border-blue-400 text-blue-900"
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase opacity-70 mb-1">
                            {slot.type}
                          </div>
                          <h4 className="font-bold text-sm leading-tight mb-2">
                            {slot.subject}
                          </h4>
                          <div className="space-y-1">
                            <p className="flex items-center gap-1.5 text-[11px] font-medium opacity-80">
                              <MapPin size={12} /> {slot.room}
                            </p>
                            <p className="flex items-center gap-1.5 text-[11px] font-medium opacity-80">
                              <User size={12} /> {slot.teacher}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-black/5 text-[10px] font-bold italic">
                            {slot.class}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full rounded-xl border-2 border-dashed border-slate-50 group hover:border-slate-200 transition-all"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Chú thích */}
      <div className="mt-6 flex gap-6 items-center px-4">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="w-3 h-3 rounded bg-blue-400"></span> Lý thuyết (Tại
          phòng học)
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="w-3 h-3 rounded bg-orange-400"></span> Thực hành (Tại
          xưởng/lab)
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="w-3 h-3 rounded border-2 border-dashed border-slate-300"></span>{" "}
          Trống (Có thể mượn phòng)
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
