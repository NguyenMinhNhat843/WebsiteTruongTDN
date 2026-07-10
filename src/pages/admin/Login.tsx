import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { $api, setAccessToken } from "../../api/client";
import { toast } from "sonner";
import { useAppContext } from "../../AppProvider";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const { setCurrentUser } = useAppContext();

  /**
   * api login
   */
  const { mutate: login, isPending: isPendingLogin } = $api.useMutation(
    "post",
    "/auth/login",
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    login(
      {
        body: {
          username,
          password,
        },
      },
      {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        onSuccess: (data: any) => {
          // 💡 Lưu token dài hạn vào localStorage thông qua hàm setAccessToken mới
          setAccessToken(data?.access_token);
          localStorage.setItem("user", JSON.stringify(data?.user));

          setCurrentUser(data?.user);

          toast.success("Đăng nhập thành công!"); // Thêm thông báo cho đẹp

          // Điều hướng dựa trên vai trò (Role)
          if (data?.user?.role === "admin") {
            navigate("/admin/home");
            return;
          } else if (data?.user?.role === "teacher") {
            navigate("/teacher/home");
            return;
          }
        },
        onError: () => {
          toast.error(
            "Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản, mật khẩu.",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      {/* Card Container */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header Section */}
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm p-1">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>

          <h1 className="text-lg font-medium uppercase tracking-wider opacity-90 mb-1">
            Trường Trung cấp Kinh tế - Kỹ thuật
          </h1>
          <h2 className="text-2xl font-bold leading-tight uppercase">
            Trần Đại Nghĩa
          </h2>

          <div className="w-12 h-1 bg-white/30 mx-auto my-3 rounded-full"></div>

          <p className="text-indigo-100 text-sm font-light tracking-widest uppercase">
            Hệ Thống Quản Trị
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <button
            type="submit"
            disabled={isPendingLogin}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all 
              ${isPendingLogin ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"}`}
          >
            {isPendingLogin ? "Đang xác thực..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
