export interface CourseModule {
  id: string;
  name: string;
  code: string;
  hours: number;
  type: "Lý thuyết" | "Thực hành" | "Tích hợp";
}

export interface TrainingProgram {
  id: string;
  name: string; // Tên nghề: Kỹ thuật sửa chữa lắp ráp máy tính
  code: string; // Mã nghề: 5480202
  level: "Trung cấp" | "Cao đẳng";
  duration: string; // 1.5 - 2 năm
  totalHours: number;
  modules: CourseModule[];
}

import React, { useState } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Clock,
  FileText,
  MoreVertical,
} from "lucide-react";

const ChuongTrinhKhung = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu mẫu
  const programs = [
    {
      id: "1",
      name: "Kỹ thuật sửa chữa lắp ráp máy tính",
      code: "5480202",
      level: "Trung cấp",
      duration: "1.5 năm",
      totalHours: 1450,
      status: "Đang đào tạo",
    },
    {
      id: "2",
      name: "Quản trị mạng máy tính",
      code: "5480201",
      level: "Trung cấp",
      duration: "1.5 năm",
      totalHours: 1500,
      status: "Đang đào tạo",
    },
    {
      id: "3",
      name: "Kế toán doanh nghiệp",
      code: "5340302",
      level: "Trung cấp",
      duration: "1.5 năm",
      totalHours: 1300,
      status: "Dừng tuyển sinh",
    },
    {
      id: "4",
      name: "Điện công nghiệp",
      code: "5520227",
      level: "Trung cấp",
      duration: "2 năm",
      totalHours: 1800,
      status: "Đang đào tạo",
    },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Chương trình khung
          </h1>
          <p className="text-slate-500 text-sm">
            Quản lý danh mục ngành nghề và cấu trúc môn học đào tạo.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm shadow-blue-200">
          <Plus size={18} />
          <span>Thêm ngành nghề mới</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tổng số nghề</p>
            <p className="text-xl font-bold text-slate-800">12 Ngành</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Trung bình thời gian
            </p>
            <p className="text-xl font-bold text-slate-800">1.5 - 2 Năm</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Môn học đã cập nhật
            </p>
            <p className="text-xl font-bold text-slate-800">145 Môn</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-t-xl border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm mã hoặc tên nghề..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white cursor-pointer">
            <option>Tất cả hệ đào tạo</option>
            <option>Trung cấp</option>
            <option>Cao đẳng</option>
            <option>Ngắn hạn</option>
          </select>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          {" "}
          {/* Dùng class scrollbar bạn vừa tạo */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                <th className="px-6 py-4">Mã Nghề</th>
                <th className="px-6 py-4">Tên Ngành Nghề Đào Tạo</th>
                <th className="px-6 py-4">Hệ</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4 text-center">Tổng giờ</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {programs.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">
                    {item.code}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs uppercase font-medium">
                      {item.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 italic">
                    {item.duration}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">
                    {item.totalHours.toLocaleString()}h
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === "Đang đào tạo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Dummy */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500 bg-slate-50/50">
          <span>Hiển thị 1 - 4 trên 12 ngành nghề</span>
          <div className="flex gap-1">
            <button
              className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50"
              disabled
            >
              Trước
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded">
              1
            </button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white">
              2
            </button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChuongTrinhKhung;
