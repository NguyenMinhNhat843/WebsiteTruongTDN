import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Filter,
  GraduationCap,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { StatCard } from "../../../components/ui/StatCard";
import { Stats } from "./constants";
import Pagination from "../../../components/ui/Pagination";

const QuanLyDiemThi = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý điểm sinh viên
        </h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all">
          <span>+ Nhập điểm Excel</span>
        </button>
      </div>

      <StatsSummary />
      <FilterBar />
      <GradeTable />

      {/* Pagination */}
      <Pagination
        currentPage={1}
        totalPages={4}
        onPageChange={(page) => console.log("Chuyển đến trang:", page)}
        pageSize={8}
        totalItems={100}
      />
    </div>
  );
};

export default QuanLyDiemThi;

const GradeTable = () => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
        <tr>
          <th className="px-4 py-3">Sinh viên</th>
          <th className="px-4 py-3">Môn học</th>
          <th className="px-4 py-3 text-center">Chuyên cần</th>
          <th className="px-4 py-3 text-center">GK (20%)</th>
          <th className="px-4 py-3 text-center">CK (50%)</th>
          <th className="px-4 py-3 text-center">Tổng kết</th>
          <th className="px-4 py-3">Trạng thái</th>
          <th className="px-4 py-3 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 text-sm">
        {[1, 2, 3].map((_, i) => (
          <tr key={i} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3">
              <div className="font-medium text-gray-900">SV00{i + 1}</div>
              <div className="text-xs text-gray-500">Nguyễn Văn A</div>
            </td>
            <td className="px-4 py-3 text-gray-600">Lập trình React Native</td>
            <td className="px-4 py-3 text-center font-mono">10</td>
            <td className="px-4 py-3 text-center font-mono">8.5</td>
            <td className="px-4 py-3 text-center font-mono text-red-500">
              3.0
            </td>
            <td className="px-4 py-3 text-center">
              <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                4.8
              </span>
            </td>
            <td className="px-4 py-3">
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase">
                Chờ duyệt
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <button className="text-blue-600 hover:underline font-medium">
                Chi tiết
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FilterBar = () => {
  const filters = [
    {
      label: "Môn học",
      icon: <Briefcase size={14} />,
      options: ["Lập trình Web", "Cấu trúc dữ liệu"],
      color: "text-blue-500",
    },
    {
      label: "Học kỳ",
      icon: <Calendar size={14} />,
      options: ["HK1 - 2025", "HK2 - 2025"],
      color: "text-purple-500",
    },
    {
      label: "Lớp học",
      icon: <GraduationCap size={14} />,
      options: ["9P-KT-K22A", "CD-IT-K23B"],
      color: "text-emerald-500",
    },
    {
      label: "Trạng thái",
      icon: <CheckCircle2 size={14} />,
      options: ["Chờ duyệt", "Đã duyệt", "Đã chốt"],
      color: "text-orange-500",
    },
    {
      label: "Khoa",
      icon: <Users size={14} />,
      options: ["Khoa CNTT", "Khoa Kinh tế"],
      color: "text-indigo-500",
    },
    {
      label: "Giáo viên",
      icon: <UserCheck size={14} />,
      options: ["Hà Thị Nguyệt", "Trần Văn Nam"],
      color: "text-pink-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
      {/* Header nhỏ phía trên */}
      <div className="px-5 py-2 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500">
          <Filter size={14} className="mt-0.5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Bộ lọc nâng cao
          </span>
        </div>
        <button className="text-xs text-blue-600 font-medium hover:underline">
          Xóa tất cả
        </button>
      </div>

      <div className="p-5 grid grid-cols-4 gap-4 items-end">
        <div className="min-w-65 space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1.5">
            <Search size={12} /> Tìm kiếm sinh viên
          </label>
          <div className="relative group">
            <input
              className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
              placeholder="Nhập mã SV hoặc họ tên..."
            />
          </div>
        </div>

        {/* Các Select Filter: Có Icon và hover hiệu ứng */}
        {filters.map((f, i) => (
          <div key={i} className="flex-1 min-w-35 space-y-1.5">
            <label
              className={`text-[11px] font-bold ${f.color} uppercase ml-1 flex items-center gap-1.5 opacity-80`}
            >
              {f.icon} {f.label}
            </label>
            <div className="relative">
              <select className="w-full appearance-none pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all outline-none cursor-pointer">
                <option value="">Tất cả</option>
                {f.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}

        {/* Nút Action: Thiết kế đậm đà hơn */}
        <button className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 h-[42px]">
          <Filter size={16} />
          Lọc dữ liệu
        </button>
      </div>
    </div>
  );
};

const StatsSummary = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {Stats.map((item) => (
      <StatCard label={item.label} value={item.value} color={item.color} />
    ))}
  </div>
);
