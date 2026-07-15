import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  DollarSign,
  Award,
  Clock,
  User,
  Shield,
  Phone,
  Mail,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";

const StudentDashboard = () => {
  const { currentUser } = useAppContext();
  const userId = currentUser?.id;
  const studentId = currentUser?.profile?.id;
  const studentCode = currentUser?.profile?.studentCode;

  // 1. API: Lấy thông tin cá nhân đầy đủ của học sinh
  const { data: studentInfo, isLoading: isLoadingProfile } = $api.useQuery(
    "get",
    "/students/me",
    {},
    { enabled: !!userId }
  );

  // 2. API: Lấy thống kê kết quả học tập
  const { data: academicSummaryRes, isLoading: isLoadingSummary } = $api.useQuery(
    "get",
    "/grades/summary-widget/{userId}",
    {
      params: {
        path: { userId: userId! }
      }
    },
    { enabled: !!userId }
  );

  // 3. API: Lấy danh sách học kỳ
  const { data: semesters } = $api.useQuery(
    "get",
    "/semesters",
    {
      params: {
        query: {
          studentId: studentId!
        }
      }
    },
    { enabled: !!studentId }
  );

  // 4. API: Lấy đợt thu học phí hiện tại để kiểm tra công nợ nhanh
  const currentSemester = useMemo(() => {
    return semesters?.find((s: any) => s.isCurrent);
  }, [semesters]);

  const { data: tuitionPeriods } = $api.useQuery(
    "get",
    "/tuition-periods",
    {
      params: {
        query: { semesterId: currentSemester?.id }
      }
    },
    { enabled: !!currentSemester?.id }
  );

  const activePeriod = useMemo(() => {
    return tuitionPeriods && tuitionPeriods.length > 0 ? tuitionPeriods[0] : null;
  }, [tuitionPeriods]);

  const { data: invoice } = $api.useQuery(
    "get",
    "/fee-invoices/periods/{periodId}/students/{identifier}/debt",
    {
      params: {
        path: {
          periodId: activePeriod?.id!,
          identifier: studentCode!
        }
      }
    },
    { enabled: !!activePeriod?.id && !!studentCode }
  );

  // Trích xuất thông tin học tập và biểu đồ
  const stats = academicSummaryRes?.data?.summary;
  const chartData = academicSummaryRes?.data?.chartData || [];

  // Xác định học lực dựa trên GPA tích lũy
  const getClassification = (gpa: number) => {
    if (gpa >= 9.0) return { label: "Xuất sắc", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    if (gpa >= 8.0) return { label: "Giỏi", color: "bg-blue-100 text-blue-800 border-blue-200" };
    if (gpa >= 6.5) return { label: "Khá", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
    if (gpa >= 5.0) return { label: "Trung bình", color: "bg-amber-100 text-amber-800 border-amber-200" };
    return { label: "Yếu", color: "bg-rose-100 text-rose-800 border-rose-200" };
  };

  const classif = useMemo(() => {
    return stats?.cumulativeGpa !== undefined
      ? getClassification(stats.cumulativeGpa)
      : { label: "Chưa xếp loại", color: "bg-slate-100 text-slate-800 border-slate-200" };
  }, [stats]);

  // Helper định dạng hiển thị tiền tệ VNĐ
  const formatVND = (amount: number | null | undefined) => {
    if (amount === undefined || amount === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const profileData = studentInfo || currentUser?.profile;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 animate-in fade-in duration-300">

      {/* 1. WELCOME BANNER & STUDENT CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Banner chào mừng & Thông tin học vấn */}
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          {/* Background decorations */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 top-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100">
              <Clock size={12} /> Cổng thông tin học sinh
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Xin chào, {profileData?.fullName || "Học sinh"}!
            </h1>
            <p className="text-blue-100/90 text-sm max-w-xl font-medium">
              Chào mừng bạn đến với Cổng thông tin đào tạo của nhà trường. Chúc bạn có một ngày học tập thật hiệu quả và đạt nhiều kết quả cao!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-white/15 mt-6 relative z-10 text-xs">
            <div>
              <p className="text-blue-200/90 font-medium">Lớp sinh hoạt</p>
              <p className="text-base font-bold mt-0.5">{profileData?.class?.className || "Chưa xếp lớp"}</p>
            </div>
            <div>
              <p className="text-blue-200/90 font-medium">Chuyên ngành</p>
              <p className="text-base font-bold mt-0.5">{profileData?.major?.majorName || "Chưa chọn ngành"}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-blue-200/90 font-medium">Khóa tuyển sinh</p>
              <p className="text-base font-bold mt-0.5">{profileData?.batch?.batchName || "Chưa cập nhật"}</p>
            </div>
          </div>
        </div>

        {/* Thẻ mã số học sinh và liên lạc */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                <User size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Mã số sinh viên</p>
                <p className="text-lg font-black text-slate-800 tracking-wide">{profileData?.studentCode || "-"}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <Phone size={15} className="text-slate-400 shrink-0" />
                <span className="font-medium">{profileData?.phone || "Chưa cập nhật SĐT"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail size={15} className="text-slate-400 shrink-0" />
                <span className="font-medium truncate">{profileData?.email || "Chưa cập nhật Email"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Shield size={15} className="text-slate-400 shrink-0" />
                <span className="font-bold text-xs uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                  {currentUser?.role || "STUDENT"}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/student/diem-so"
            className="mt-6 flex items-center justify-between w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl text-xs font-bold text-slate-700 border border-slate-100 hover:border-blue-100 transition-all duration-200"
          >
            Xem hồ sơ & Học bạ
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 2. STATS WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* GPA Tích lũy */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Điểm trung bình (GPA)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">
                {isLoadingSummary ? "..." : stats?.cumulativeGpa !== undefined ? stats.cumulativeGpa : "0.00"}
              </span>
              <span className="text-xs text-slate-400">/ 10</span>
            </div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border mt-2 ${classif.color}`}>
              Học lực: {classif.label}
            </span>
          </div>
          <div className="p-3.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Award size={24} />
          </div>
        </div>

        {/* Tín chỉ tích lũy */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tín chỉ tích lũy</p>
            <p className="text-3xl font-black text-slate-800">
              {isLoadingSummary ? "..." : stats?.totalAccumulatedCredits || 0}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Đủ điều kiện xét xét tuyển sinh/tốt nghiệp</p>
          </div>
          <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <BookOpen size={24} />
          </div>
        </div>

        {/* Môn học hoàn thành */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Môn đã hoàn thành</p>
            <p className="text-3xl font-black text-slate-800">
              {isLoadingSummary ? "..." : stats?.completedSubjectsCount || 0}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Đạt yêu cầu tối thiểu trên 5.0 đ</p>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* 3. GPA GRAPH & TUITION BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Biểu đồ xu hướng GPA học kỳ */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={18} /> Xu hướng GPA qua các học kỳ
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Lộ trình rèn luyện điểm số trung bình tích lũy học kỳ.</p>
          </div>

          <div className="w-full h-56 mt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="semesterName" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }}
                    labelClassName="font-bold text-slate-800"
                  />
                  <Area type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGpa)" name="Điểm GPA" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <FileText size={28} className="mb-2 text-slate-300" />
                Chưa có dữ liệu lịch sử điểm số qua các kỳ
              </div>
            )}
          </div>
        </div>

        {/* Học phí & Cảnh báo nhanh */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <DollarSign className="text-amber-600" size={18} /> Dư nợ học phí hiện tại
            </h2>

            {invoice ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Số tiền còn thiếu</p>
                  <p className="text-2xl font-black text-rose-600 mt-1">{formatVND(invoice.remainingAmount)}</p>
                </div>

                {invoice.remainingAmount > 0 ? (
                  <div className="flex gap-2.5 bg-amber-50/70 border border-amber-100 p-3.5 rounded-xl text-xs text-amber-800">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Bạn có khoản học phí chưa thanh toán thuộc <span className="font-bold">{activePeriod?.name || "học kỳ hiện tại"}</span>. Vui lòng thanh toán trước thời hạn để tránh ảnh hưởng đến việc xét thi học kỳ.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2.5 bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-xl text-xs text-emerald-800">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Tuyệt vời! Bạn đã hoàn thành nghĩa vụ đóng học phí cho học kỳ này.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <CheckCircle2 size={24} className="text-emerald-500" />
                Không có hóa đơn học phí phát sinh trong đợt này.
              </div>
            )}
          </div>

          <Link
            to="/student/hoc-phi"
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-200 transition-all duration-200"
          >
            Đến trang thanh toán học phí
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 4. QUICK LINKS / MENU TRUY CẬP NHANH */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-800">Lối tắt truy cập nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <Link
            to="/student/dao-tao/thoi-khoa-bieu"
            className="flex flex-col items-center justify-center text-center p-5 bg-white border border-slate-200/80 rounded-2xl hover:shadow-md hover:border-blue-300 hover:text-blue-600 group transition-all"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center shadow-sm mb-3 transition-all">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">Xem lịch học</span>
            <span className="text-[10px] text-slate-400 mt-1 font-medium">Lịch học hàng tuần</span>
          </Link>

          <Link
            to="/student/diem-so"
            className="flex flex-col items-center justify-center text-center p-5 bg-white border border-slate-200/80 rounded-2xl hover:shadow-md hover:border-indigo-300 hover:text-indigo-600 group transition-all"
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center shadow-sm mb-3 transition-all">
              <Award size={20} />
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Tra cứu bảng điểm</span>
            <span className="text-[10px] text-slate-400 mt-1 font-medium">Bảng điểm học kỳ</span>
          </Link>

          <Link
            to="/student/diem-ren-luyen"
            className="flex flex-col items-center justify-center text-center p-5 bg-white border border-slate-200/80 rounded-2xl hover:shadow-md hover:border-purple-300 hover:text-purple-600 group transition-all"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white rounded-2xl flex items-center justify-center shadow-sm mb-3 transition-all">
              <FileText size={20} />
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-purple-600">Điểm rèn luyện</span>
            <span className="text-[10px] text-slate-400 mt-1 font-medium">Phiếu tự đánh giá</span>
          </Link>

          <Link
            to="/student/hoc-phi"
            className="flex flex-col items-center justify-center text-center p-5 bg-white border border-slate-200/80 rounded-2xl hover:shadow-md hover:border-emerald-300 hover:text-emerald-600 group transition-all"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white rounded-2xl flex items-center justify-center shadow-sm mb-3 transition-all">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600">Học phí & Thanh toán</span>
            <span className="text-[10px] text-slate-400 mt-1 font-medium">Đóng học phí online</span>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
