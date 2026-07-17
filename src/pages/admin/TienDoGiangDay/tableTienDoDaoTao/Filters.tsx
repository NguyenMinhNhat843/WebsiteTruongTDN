import { SlidersHorizontal } from "lucide-react";

interface FiltersProps {
  classIdParam: string;
  semesterIdParam: string;
  classOptions?: { value: number; label: string }[];
  semesterOptions?: { value: number; label: string }[];
  onClassChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
}

export const Filters = ({
  classIdParam,
  semesterIdParam,
  classOptions,
  semesterOptions,
  onClassChange,
  onSemesterChange,
}: FiltersProps) => {
  return (
    <div className="w-full p-4">
      {/* Header Đơn giản phía trên bộ lọc */}
      <div className="flex items-center gap-2.5 pb-1 border-b border-slate-100">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <SlidersHorizontal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            Bộ lọc tiến độ đào tạo
          </h2>
          <p className="text-xs text-slate-400">
            Chọn lớp và học kỳ để cấu hình dữ liệu chi tiết
          </p>
        </div>
      </div>

      {/* Filters Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-white rounded-xl border border-slate-100 shadow-sm mt-4">
        {/* Dropdown Lớp học */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Lớp học
          </label>
          <div className="relative">
            <select
              value={classIdParam}
              onChange={(e) => onClassChange(e.target.value)}
              className="w-full appearance-none bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-lg pl-3 pr-10 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
            >
              <option value="" className="text-slate-400">
                -- Chọn lớp học --
              </option>
              {classOptions?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-slate-800"
                >
                  {option.label}
                </option>
              ))}
            </select>
            {/* Icon mũi tên tùy chỉnh */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Dropdown Học kỳ */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Học kỳ
          </label>
          <div className="relative">
            <select
              value={semesterIdParam}
              onChange={(e) => onSemesterChange(e.target.value)}
              className="w-full appearance-none bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-lg pl-3 pr-10 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
            >
              <option value="" className="text-slate-400">
                -- Chọn học kỳ --
              </option>
              {semesterOptions?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-slate-800"
                >
                  {option.label}
                </option>
              ))}
            </select>
            {/* Icon mũi tên tùy chỉnh */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
