import { ClipboardList, User } from "lucide-react";
import InfoItem from "../../components/InfoItem";
import { formatDate } from "../../../../../util/formatDate";
import { useHocSinhContext } from "../../HocSinhProvider";

const TabThongTinCaNhan = () => {
  const { studentDetail } = useHocSinhContext();
  const renderGender = (gender: boolean | null | undefined) => {
    if (gender === true) return "Nam";
    if (gender === false) return "Nữ";
    return "---";
  };

  if (!studentDetail) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Khối 1: Thông tin cá nhân */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <User className="h-5 w-5 text-blue-500" />
          Thông Tin Cá Nhân
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoItem label="Ngày sinh" value={formatDate(studentDetail.dob)} />
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
          <ClipboardList className="h-5 w-5 text-purple-500" />
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
            value={studentDetail.userId ? `#${studentDetail.userId}` : "---"}
          />
        </div>
      </div>
    </div>
  );
};

export default TabThongTinCaNhan;
