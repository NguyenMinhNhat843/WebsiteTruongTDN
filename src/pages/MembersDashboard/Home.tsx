import { User, BookOpen, Layers, Shield, RefreshCw } from "lucide-react";
import { $api } from "../../api/client";
import { SelectOption } from "../../components/ui/Form/SelectOption";
import { useAppContext } from "../../AppProvider";
import { useSearchParams } from "react-router-dom";

const MemberDashboard = () => {
  const profile = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!).profile
    : null;
  const { hocKysData, isHocKysLoading, currentSemester } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const semesterId = searchParams.get("semesterId") || "";
  const semesterIdNumber = semesterId ? parseInt(semesterId) : undefined;
  const teacherId = profile?.id;

  const { data: stats, isLoading: isLoadingStats } = $api.useQuery(
    "get",
    "/staffs/{teacherId}/dashboardstats",
    {
      params: {
        path: {
          teacherId: profile?.id,
        },
        query: {
          semesterId: semesterIdNumber! || currentSemester!.id!,
        },
      },
    },
    {
      enabled:
        Boolean(teacherId) && Boolean(currentSemester?.id || semesterIdNumber),
    },
  );

  const semesterOptions =
    hocKysData?.map((hk) => ({
      value: hk.id.toString(),
      label: hk.name,
    })) || [];

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ semesterId: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 md:text-2xl tracking-tight">
            Trang tổng quan giảng dạy
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Xem thống kê và quản lý thông tin lớp học, môn học theo từng học kỳ.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <SelectOption
            label=""
            name="semesterFilter"
            value={semesterId}
            onChange={handleSemesterChange}
            options={[
              { value: "", label: "Chọn học kỳ..." },
              ...semesterOptions,
            ]}
            disabled={isHocKysLoading}
          />
        </div>
      </div>

      {isLoadingStats ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Đang tải dữ liệu thống kê...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
            {/* Hiệu ứng nền nhẹ phía sau */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50/50 rounded-full group-hover:scale-110 transition-transform duration-300" />

            {/* Avatar mặc định */}
            <div className="relative z-10 w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 mb-4 text-white">
              <User className="w-10 h-10" />
            </div>

            {/* Thông tin giáo viên */}
            <h2 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-blue-600">
              {stats?.name || "Chưa cập nhật tên"}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
              <Shield className="w-3 h-3" />
              {stats?.role || "Giáo viên"}
            </span>

            {/* Chi tiết mã số và phòng ban */}
            <div className="w-full mt-6 pt-5 border-t border-slate-100 space-y-3 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">Mã giáo viên</span>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
                  {stats?.maGiaoVien || "---"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">
                  Khoa / Phòng ban
                </span>
                <span className="font-semibold text-slate-700 max-w-[160px] truncate text-right">
                  {stats?.department || "---"}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: THẺ THỐNG KÊ (STATS CARDS) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Thẻ 1: Tổng số lớp chủ nhiệm */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-200/80 active:scale-[0.99] transition-all duration-200 cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Lớp chủ nhiệm
                  </span>
                  <h3 className="text-4xl font-black text-slate-800 font-mono tracking-tight group-hover:text-blue-600 transition-colors">
                    {stats?.totalClasses ?? 0}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Layers className="w-6 h-6" />
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium mt-4 pt-3 border-t border-slate-50">
                Số lớp học đang phụ trách quản lý ổn định nền nếp.
              </div>
            </div>

            {/* Thẻ 2: Tổng số môn học giảng dạy */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-200/80 active:scale-[0.99] transition-all duration-200 cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Môn giảng dạy
                  </span>
                  <h3 className="text-4xl font-black text-slate-800 font-mono tracking-tight group-hover:text-emerald-600 transition-colors">
                    {stats?.totalSubjects ?? 0}
                  </h3>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium mt-4 pt-3 border-t border-slate-50">
                Số học phần chuyên môn được phân công đứng lớp.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
