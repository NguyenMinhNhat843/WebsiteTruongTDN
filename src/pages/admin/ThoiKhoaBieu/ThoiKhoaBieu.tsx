import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Users,
  MapPin,
  Plus,
} from "lucide-react";
import { CLASS_LIST, TIET_HOCS } from "./thoiKhoaBieu.mockData";

export default function AdminGlobalSchedule() {
  const [selectedDay, setSelectedDay] = useState("Thứ Hai");

  return (
    <div className="p-6 bg-slate-50">
      <div className=" mx-auto">
        {/* Header điều khiển */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-slate-800">
              Lịch học Toàn trường
            </h2>
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              {[
                "Thứ Hai",
                "Thứ Ba",
                "Thứ Tư",
                "Thứ Năm",
                "Thứ Sáu",
                "Thứ Bảy",
              ].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedDay === day
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm tên lớp, phòng..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Bảng ma trận */}
        <div className="bg-white w-full rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Chú ý: overflow-x-auto ở container bọc ngoài table */}
          <div className="overflow-x-auto max-w-full custom-scrollbar">
            <table className="w-max min-w-full border-collapse">
              <thead className="shadow-lg">
                <tr className="bg-slate-900 text-white">
                  <th className="shadown-2xl sticky left-0 z-30 bg-slate-900 p-5 text-left font-black uppercase tracking-widest text-sm border-r border-slate-800 w-48">
                    Lớp Học / Tiết
                  </th>
                  {TIET_HOCS.map((slot) => (
                    <th
                      key={slot.value}
                      className="p-5 text-center font-bold text-xs min-w-45 border-r border-slate-800 last:border-r-0"
                    >
                      {slot.label}
                      <span className="block text-sm text-slate-300 font-normal">
                        {slot.time}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CLASS_LIST.map((cls) => (
                  <tr
                    key={cls.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="shadow-2xl sticky left-0 z-10 bg-white group-hover:bg-slate-50 p-5 font-black text-slate-700 border-r border-slate-300">
                      <div className="flex flex-col">
                        <span className="text-sm truncate w-36">
                          {cls.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1 uppercase">
                          <MapPin size={10} className="text-blue-500" />{" "}
                          {cls.room}
                        </span>
                      </div>
                    </td>

                    {/* Các ô tiết học có thể cuộn ngang phía sau */}
                    {TIET_HOCS.map((slot) => {
                      const hasLesson = Math.random() > 0.3;
                      return (
                        <td
                          key={slot.value}
                          className="p-3 border-r border-slate-100 last:border-r-0 min-w-45"
                        >
                          {hasLesson ? (
                            <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl hover:shadow-lg hover:shadow-blue-100 transition-all cursor-pointer group/card relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <MoreHorizontal
                                  size={14}
                                  className="text-blue-400"
                                />
                              </div>
                              <p className="text-[11px] font-black text-blue-900 line-clamp-1 mb-1">
                                Thiết kế UI/UX
                              </p>
                              <div className="flex items-center gap-1 text-[9px] text-blue-600 font-bold">
                                <Users size={10} /> GV. Minh Tú
                              </div>
                            </div>
                          ) : (
                            <div className="h-16 w-full rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                              <Plus size={16} />
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
      </div>
    </div>
  );
}
