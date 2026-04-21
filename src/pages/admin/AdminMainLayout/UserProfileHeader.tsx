import { useNavigate } from "react-router-dom";
import { USER_ROLE, type User } from "../../../features/users/types/User.types";
import ButtonAction from "../../../components/ui/ButtonAction";
import { Globe, LogOut } from "lucide-react";

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
    <div className="flex items-center gap-4 p-2 bg-white shadow-md border border-slate-100">
      {/* Avatar giả lập với chữ cái đầu của tên */}
      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-inner">
        {user?.name?.charAt(0).toUpperCase()}
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-800 leading-none">
          {user.name}
        </span>
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-tighter mt-1">
          {/* Badge hiển thị Role */}
          <span
            className={`px-1.5 py-0.5 rounded ${
              user.role === USER_ROLE.ADMIN
                ? "bg-red-50 text-red-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {user.role}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Nút Đăng xuất */}
        <ButtonAction
          icon={<LogOut size={18} />}
          label="Đăng xuất"
          onClick={handleLogout}
          title="Đăng xuất khỏi hệ thống"
        />

        {/* Ví dụ nút thứ 2 (có thể là Thoát hoặc Tắt máy tùy ngữ cảnh) */}
        <ButtonAction
          icon={<Globe size={18} />}
          label="Ghé thăm website"
          onClick={() => console.log("Thoát ứng dụng")}
        />
      </div>
    </div>
  );
};

export default UserProfileHeader;
