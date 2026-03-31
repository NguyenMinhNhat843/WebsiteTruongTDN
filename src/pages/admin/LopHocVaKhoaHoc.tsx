import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  UserCheck,
  LayoutGrid,
  List,
  Plus,
  GraduationCap,
} from "lucide-react";

const ClassManagement = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const classes = [
    {
      id: 1,
      name: "Kỹ thuật máy tính K24A",
      code: "KTMT-K24A",
      studentCount: 32,
      teacher: "Nguyễn Văn A",
      startDate: "05/09/2024",
      status: "Đang học",
      progress: 65,
      room: "P.302",
    },
    {
      id: 2,
      name: "Quản trị mạng K23B",
      code: "QTN-K23B",
      studentCount: 28,
      teacher: "Trần Thị B",
      startDate: "05/09/2023",
      status: "Đang học",
      progress: 80,
      room: "P.Hành hành 1",
    },
    {
      id: 3,
      name: "Điện công nghiệp K24C",
      code: "DCN-K24C",
      studentCount: 40,
      teacher: "Lê Văn C",
      startDate: "15/10/2024",
      status: "Mới mở",
      progress: 10,
      room: "Xưởng Điện",
    },
    {
      id: 4,
      name: "Kế toán doanh nghiệp K22A",
      code: "KT-K22A",
      studentCount: 35,
      teacher: "Phạm Thị D",
      startDate: "01/09/2022",
      status: "Sắp tốt nghiệp",
      progress: 95,
      room: "P.401",
    },
  ];

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <GraduationCap className="text-blue-600" size={28} />
            Quản lý Lớp học & Khóa học
          </h1>
          <p className="text-slate-500 mt-1">
            Theo dõi danh sách lớp, sĩ số và tiến độ đào tạo năm học 2025-2026
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex gap-3">
          <button className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 font-medium shadow-sm">
            <Calendar size={18} />
            Quản lý Khóa
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium shadow-md shadow-blue-200">
            <Plus size={18} />
            Mở lớp mới
          </button>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm tên lớp, mã lớp hoặc giáo viên..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
            <Filter size={20} />
          </button>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Grid Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all group overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {cls.code}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <h3 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {cls.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <UserCheck size={14} />
                  GV: {cls.teacher}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Sĩ số:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Users size={14} className="text-slate-400" />{" "}
                      {cls.studentCount} HS
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Phòng:</span>
                    <span className="font-medium text-slate-700">
                      {cls.room}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span className="text-slate-400 uppercase">
                      Tiến độ khóa học
                    </span>
                    <span className="text-blue-600">{cls.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${cls.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    cls.status === "Đang học"
                      ? "bg-green-100 text-green-700"
                      : cls.status === "Mới mở"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {cls.status}
                </span>
                <button className="text-xs font-semibold text-blue-600 hover:underline">
                  Chi tiết lớp
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Display (Simple Table) */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">Tên lớp / Mã lớp</th>
                <th className="px-6 py-4 font-semibold">Giáo viên chủ nhiệm</th>
                <th className="px-6 py-4 font-semibold text-center">Sĩ số</th>
                <th className="px-6 py-4 font-semibold">Ngày bắt đầu</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((cls) => (
                <tr
                  key={cls.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">
                      {cls.name}
                    </div>
                    <div className="text-xs text-slate-500">{cls.code}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {cls.teacher}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    {cls.studentCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {cls.startDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-bold px-2 py-1 rounded bg-green-50 text-green-600 border border-green-100">
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded hover:bg-blue-50">
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
