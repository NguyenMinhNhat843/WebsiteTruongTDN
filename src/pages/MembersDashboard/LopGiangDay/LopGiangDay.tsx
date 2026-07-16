import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Users,
  DoorOpen,
  Eye,
  LayoutGrid,
  GraduationCap,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import {
  LopGiangDayProvider,
  useLopGiangDayContext,
} from "./LopGiangDayProvider";
import { useNavigate } from "react-router-dom";

const LopHocTeacher = () => {
  return (
    <LopGiangDayProvider>
      <Inner />
    </LopGiangDayProvider>
  );
};

const Inner = () => {
  const {
    hocKysData,
    classList,
    isLoading,
    setSearchParams,
    semesterIdNumber,
    currentSemester,
  } = useLopGiangDayContext();
  const navigate = useNavigate();

  // Tự động chọn học kỳ hiện tại khi tải trang
  useEffect(() => {
    if (!semesterIdNumber && hocKysData) {
      const currentHocKy = hocKysData.find((hk) => hk.id === currentSemester?.id);
      if (currentHocKy) {
        setSearchParams({ semesterId: String(currentHocKy.id) });
      }
    }
  }, [hocKysData]);

  const [isSemesterOpen, setIsSemesterOpen] = useState(false);
  const currentHocKy = hocKysData?.find((hk) => hk.id === semesterIdNumber);

  // Thống kê
  const totalClasses = classList?.length || 0;
  const totalStudents =
    classList?.reduce((acc, curr) => acc + (curr?.baseClass?.currentSize || 0), 0) || 0;
  const uniqueSubjects = new Set(classList?.map((c) => c?.subject?.subjectCode)).size;

  // Nhóm các lớp theo môn học
  const groupedBySubject = useMemo(() => {
    if (!classList) return {};
    return classList.reduce(
      (acc, cls) => {
        const key = cls?.subject?.subjectCode || "unknown";
        if (!acc[key]) {
          acc[key] = {
            subject: cls.subject,
            classes: [],
          };
        }
        acc[key].classes.push(cls);
        return acc;
      },
      {} as Record<string, { subject: any; classes: typeof classList }>,
    );
  }, [classList]);

  return (
    <PageShell
      title="Các lớp học"
      sub="Quản lý danh sách lớp học và môn học đang giảng dạy."
      icon={LayoutGrid}
    >
      <div className="space-y-6">
        {/* === Bộ lọc học kỳ === */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 relative z-40">
          <div className="relative w-full sm:w-72">
            <label className="text-xs font-semibold text-slate-500 block mb-1.5 px-0.5">
              Học kỳ đang xem
            </label>
            <button
              type="button"
              className={`w-full text-left bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-medium transition-all flex items-center justify-between focus:outline-none h-[44px] ${isSemesterOpen
                  ? "border-blue-500 ring-4 ring-blue-500/10 bg-white text-slate-900"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100/70"
                }`}
              onClick={() => setIsSemesterOpen(!isSemesterOpen)}
            >
              <span className="flex items-center gap-2 truncate">
                {currentHocKy?.name || "Chọn học kỳ để xem"}
                {currentHocKy?.isCurrent && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSemesterOpen ? "rotate-180 text-blue-500" : ""}`}
              />
            </button>

            {isSemesterOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsSemesterOpen(false)}
                />
                <div className="absolute left-0 w-full mt-1.5 bg-white border border-slate-200/80 rounded-xl shadow-xl z-40 max-h-60 overflow-y-auto py-1">
                  {hocKysData?.map((hk) => (
                    <button
                      key={hk.id}
                      type="button"
                      onClick={() => {
                        setSearchParams({ semesterId: String(hk.id) });
                        setIsSemesterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${semesterIdNumber === hk.id
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-slate-700"
                        }`}
                    >
                      <span className="truncate pr-4">{hk.name}</span>
                      {hk.isCurrent && (
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* === Thẻ thống kê === */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <DoorOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Lớp đang dạy</p>
              <p className="text-2xl font-bold text-slate-900">
                {isLoading ? "---" : totalClasses}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Môn học phụ trách</p>
              <p className="text-2xl font-bold text-slate-900">
                {isLoading ? "---" : uniqueSubjects}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng số học sinh</p>
              <p className="text-2xl font-bold text-slate-900">
                {isLoading ? "---" : totalStudents}
              </p>
            </div>
          </div>
        </div>

        {/* === Danh sách lớp === */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-slate-100 shadow-sm gap-3 text-slate-400">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm font-medium">Đang tải dữ liệu lớp học...</p>
          </div>
        ) : !classList || classList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-slate-100 shadow-sm gap-3 text-slate-400">
            <GraduationCap className="w-12 h-12 text-slate-200" />
            <p className="text-sm font-medium">
              {semesterIdNumber
                ? "Không có lớp học nào trong học kỳ này"
                : "Vui lòng chọn học kỳ để xem danh sách lớp"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBySubject).map(([subjectCode, group]) => (
              <div key={subjectCode} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header môn học */}
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 to-slate-50 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      {group.subject?.subjectName || "Môn học chưa xác định"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Mã môn:{" "}
                      <span className="font-mono font-semibold text-blue-600">
                        {subjectCode}
                      </span>
                      {group.subject?.credits && (
                        <> · {group.subject.credits} tín chỉ</>
                      )}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                      {group.classes.length} lớp
                    </span>
                  </div>
                </div>

                {/* Danh sách lớp của môn */}
                <div className="divide-y divide-slate-50">
                  {group.classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/teacher/lop-hoc/${cls.classId}`,
                        )
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-700 font-bold text-sm">
                          {cls.baseClass?.classCode?.slice(0, 2) || "??"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {cls.baseClass?.className || "Lớp chưa đặt tên"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Mã lớp:{" "}
                            <span className="font-mono font-semibold">
                              {cls.baseClass?.classCode || "---"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-700">
                            {cls.baseClass?.currentSize || 0}
                          </span>
                          <span>học sinh</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/teacher/nhap-diem?classSubjectId=${cls.id}&classId=${cls.classId}`,
                            );
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Nhập điểm
                        </button>

                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default LopHocTeacher;
