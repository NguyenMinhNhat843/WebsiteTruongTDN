interface FiltersProps {
  classIdParam: string
  semesterIdParam: string
  classOptions?: { value: number; label: string }[]
  semesterOptions?: { value: number; label: string }[]
  onClassChange: (value: string) => void
  onSemesterChange: (value: string) => void
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
    <div className="w-full py-4">
      {/* Filters Dropdowns */}
      <div className="grid grid-cols-1 gap-5 rounded-xl border border-slate-100 bg-white p-5 shadow-sm md:grid-cols-2">
        {/* Dropdown Lớp học */}
        <div className="relative flex flex-col gap-2">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <svg
              className="h-4 w-4 text-slate-400"
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
              className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-3 text-sm font-medium text-slate-800 transition-all duration-200 outline-none hover:border-slate-300 hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="" className="text-slate-400">
                -- Chọn lớp học --
              </option>
              {classOptions?.map((option) => (
                <option key={option.value} value={option.value} className="text-slate-800">
                  {option.label}
                </option>
              ))}
            </select>
            {/* Icon mũi tên tùy chỉnh */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg
                className="h-4 w-4 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dropdown Học kỳ */}
        <div className="relative flex flex-col gap-2">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <svg
              className="h-4 w-4 text-slate-400"
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
              className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-3 text-sm font-medium text-slate-800 transition-all duration-200 outline-none hover:border-slate-300 hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="" className="text-slate-400">
                -- Chọn học kỳ --
              </option>
              {semesterOptions?.map((option) => (
                <option key={option.value} value={option.value} className="text-slate-800">
                  {option.label}
                </option>
              ))}
            </select>
            {/* Icon mũi tên tùy chỉnh */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg
                className="h-4 w-4 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
