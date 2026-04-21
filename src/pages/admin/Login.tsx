import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  USER_ROLE,
  type UserRole,
} from "../../features/users/types/User.types";
// import { SelectOption } from "../../components/ui/Form/SelectOption";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("abc@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [testRole, setTestRole] = useState<UserRole>(USER_ROLE.ADMIN);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập logic gọi API
    console.log("Logging in with:", { email, password });

    setTimeout(() => {
      setIsLoading(false);
      // Logic điều hướng dựa trên Role sẽ ở đây
      navigate("/admin/home");
      localStorage.setItem(
        "user",
        JSON.stringify({ email, role: testRole, name: `${testRole} User` }),
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      {/* Card Container */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header Section */}
        <div className="bg-indigo-600 p-8 text-white text-center">
          {/* Logo Container - Giữ nguyên hiệu ứng glassmorphism */}
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm p-1">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>

          {/* Tên trường - Dùng leading-tight để các dòng chữ sát nhau hơn khi xuống dòng */}
          <h1 className="text-lg font-medium uppercase tracking-wider opacity-90 mb-1">
            Trường Trung cấp Kinh tế - Kỹ thuật
          </h1>
          <h2 className="text-2xl font-bold leading-tight uppercase">
            Trần Đại Nghĩa
          </h2>

          {/* Divider nhẹ để ngăn cách với tiêu đề hệ thống */}
          <div className="w-12 h-1 bg-white/30 mx-auto my-3 rounded-full"></div>

          <p className="text-indigo-100 text-sm font-light tracking-widest uppercase">
            Hệ Thống Quản Trị
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email / Mã số
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="name@school.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">
                Mật khẩu
              </label>
              <a href="#" className="text-xs text-indigo-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Select giả lập để test Role nhanh */}
          {/* <SelectOption
            label="Đăng nhập với tư cách (Dành cho Test)"
            options={[
              { value: USER_ROLE.ADMIN, label: "Admin" },
              { value: USER_ROLE.TEACHER, label: "Giảng viên" },
              { value: USER_ROLE.STUDENT, label: "Sinh viên" },
            ]}
            value={testRole}
            onChange={(e) => setTestRole(e.target.value as UserRole)}
          /> */}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all 
              ${isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"}`}
          >
            {isLoading ? "Đang xác thực..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
