import Breadcrumb from "../../../../components/ui/Breadcrum";
import { useQuanLyNguoiDungContext } from "../QuanLyNguoiDungContext";

const NhanVienOne = () => {
  const { staffDetail, isLoadingStaffDetail } = useQuanLyNguoiDungContext();

  // 1. Trạng thái đang tải dữ liệu
  if (isLoadingStaffDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-500 font-medium">
          Đang tải thông tin nhân viên...
        </span>
      </div>
    );
  }

  // 2. Trạng thái không tìm thấy dữ liệu
  if (!staffDetail) {
    return (
      <div className="p-6 text-center bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
        Không tìm thấy thông tin chi tiết của nhân viên này hoặc dữ liệu không
        tồn tại.
      </div>
    );
  }

  // Hàm helper format ngày tháng an toàn
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <Breadcrumb
        items={[
          {
            label: "Hồ sơ giáo viên",
            link: "/admin/users",
          },
          {
            label: `${staffDetail.fullName} - ${staffDetail.staffCode}`,
          },
        ]}
      />
      {/* HEADER PROFILE */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center flex-shrink-0">
          {staffDetail.avatarUrl ? (
            <img
              src={staffDetail.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-slate-400">
              {staffDetail.fullName?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="text-center md:text-left space-y-2 flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">
              {staffDetail.fullName}
            </h1>
            <div className="flex gap-2 justify-center md:justify-start">
              {staffDetail.staffCode && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                  {staffDetail.staffCode}
                </span>
              )}
              {staffDetail.EmployeeRole && (
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border ${
                    staffDetail.EmployeeRole === "TEACHER"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : "bg-rose-50 text-rose-600 border-rose-100"
                  }`}
                >
                  {staffDetail.EmployeeRole}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Mã định danh hệ thống: #{staffDetail.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN & TÀI KHOẢN */}
        <div className="lg:col-span-2 space-y-6">
          {/* MỤC 1: THÔNG TIN CÁ NHÂN */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Thông tin cá nhân
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Ngày sinh
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {formatDate(staffDetail.dob)}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Giới tính
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {staffDetail.gender === true
                    ? "Nam"
                    : staffDetail.gender === false
                      ? "Nữ"
                      : "-"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Số CCCD / CMND
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {staffDetail.identityNumber ?? "-"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Số điện thoại
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {staffDetail.phone ?? "-"}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Địa chỉ liên hệ
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {staffDetail.address ?? "-"}
                </span>
              </div>
            </div>
          </div>

          {/* MỤC 2: DANH SÁCH MÔN ĐĂNG KÝ GIẢNG DẠY */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Danh sách môn đăng ký giảng dạy
            </h2>
            {/* Trạng thái chưa có thông tin */}
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <svg
                className="w-12 h-12 text-slate-300 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="text-sm text-slate-400 font-medium">
                Chưa có thông tin đăng ký giảng dạy
              </p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN CÔNG VIỆC & HỆ THỐNG */}
        <div className="space-y-6">
          {/* MỤC 3: THÔNG TIN CÔNG VIỆC */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Thông tin công việc
            </h2>
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Phòng ban (ID)
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {staffDetail.departmentId ?? "-"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Loại hợp đồng
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {staffDetail.contractType ?? "-"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Hệ số lương
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {staffDetail.salaryCoefficient ?? "-"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Ngày vào làm
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {formatDate(staffDetail.hireDate)}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Vai trò
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {staffDetail.EmployeeRole === "TEACHER"
                    ? "Giáo viên"
                    : "Nhân viên hành chính"}
                </span>
              </div>
            </div>
          </div>

          {/* MỤC 4: TÀI KHOẢN HỆ THỐNG */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Tài khoản liên kết
            </h2>
            {staffDetail.user ? (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-medium text-slate-400 uppercase">
                    Tên tài khoản
                  </span>
                  <span className="text-sm font-mono font-bold text-blue-600">
                    {staffDetail.user.username}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400 uppercase">
                    Email liên kết
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {staffDetail.email}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400 uppercase">
                    Trạng thái
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-bold rounded ${
                      staffDetail.user.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {staffDetail.user.isActive ? "Hoạt động" : "Đang khóa"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 text-amber-700 text-xs rounded-lg border border-amber-100">
                Nhân viên này hiện chưa được kích hoạt hoặc liên kết với tài
                khoản người dùng hệ thống.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NhanVienOne;
