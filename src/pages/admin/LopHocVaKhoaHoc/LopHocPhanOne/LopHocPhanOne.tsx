import Header from "./components/Header";
import {
  LopHocPhanOneProvider,
  useLopHocPhanOneContext,
} from "./LopHocPhanOneProvider";
import {
  BookOpen,
  User,
  Calendar,
  Users,
  Hash,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Bookmark,
  CalendarDays,
} from "lucide-react";
import TableHocSinhVoiDiem from "./TableHocSinhVoiDiem";
import ModalAddStudent from "./ModalAddStudent";
import SectionSubmissionHistory from "./SectionSubmissionHistory";

const LopHocPhanOne = () => {
  return (
    <LopHocPhanOneProvider>
      <Inner />
    </LopHocPhanOneProvider>
  );
};

const Inner = () => {
  const {
    lopHocPhanDetail,
    isLoadingLopHocPhanDetail,
    lopHocPhanId,
    isOpenModalAddStudent,
    setIsOpenModalAddStudent,
  } = useLopHocPhanOneContext();

  // Định dạng hiển thị ngày giờ dạng: 14:30, 15 Th05, 2026
  const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Chưa thiết lập";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Loading Skeleton State
  if (isLoadingLopHocPhanDetail) {
    return (
      <div className="w-full space-y-6 p-6 animate-pulse bg-slate-50/50 min-h-screen">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-slate-200 rounded-2xl"></div>
            <div className="h-64 bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Khung rỗng nếu không tìm thấy dữ liệu
  if (!lopHocPhanDetail) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <AlertCircle size={40} className="text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">
          Không tìm thấy dữ liệu
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Lớp học phần # {lopHocPhanId} không tồn tại hoặc dữ liệu bị thiếu.
        </p>
      </div>
    );
  }

  const {
    courseName,
    maxStudents,
    currentStudents,
    registrationStart,
    registrationEnd,
    startDate,
    endDate,
    registrations,
    teacher,
    subject,
    baseClass,
  } = lopHocPhanDetail;

  // Tính phần trăm sĩ số lớp điền đầy
  const fillPercentage = Math.min(
    100,
    Math.round((currentStudents / maxStudents) * 100),
  );

  return (
    <div className="w-full bg-slate-50/50 min-h-screen p-4 md:p-8 text-slate-600">
      {/* 1. THANH ĐIỀU HƯỚNG TRÊN (HEADER BAR) */}
      <Header />

      {/* 2. KHU VỰC BỐ CỤC CHÍNH (MAIN LAYOUT) */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HÀNG 1: THÔNG TIN TỔNG QUAN, SĨ SỐ & MỐC THỜI GIAN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Thông tin chung */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-1">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <BookOpen size={18} className="text-blue-500" />
              Thông tin tổng quan học phần
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 shrink-0">
                  <Bookmark size={18} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    Tên lớp học phần
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {courseName || "Chưa cập nhật"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    Môn học gốc
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {subject?.subjectName}{" "}
                    <span className="text-slate-400 text-xs font-mono">
                      ({subject?.subjectCode})
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    Giảng viên giảng dạy
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {teacher?.fullName || "Chưa phân công giáo viên"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 shrink-0">
                  <Hash size={18} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    Lớp hành chính cơ sở
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {baseClass
                      ? `${baseClass.className} (${baseClass.classCode})`
                      : "Lớp mở tự do"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Box Sĩ số & Giới hạn */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Tỷ lệ lấp đầy sĩ số
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">
                  {currentStudents}
                </span>
                <span className="text-slate-400 text-sm font-medium">
                  / tối đa {maxStudents} sinh viên
                </span>
              </div>

              {/* Thanh Progress bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full mt-4 overflow-hidden border border-slate-50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fillPercentage >= 90
                      ? "bg-rose-500"
                      : fillPercentage >= 70
                        ? "bg-amber-500"
                        : "bg-blue-600"
                  }`}
                  style={{ width: `${fillPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 mt-4 font-medium border-t border-slate-50 pt-3">
              <span>Đã đăng ký: {fillPercentage}%</span>
              <span> Còn trống: {maxStudents - currentStudents} chỗ </span>
            </div>
          </div>

          {/* Box Các mốc thời gian quan trọng */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Khung mốc thời gian
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    Mở cổng đăng ký
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {formatDateTime(registrationStart)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 text-rose-500 rounded-xl shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    Đóng cổng đăng ký
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {formatDateTime(registrationEnd)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 text-slate-500 rounded-xl shrink-0 mt-0.5">
                  <Calendar size={16} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    Ngày bắt đầu học (Dự kiến)
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {formatDateTime(startDate)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 text-slate-500 rounded-xl shrink-0 mt-0.5">
                  <CalendarDays size={16} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    Ngày bế mạc môn (Dự kiến)
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {formatDateTime(endDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HÀNG 2: KHU VỰC CHỨA TABLE */}
        <div className="w-full">
          {lopHocPhanDetail.status === "open" ? (
            <TableHocSinhVoiDiem />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Users size={18} className="text-blue-500" />
                    Danh sách sinh viên đã đăng ký
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hiển thị các sinh viên đã hoàn tất thủ tục ghi danh
                  </p>
                </div>
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
                  {registrations?.length || 0} Thành viên
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/20">
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Mã SV
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Họ và Tên
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Thời gian đăng ký
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Ghi chú
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrations && registrations.length > 0 ? (
                      registrations.map((reg) => (
                        <tr
                          key={reg.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-slate-800 font-mono tracking-wide">
                            {reg.student?.studentCode}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                            {reg.student?.fullName}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {formatDateTime(reg.registeredAt)}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400 italic max-w-50 truncate">
                            {reg.note || "—"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                              <CheckCircle size={12} />
                              Thành công
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-slate-400 italic bg-white"
                        >
                          Chưa có sinh viên nào ghi danh vào học phần này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <SectionSubmissionHistory />
      </div>

      <ModalAddStudent
        isOpen={isOpenModalAddStudent}
        onClose={() => setIsOpenModalAddStudent(false)}
      />
    </div>
  );
};

export default LopHocPhanOne;
