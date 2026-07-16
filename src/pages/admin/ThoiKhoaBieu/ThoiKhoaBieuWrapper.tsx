import { Calendar, ChevronDown } from "lucide-react";
import {
  ThoiKhoaBieuProvider,
  useThoiKhoaBieuContext,
} from "./ThoiKhoaBieuProvider";
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

  const currentSelectedSemester = hocKysData?.find((hk) => hk.id === semesterId);
  const semester = currentSelectedSemester;

  return (
    <PageShell
      title="Thời khóa biểu"
      sub="Quản lý thời khóa biểu của các lớp học"
      icon={Calendar}
    >
      <div className="space-y-6">
        {/* ================= BỘ LỌC (FILTERS) SỬ DỤNG SELECT MẶC ĐỊNH ================= */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">

          {/* 1. SELECT FOR SEMESTER (HỌC KỲ) */}
          <div className="w-full sm:w-64 space-y-1.5 relative">
            <label htmlFor="semester-select" className="text-xs font-medium text-slate-500 block h-4">
              Chọn học kỳ để xem thời khóa biểu
            </label>
            <div className="relative">
              <select
                id="semester-select"
                value={semesterId || ""}
                onChange={(e) => setSemesterId(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-[42px] appearance-none cursor-pointer"
              >
                <option value="">Chọn học kỳ để xem</option>
                {hocKysData?.map((hocKy) => (
                  <option key={hocKy.id} value={hocKy.id}>
                    {hocKy.name} {hocKy.isCurrent ? " (Học kỳ hiện tại)" : ""}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* 2. SELECT FOR CLASS (LỚP HỌC) */}
          <div className="w-full sm:w-64 space-y-1.5 relative">
            <label htmlFor="class-select" className="text-xs font-medium text-slate-500 block h-4">
              Chọn lớp học để xem thời khóa biểu
            </label>
            <div className="relative">
              <select
                id="class-select"
                value={classId || ""}
                onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-[42px] appearance-none cursor-pointer"
              >
                <option value="">Chọn lớp học để xem</option>
                {lopHocsData?.map((lopHoc) => (
                  <option key={lopHoc.id} value={lopHoc.id}>
                    {lopHoc.className}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

        </div>

        {/* ================= BẢNG NHẬN DATA THỜI KHÓA BIỂU ================= */}
        <div className="relative z-10">
          <ThoiKhoaBieuTable scheduleData={scheduleItems} semester={semester} />
        </div>
      </div>
    </PageShell>
  );
};

export default ThoiKhoaBieuWrapper;