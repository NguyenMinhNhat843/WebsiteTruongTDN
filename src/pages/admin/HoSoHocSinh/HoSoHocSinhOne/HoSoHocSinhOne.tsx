import Breadcrumb from "../../../../components/ui/Breadcrum";
import { useHocSinhContext, type StatusHocSinhEnum } from "../HocSinhProvider";
import { StudentDocuments } from "./HoSoFile";
import {
  HoSoHocSinhOneProvider,
  useHoSoHocSinhOneContext,
} from "./HoSoHocSinhOneProvider";

const HoSoHocSinhOne = () => {
  return (
    <HoSoHocSinhOneProvider>
      <Inner />
    </HoSoHocSinhOneProvider>
  );
};

const Inner = () => {
  const {
    hoSoNhapHocItems,
    isLoadingHoSoNhapHoc,
    hoSoHocSinh,
    isLoadingHoSoHocSinh,
    dataHoSoHocSinh,
  } = useHoSoHocSinhOneContext();
  const { studentDetail, isGettingStudentDetail } = useHocSinhContext();

  // Trạng thái Loading
  if (isGettingStudentDetail) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-lg font-medium text-gray-600">
          Đang tải thông tin học sinh...
        </span>
      </div>
    );
  }

  // Trường hợp không có dữ liệu
  if (!studentDetail) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">
        <p className="text-xl font-semibold">
          Không tìm thấy thông tin học sinh.
        </p>
      </div>
    );
  }

  // Hàm helper định dạng ngày tháng
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Hàm chuyển đổi giới tính
  const renderGender = (gender: boolean | null | undefined) => {
    if (gender === true) return "Nam";
    if (gender === false) return "Nữ";
    return "---";
  };

  // Hàm hiển thị Badge trạng thái
  const renderStatusBadge = (status: StatusHocSinhEnum) => {
    const statusMap = {
      studying: {
        text: "Đang học",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      graduated: {
        text: "Đã tốt nghiệp",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      suspended: {
        text: "Bảo lưu",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      dropped: {
        text: "Thôi học",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      approved: {
        text: "Đã duyệt nhập học",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      },
      expelled: {
        text: "Buộc thôi học",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
    };
    const current = statusMap[status] || {
      text: status,
      color: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${current.color}`}
      >
        {current.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <Breadcrumb
        items={[
          {
            label: "Hồ sơ học sinh",
            link: "/admin/hoc-sinh/ho-so",
          },
          {
            label: `${studentDetail.fullName}`,
            active: true,
          },
        ]}
      />
      <div className="space-y-6 mt-4">
        {/* ================= HEADER PROFILE ================= */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            {/* Avatar */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-4 ring-slate-50">
              {studentDetail.avatarUrl ? (
                <img
                  src={studentDetail.avatarUrl}
                  alt={studentDetail.fullName || "Avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-50 text-3xl font-bold text-blue-600">
                  {studentDetail.fullName?.charAt(0).toUpperCase() || "H"}
                </div>
              )}
            </div>

            {/* Thông tin chính */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {studentDetail.fullName || "Chưa cập nhật"}
                </h1>
                {renderStatusBadge(studentDetail.status)}
              </div>

              <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-gray-500 sm:grid-cols-2 md:grid-cols-3">
                <p>
                  Mã học sinh:{" "}
                  <span className="font-semibold text-gray-700">
                    {studentDetail.studentCode}
                  </span>
                </p>
                <p>
                  Khóa đào tạo:{" "}
                  <span className="font-semibold text-gray-700">
                    {studentDetail.batch?.batchCode ||
                      studentDetail.batchId ||
                      "---"}
                  </span>
                </p>
                <p>
                  Lớp học:{" "}
                  <span className="font-semibold text-gray-700">
                    {studentDetail.class?.className ||
                      studentDetail.classId ||
                      "---"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= GRID CONTENT ================= */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN & TRƯỜNG HỌC (Chiếm 2/3 trên màn hình lớn) */}
          <div className="space-y-6 md:col-span-2">
            {/* Khối 1: Thông tin cá nhân */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Thông Tin Cá Nhân
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Ngày sinh"
                  value={formatDate(studentDetail.dob)}
                />
                <InfoItem
                  label="Giới tính"
                  value={renderGender(studentDetail.gender)}
                />
                <InfoItem label="Số điện thoại" value={studentDetail.phone} />
                <InfoItem label="Email" value={studentDetail.email} />
                <InfoItem
                  label="Số CCCD/Định danh"
                  value={studentDetail.identityNumber}
                />
                <InfoItem
                  label="Địa chỉ hiện tại"
                  value={studentDetail.address}
                  className="sm:col-span-2"
                />
              </div>
            </div>

            {/* Khối 2: Thông tin nhập học / Hệ thống */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <svg
                  className="h-5 w-5 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Thông Tin Nhập Học & Hệ Thống
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Ngày nhập học"
                  value={formatDate(studentDetail.enrollmentDate)}
                />
                <InfoItem
                  label="Ngày tốt nghiệp (Dự kiến)"
                  value={formatDate(studentDetail.graduationDate)}
                />
                <InfoItem
                  label="Mã hồ sơ tuyển sinh"
                  value={
                    studentDetail.applicationId
                      ? `#${studentDetail.applicationId}`
                      : "---"
                  }
                />
                <InfoItem
                  label="ID Tài khoản liên kết"
                  value={
                    studentDetail.userId ? `#${studentDetail.userId}` : "---"
                  }
                />
              </div>
            </div>

            <StudentDocuments documents={dataHoSoHocSinh} />
          </div>

          {/* CỘT PHẢI: THÔNG TIN GIA ĐÌNH & NGƯỜI GIÁM HỘ (Chiếm 1/3 trên màn hình lớn) */}
          <div className="space-y-6 md:col-span-1">
            {/* Khối Cha */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Thông Tin Cha
              </h2>
              <div className="space-y-3">
                <InfoItemVertical
                  label="Họ và tên"
                  value={studentDetail.fatherName}
                />
                <InfoItemVertical
                  label="Số điện thoại"
                  value={studentDetail.fatherPhone}
                />
                <InfoItemVertical
                  label="Số CCCD"
                  value={studentDetail.fatherCCCD}
                />
                <div className="grid grid-cols-2 gap-2">
                  <InfoItemVertical
                    label="Năm sinh"
                    value={studentDetail.fatherYearOfBirth}
                  />
                  <InfoItemVertical
                    label="Nghề nghiệp"
                    value={studentDetail.fatherJob}
                  />
                </div>
              </div>
            </div>

            {/* Khối Mẹ */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                Thông Tin Mẹ
              </h2>
              <div className="space-y-3">
                <InfoItemVertical
                  label="Họ và tên"
                  value={studentDetail.motherName}
                />
                <InfoItemVertical
                  label="Số điện thoại"
                  value={studentDetail.motherPhone}
                />
                <InfoItemVertical
                  label="Số CCCD"
                  value={studentDetail.motherCCCD}
                />
                <div className="grid grid-cols-2 gap-2">
                  <InfoItemVertical
                    label="Năm sinh"
                    value={studentDetail.motherYearOfBirth}
                  />
                  <InfoItemVertical
                    label="Nghề nghiệp"
                    value={studentDetail.motherJob}
                  />
                </div>
              </div>
            </div>

            {/* Khối Người giám hộ */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                Người Giám Hộ{" "}
                {studentDetail.guardianRelationship
                  ? `(${studentDetail.guardianRelationship})`
                  : ""}
              </h2>
              <div className="space-y-3">
                <InfoItemVertical
                  label="Họ và tên"
                  value={studentDetail.guardianName}
                />
                <InfoItemVertical
                  label="Số điện thoại"
                  value={studentDetail.guardianPhone}
                />
                <InfoItemVertical
                  label="Số CCCD"
                  value={studentDetail.guardianCCCD}
                />
                <div className="grid grid-cols-2 gap-2">
                  <InfoItemVertical
                    label="Năm sinh"
                    value={studentDetail.guardianYearOfBirth}
                  />
                  <InfoItemVertical
                    label="Nghề nghiệp"
                    value={studentDetail.guardianJob}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hệ thống Footprint thời gian */}
        <div className="text-right text-xs text-gray-400 space-x-4">
          <span>Ngày tạo hồ sơ: {formatDate(studentDetail.createdAt)}</span>
          <span>Cập nhật cuối: {formatDate(studentDetail.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default HoSoHocSinhOne;

/* ================= COMPONENT CON ĐỂ TÁI SỬ DỤNG ================= */

// Dùng cho Layout hàng ngang ở cột trái
const InfoItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number | null | undefined;
  className?: string;
}) => (
  <div
    className={`space-y-1 p-2 rounded-lg hover:bg-slate-50 transition-colors ${className}`}
  >
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
      {label}
    </span>
    <p className="text-sm font-semibold text-gray-700">{value || "---"}</p>
  </div>
);

// Dùng cho Layout hàng dọc ở khối Gia đình (Cột phải)
const InfoItemVertical = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="text-sm">
    <span className="text-gray-400 text-xs">{label}: </span>
    <span className="font-medium text-gray-800 block sm:inline">
      {value || "---"}
    </span>
  </div>
);
