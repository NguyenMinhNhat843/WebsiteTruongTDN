import { useNavigate } from "react-router-dom";
import { USER_ROLE, type User } from "../../../features/users/types/User.types";

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

      <button
        onClick={handleLogout}
        className="ml-2 p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-slate-400"
        title="Đăng xuất"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default UserProfileHeader;
