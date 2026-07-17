import { useState, useEffect, useRef } from "react";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { $api } from "../../../../api/client";

interface TeacherSelectCellProps {
  currentTeacherId: number;
  currentTeacherName: string;
  onChange: (teacherId: number, teacherName: string) => void;
}

export const TeacherSelectCell = ({
  currentTeacherId,
  currentTeacherName,
  onChange,
}: TeacherSelectCellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside to close dropdown and reset search input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: teachers, isLoading } = $api.useQuery(
    "get",
    "/staffs",
    {
      params: {
        query: {
          employeeRole: "TEACHER",
          keyword: debouncedQuery.trim() !== "" ? debouncedQuery.trim() : undefined,
        },
      },
    },
    {
      enabled: isOpen,
    }
  );

  return (
    <div ref={containerRef} className="relative w-60">
      <div
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
            setSearchQuery("");
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm bg-slate-50/50 hover:bg-slate-50 border rounded-lg transition-all duration-200 border-slate-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 cursor-pointer ${
          isOpen ? "border-indigo-500 bg-white ring-4 ring-indigo-500/10" : ""
        }`}
      >
        {isOpen ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Nhập tên giáo viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm"
            />
          </div>
        ) : (
          <span className={`truncate ${!currentTeacherId ? "text-slate-400 italic" : "text-slate-800 font-semibold"}`}>
            {currentTeacherName || "Chưa phân công"}
          </span>
        )}

        <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-1">
          {isLoading && isOpen ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
          ) : (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-indigo-500" : ""
              }`}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading && (
            <div className="px-4 py-3 text-xs text-slate-400 italic text-center">
              Đang tìm kiếm...
            </div>
          )}

          {!isLoading && teachers && teachers.length > 0 ? (
            teachers.map((teacher) => (
              <button
                type="button"
                key={teacher.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(teacher.id!, teacher.fullName || "---");
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between text-slate-700 ${
                  teacher.id === currentTeacherId ? "bg-indigo-50 text-indigo-600 font-semibold" : ""
                }`}
              >
                <span className="truncate pr-2">{teacher.fullName}</span>
                {teacher.email && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px] font-mono">
                    {teacher.email}
                  </span>
                )}
              </button>
            ))
          ) : (
            !isLoading && (
              <div className="px-4 py-3 text-xs text-slate-400 text-center italic">
                Không tìm thấy giáo viên
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
