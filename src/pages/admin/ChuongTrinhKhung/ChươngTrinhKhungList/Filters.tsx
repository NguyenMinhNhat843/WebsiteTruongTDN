import { Search, ChevronDown, GraduationCap, CalendarDays } from "lucide-react";

const Filters = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      {/* Tất cả bộ lọc trên cùng 1 hàng, tự động xuống hàng nếu màn hình quá nhỏ (flex-wrap) */}
      <div className="flex flex-wrap items-center gap-4">
        {/* 1. Ô tìm kiếm (Tăng padding và text-base cho to, dễ đọc) */}
        <div className="relative flex-[2] min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            placeholder="Tìm theo mã, tên ngành, khoa…"
            className="w-full pl-11 pr-4 py-2.5 text-base border border-slate-200 
            rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 
            focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>

        {/* 2. Lọc theo Ngành (UI tạm thời) */}
        <div className="relative flex-1 min-w-[200px]">
          <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            className="w-full pl-11 pr-10 py-2.5 text-base border border-slate-200 
            rounded-xl appearance-none bg-white text-slate-500 focus:outline-none"
          >
            <option value="">Tất cả ngành học</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* 3. Lọc theo Niên khóa (UI tạm thời) */}
        <div className="relative flex-1 min-w-[160px]">
          <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            className="w-full pl-11 pr-10 py-2.5 text-base border border-slate-200 
            rounded-xl appearance-none bg-white text-slate-500 focus:outline-none"
          >
            <option value="">Tất cả khóa học</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* 4. Số lượng kết quả (Hiển thị rõ ràng ở cuối hàng) */}
        <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 shrink-0 ml-auto">
          <p className="text-sm font-medium text-slate-600">
            Tìm thấy: <span className="font-bold text-blue-600">0</span> kết quả
          </p>
        </div>
      </div>
    </div>
  );
};

export default Filters;
