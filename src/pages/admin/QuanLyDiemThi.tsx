import React, { useState } from "react";
import {
  Search,
  Download,
  Upload,
  Save,
  Filter,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  FileSpreadsheet,
} from "lucide-react";

const GradeManagement = () => {
  // Giả lập danh sách sinh viên và điểm mô-đun
  const [students, setStudents] = useState([
    {
      id: "SV001",
      name: "Nguyễn Văn An",
      birthday: "12/05/2006",
      attendance: 10,
      periodic: 8.5,
      final: 7.0,
      average: 7.8,
      status: "Đạt",
    },
    {
      id: "SV002",
      name: "Trần Thị Bình",
      birthday: "20/08/2006",
      attendance: 9,
      periodic: 4.0,
      final: 3.5,
      average: 3.8,
      status: "Học lại",
    },
    {
      id: "SV003",
      name: "Lê Hoàng Chinh",
      birthday: "15/02/2006",
      attendance: 10,
      periodic: 9.0,
      final: 8.5,
      average: 8.8,
      status: "Đạt",
    },
    {
      id: "SV004",
      name: "Phạm Minh Đức",
      birthday: "30/11/2006",
      attendance: 7,
      periodic: 5.5,
      final: 0,
      average: 2.5,
      status: "Thi lại",
    },
  ]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header điều hướng và lọc */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Quản lý Điểm & Thi
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Nhập điểm mô-đun: <b>Lắp ráp cài đặt máy tính (MH01)</b>
        </p>
      </div>

      {/* Bộ lọc thông minh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            Khóa học
          </label>
          <select className="text-sm font-semibold text-slate-700 outline-none bg-transparent">
            <option>Khóa 24 (2024 - 2026)</option>
            <option>Khóa 23 (2023 - 2025)</option>
          </select>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            Lớp học
          </label>
          <select className="text-sm font-semibold text-slate-700 outline-none bg-transparent">
            <option>KTMT-K24A</option>
            <option>QTN-K24B</option>
          </select>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            Mô-đun / Môn học
          </label>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-600 truncate">
              Sửa chữa Mainboard
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            Lần thi
          </label>
          <select className="text-sm font-semibold text-slate-700 outline-none bg-transparent">
            <option>Lần 1 (Chính thức)</option>
            <option>Lần 2 (Thi lại)</option>
          </select>
        </div>
      </div>

      {/* Thanh công cụ thao tác */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-4">
        <div className="relative w-full lg:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm tên hoặc mã SV..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Download size={16} /> Mẫu Excel
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium text-emerald-600 hover:bg-emerald-100 transition-colors">
            <Upload size={16} /> Nhập File
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
            <Save size={16} /> Lưu bảng điểm
          </button>
        </div>
      </div>

      {/* Bảng nhập điểm */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <th className="px-6 py-4 w-16">STT</th>
                <th className="px-6 py-4">Mã SV</th>
                <th className="px-6 py-4">Họ và Tên</th>
                <th className="px-6 py-4 text-center bg-blue-50/30">
                  Chuyên cần (10%)
                </th>
                <th className="px-6 py-4 text-center bg-blue-50/50">
                  Định kỳ (30%)
                </th>
                <th className="px-6 py-4 text-center bg-blue-50/70">
                  Thi kết thúc (60%)
                </th>
                <th className="px-6 py-4 text-center">Điểm TB</th>
                <th className="px-6 py-4">Kết quả</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((sv, idx) => (
                <tr
                  key={sv.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">
                    {sv.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-800">
                      {sv.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {sv.birthday}
                    </div>
                  </td>
                  {/* Ô nhập điểm */}
                  <td className="px-4 py-3 bg-blue-50/10">
                    <input
                      type="number"
                      defaultValue={sv.attendance}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-center text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 bg-blue-50/20">
                    <input
                      type="number"
                      defaultValue={sv.periodic}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-center text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 bg-blue-50/30">
                    <input
                      type="number"
                      defaultValue={sv.final}
                      className={`w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-center text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10 ${sv.final < 4 ? "text-red-600" : "text-slate-800"}`}
                    />
                  </td>
                  {/* Điểm TB tự động tính */}
                  <td className="px-6 py-4 text-center font-black text-blue-700 text-sm">
                    {sv.average}
                  </td>
                  <td className="px-6 py-4">
                    {sv.status === "Đạt" ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                        <CheckCircle2 size={14} /> ĐẠT
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-500 font-bold text-xs">
                        <AlertCircle size={14} /> {sv.status.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 gap-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Tỉ lệ
            đạt: 75%
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Tỉ lệ học
            lại: 25%
          </div>
        </div>
        <p className="text-[11px] text-slate-400 italic">
          * Điểm trung bình = (Chuyên cần x 0.1) + (Định kỳ x 0.3) + (Thi kết
          thúc x 0.6)
        </p>
      </div>
    </div>
  );
};

export default GradeManagement;
