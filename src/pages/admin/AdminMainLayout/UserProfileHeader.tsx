import { useNavigate } from "react-router-dom";
import { USER_ROLE, type User } from "../../../features/users/types/User.types";
import { Bell, Globe, LogOut } from "lucide-react";

const UserProfileHeader = () => {
  const navigate = useNavigate();

  // 1. Lấy dữ liệu và ép kiểu (Cần bọc trong try-catch để an toàn)
  const getUserData = (): User | null => {
    try {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Lỗi parse user data:", error);
      return null;
    }
  };

  const user = getUserData();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-6 p-2 border-b border-slate-300 shadow-2xl">
      {/* Profile Section */}
      <div className="flex items-center gap-3 pr-2 border-r border-slate-200">
        {/* Avatar với hiệu ứng Hover Gradient */}
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-black">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end mr-1">
          <span className="text-sm font-bold text-slate-800 leading-tight">
            {user.name}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5 ${
              user.role === USER_ROLE.ADMIN
                ? "bg-rose-50 text-rose-500"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            {user.role}
          </span>
        </div>

        {/* Action Buttons: Tinh gọn thành dạng Circle Ghost Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.open("http://localhost:5173/", "_blank")}
            title="Ghé thăm website"
            className="p-2 cursor-pointer text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
          >
            <Globe size={18} />
          </button>

          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="p-2 text-slate-400 cursor-pointer hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
      {/* Notification Hub (Optional but adds 'Pro' feel) */}
      <button className="relative text-slate-400 hover:text-indigo-600 transition-colors">
        <div className="absolute cursor-pointer -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
        <Bell size={20} />
      </button>
    </div>
  );
};

export default UserProfileHeader;
