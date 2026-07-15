import React, { useState } from "react";
import {
  User,
  Lock,
  Shield,
  X,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { $api } from "../../api/client";
import { UserRoles, type EnumRoleUser } from "../../api/enum";

// Bản đồ dịch vai trò sang Tiếng Việt chuẩn giáo dục
export const UserRoleViMap: Record<EnumRoleUser, string> = {
  admin: "Quản trị viên",
  teacher: "Giáo viên",
  staff: "Nhân viên",
  student: "Học sinh",
};

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId?: number;
  studentId?: number;
}

export default function RegisterModal({
  isOpen,
  onClose,
  staffId,
  studentId,
}: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // API Đăng ký
  const { mutate: register, isPending: isRegistering } = $api.useMutation(
    "post",
    "/auth/register",
  );

  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    role: EnumRoleUser;
  }>({
    username: "",
    password: "",
    // Tự động gợi ý vai trò hợp lý nhất dựa trên ID truyền vào, nếu không thì mặc định là admin
    role: (studentId
      ? "student"
      : staffId
        ? "teacher"
        : "admin") as EnumRoleUser,
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage(null); // Xóa thông báo lỗi khi người dùng sửa dữ liệu
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Kiểm tra dữ liệu hợp lệ trước khi gửi
    if (
      !formData.username.trim() ||
      !formData.password.trim() ||
      !formData.role
    ) {
      setErrorMessage("Vui lòng nhập đầy đủ các thông tin bắt buộc.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Mật khẩu bảo mật phải chứa ít nhất 6 ký tự.");
      return;
    }

    register(
      {
        body: {
          ...formData,
          staffId: staffId || undefined,
          studentId: studentId || undefined,
        },
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setFormData({ username: "", password: "", role: "admin" });
          setTimeout(() => {
            onClose();
            setIsSuccess(false);
            window.location.reload();
          }, 1500); // Đợi 1.5s để hiển thị thông báo thành công mượt mà trước khi reload
        },
        onError: (error: any) => {
          console.error("Đăng ký thất bại:", error);
          setErrorMessage(
            error?.response?.data?.message ||
              error?.message ||
              "Đăng ký tài khoản thất bại. Vui lòng kiểm tra lại đường truyền hoặc thông tin.",
          );
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Nhãn tự động nhận diện hồ sơ liên kết */}
        {(staffId || studentId) && (
          <div className="flex items-center gap-2 px-6 py-2.5 bg-blue-50/80 border-b border-blue-100 text-blue-700 text-xs font-semibold">
            {studentId ? (
              <>
                <GraduationCap size={16} className="text-blue-600 shrink-0" />
                <span>
                  Liên kết tự động hồ sơ Học sinh: <strong>#{studentId}</strong>
                </span>
              </>
            ) : (
              <>
                <Briefcase size={16} className="text-blue-600 shrink-0" />
                <span>
                  Liên kết tự động hồ sơ Nhân sự/Giáo viên:{" "}
                  <strong>#{staffId}</strong>
                </span>
              </>
            )}
          </div>
        )}

        {/* Nút Đóng Modal */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          type="button"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          {/* MÀN HÌNH ĐĂNG KÝ THÀNH CÔNG */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-300">
              <div className="rounded-full bg-emerald-50 p-4 mb-4 text-emerald-500 animate-bounce">
                <CheckCircle2 size={48} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Tạo tài khoản thành công!
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-[280px]">
                Hệ thống đang đồng bộ dữ liệu học viên và làm mới trang...
              </p>
            </div>
          ) : (
            <>
              {/* TIÊU ĐỀ CHÍNH */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Cấp Tài Khoản
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Đăng ký thông tin định danh để truy cập Hệ thống Quản lý Đào
                  tạo
                </p>
              </div>

              {/* THÔNG BÁO LỖI INLINE */}
              {errorMessage && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-red-700 border border-red-100 text-sm">
                  <AlertCircle
                    size={18}
                    className="shrink-0 mt-0.5 text-red-500"
                  />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* BIỂU MẪU ĐĂNG KÝ */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* COMPONENT INPUT: TÊN ĐĂNG NHẬP */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Tên đăng nhập (Username){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Nhập tên đăng nhập học viên/nhân viên..."
                      className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* COMPONENT INPUT: MẬT KHẨU */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Mật khẩu (Password) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
                      className="block w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* COMPONENT SELECT: VAI TRÒ TRONG HỆ THỐNG */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Vai trò hệ thống <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield size={18} className="text-slate-400" />
                    </div>
                    <select
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800"
                    >
                      <option value="" disabled>
                        Chọn vai trò người dùng...
                      </option>
                      {UserRoles.map((role) => (
                        <option key={role} value={role}>
                          {UserRoleViMap[role] || role}
                        </option>
                      ))}
                    </select>
                    {/* Icon mũi tên tuỳ chỉnh thay cho mặc định của trình duyệt */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* NÚT THỰC THI (SUBMIT BUTTON) */}
                <div className="pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Đang xử lý kích hoạt...</span>
                      </>
                    ) : (
                      <span>Kích Hoạt Tài Khoản</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
