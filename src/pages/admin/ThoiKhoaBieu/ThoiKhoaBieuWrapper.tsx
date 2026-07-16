import { useState, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { ThoiKhoaBieuProvider, useThoiKhoaBieuContext } from "./ThoiKhoaBieuProvider";
import PageShell from "../../../components/ui/PageShell";
import { ThoiKhoaBieuTable } from "./ThoiKhoaBieu";

const ThoiKhoaBieuWrapper = () => {
  return (
    <ThoiKhoaBieuProvider>
      <InnerLayout />
    </ThoiKhoaBieuProvider>
  );
};

const InnerLayout = () => {
  const {
    semesterId,
    classId,
    lopHocsData,
    hocKysData,
    setSemesterId,
    setClassId,
    scheduleItems,
  } = useThoiKhoaBieuContext();

  const [isSemesterOpen, setIsSemesterOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);

  // local State quản lý hiển thị tạm thời tránh lag
  const [localSemesterId, setLocalSemesterId] = useState(semesterId);
  const [localClassId, setLocalClassId] = useState(classId);

  // Sync ngược lại nếu URL thay đổi (ví dụ: bấm Back/Forward trình duyệt)
  useEffect(() => { setLocalSemesterId(semesterId); }, [semesterId]);
  useEffect(() => { setLocalClassId(classId); }, [classId]);

  const currentSelectedSemester = hocKysData?.find((hk) => hk.id === localSemesterId);
  const currentSelectedClass = lopHocsData?.find((c) => c.id === localClassId);

  return (
    <PageShell
      title="Thời khóa biểu"
      sub="Quản lý thời khóa biểu của các lớp học"
      icon={Calendar}
    >
      <div className="space-y-6">
        {/* Bộ Lọc Dropdown */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-40">

          {/* Bộ lọc học kỳ */}
          <div className="relative">
            <label className="text-xs font-semibold text-slate-500 block mb-1.5 px-0.5">
              Học kỳ
            </label>
            <button
              type="button"
              className={`w-full text-left bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-medium transition-all flex items-center justify-between focus:outline-none h-[44px] ${isSemesterOpen
                  ? "border-blue-500 ring-4 ring-blue-500/10 bg-white text-slate-900"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100/70"
                }`}
              onClick={() => {
                setIsSemesterOpen(!isSemesterOpen);
                setIsClassOpen(false);
              }}
            >
              <span className="flex items-center gap-2 truncate">
                {currentSelectedSemester?.name || "Chọn học kỳ để xem"}
                {currentSelectedSemester?.isCurrent && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSemesterOpen ? "rotate-180 text-blue-500" : ""}`} />
            </button>

            {isSemesterOpen && (
              <div className="absolute left-0 mt-1.5 w-full bg-white border border-slate-200/80 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setLocalSemesterId(null);
                    setSemesterId(null);
                    setIsSemesterOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  Chọn học kỳ để xem
                </button>

                {hocKysData?.map((hocKy) => {
                  const isSelected = localSemesterId === hocKy.id;
                  return (
                    <button
                      key={hocKy.id}
                      type="button"
                      onClick={() => {
                        setLocalSemesterId(hocKy.id);
                        setSemesterId(hocKy.id); // Trigger update URL
                        setIsSemesterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${isSelected ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700"
                        }`}
                    >
                      <span className="truncate pr-4">{hocKy.name}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hocKy.isCurrent && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bộ lọc lớp học */}
          <div className="relative">
            <label className="text-xs font-semibold text-slate-500 block mb-1.5 px-0.5">
              Lớp học
            </label>
            <button
              type="button"
              className={`w-full text-left bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-medium transition-all flex items-center justify-between focus:outline-none h-[44px] ${isClassOpen
                  ? "border-blue-500 ring-4 ring-blue-500/10 bg-white text-slate-900"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100/70"
                }`}
              onClick={() => {
                setIsClassOpen(!isClassOpen);
                setIsSemesterOpen(false);
              }}
            >
              <span className="flex items-center gap-2 truncate">
                {currentSelectedClass?.className || "Chọn lớp học để xem"}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isClassOpen ? "rotate-180 text-blue-500" : ""}`} />
            </button>

            {isClassOpen && (
              <div className="absolute left-0 w-full mt-1.5 max-h-60 overflow-y-auto bg-white border border-slate-200/80 rounded-xl shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setLocalClassId(null);
                    setClassId(null);
                    setIsClassOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  Chọn lớp học để xem
                </button>

                {lopHocsData?.map((lopHoc) => {
                  const isSelected = localClassId === lopHoc.id;
                  return (
                    <button
                      key={lopHoc.id}
                      type="button"
                      onClick={() => {
                        setLocalClassId(lopHoc.id);
                        setClassId(lopHoc.id); // Trigger update URL
                        setIsClassOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${isSelected ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700"
                        }`}
                    >
                      <span className="truncate block pr-4">{lopHoc.className}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Bảng Thời Khóa Biều */}
        <div className="relative z-10 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <ThoiKhoaBieuTable scheduleData={scheduleItems} semester={currentSelectedSemester} />
        </div>
      </div>
    </PageShell>
  );
};

export default ThoiKhoaBieuWrapper;