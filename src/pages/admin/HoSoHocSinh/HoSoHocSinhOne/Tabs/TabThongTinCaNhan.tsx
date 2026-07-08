import { ClipboardList, User } from "lucide-react";
import { useHoSoHocSinhOneContext } from "../HoSoHocSinhOneProvider";

const TabThongTinCaNhan = () => {
  const { isEditMode, formData, setFormData } = useHoSoHocSinhOneContext();

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Đảm bảo dữ liệu đã được load/clone vào formData thành công
  if (!formData) return null;

  const inputClass =
    "w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none bg-white";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Khối 1: Thông tin cá nhân */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <User className="h-5 w-5 text-blue-500" />
          Thông Tin Cá Nhân
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Họ và tên
            </label>
            {isEditMode ? (
              <input
                type="text"
                className={inputClass}
                value={formData.fullName || ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
            ) : (
              <span className="text-sm font-semibold text-gray-800">
                {formData.fullName || "---"}
              </span>
            )}
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Ngày sinh
            </label>
            {isEditMode ? (
              <input
                type="date"
                className={inputClass}
                value={formData.dob || ""}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            ) : (
              <span className="text-sm font-semibold text-gray-800">
                {formData.dob
                  ? new Date(formData.dob).toLocaleDateString("vi-VN")
                  : "---"}
              </span>
            )}
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Giới tính
            </label>
            {isEditMode ? (
              <select
                className={inputClass}
                value={
                  formData.gender === true
                    ? "male"
                    : formData.gender === false
                      ? "female"
                      : ""
                }
                onChange={(e) =>
                  handleChange(
                    "gender",
                    e.target.value === "male"
                      ? true
                      : e.target.value === "female"
                        ? false
                        : null,
                  )
                }
              >
                <option value="">---</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            ) : (
              <span className="text-sm font-semibold text-gray-800">
                {formData.gender === true
                  ? "Nam"
                  : formData.gender === false
                    ? "Nữ"
                    : "---"}
              </span>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Số điện thoại
            </label>
            {isEditMode ? (
              <input
                type="text"
                className={inputClass}
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            ) : (
              <span className="text-sm font-semibold text-gray-800">
                {formData.phone || "---"}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Email
            </label>
            {isEditMode ? (
              <input
                type="email"
                className={inputClass}
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            ) : (
              <span className="text-sm font-semibold text-gray-800">
                {formData.email || "---"}
              </span>
            )}
          </div>

          {/* Số CCCD/Định danh */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Số CCCD/Định danh
            </label>
            {isEditMode ? (
              <input
                type="text"
                className={inputClass}
                value={formData.identityNumber || ""}
                onChange={(e) => handleChange("identityNumber", e.target.value)}
              />
            ) : (
              <span className="text-sm font-semibold text-gray-800">
                {formData.identityNumber || "---"}
              </span>
            )}
          </div>

          {/* Địa chỉ hiện tại */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Địa chỉ hiện tại
            </label>
            {isEditMode ? (
              <input
                type="text"
                className={inputClass}
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            ) : (
              <span className="text-sm font-semibold text-gray-800">
                {formData.address || "---"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Khối 2: Thông tin nhập học / Hệ thống */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <ClipboardList className="h-5 w-5 text-purple-500" />
          Thông Tin Nhập Học & Hệ Thống
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Ngày nhập học */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Ngày nhập học
            </label>
            <span className="text-sm font-semibold text-gray-800">
              {formData.enrollmentDate
                ? new Date(formData.enrollmentDate).toLocaleDateString("vi-VN")
                : "---"}
            </span>
          </div>

          {/* Ngày tốt nghiệp (Dự kiến) */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Ngày tốt nghiệp (Dự kiến)
            </label>

            <span className="text-sm font-semibold text-gray-800">
              {formData.graduationDate
                ? new Date(formData.graduationDate).toLocaleDateString("vi-VN")
                : "---"}
            </span>
          </div>

          {/* Mã hồ sơ tuyển sinh - Thường không cho phép sửa, hiển thị text tĩnh */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Mã hồ sơ tuyển sinh
            </label>
            <span className="text-sm font-semibold text-gray-800">
              {formData.applicationId ? `#${formData.applicationId}` : "---"}
            </span>
          </div>

          {/* ID Tài khoản liên kết - Thường không cho phép sửa, hiển thị text tĩnh */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              ID Tài khoản liên kết
            </label>
            <span className="text-sm font-semibold text-gray-800">
              {formData.userId ? `#${formData.userId}` : "---"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabThongTinCaNhan;
