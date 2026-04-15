import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Filter,
  GraduationCap,
  Search,
  UserCheck,
  Users,
} from "lucide-react";

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
                <ChevronDown
                  size={16}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
                />
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

export default FilterBar;
